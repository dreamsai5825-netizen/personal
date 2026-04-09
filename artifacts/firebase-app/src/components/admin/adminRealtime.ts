import { useEffect, useMemo, useRef, useState } from 'react';
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../../firebase';

export interface RealtimeRecord {
  id: string;
}

export interface RealtimeCollectionState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export const useRealtimeCollection = <T extends RealtimeRecord>(
  collectionName: string,
  mapRecord?: (raw: Record<string, unknown>, id: string, index: number) => T,
): RealtimeCollectionState<T> => {
  const mapRecordRef = useRef(mapRecord);
  const [state, setState] = useState<RealtimeCollectionState<T>>({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    mapRecordRef.current = mapRecord;
  }, [mapRecord]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const nextItems = snapshot.docs.map((docSnapshot, index) => {
          const raw = docSnapshot.data() as Record<string, unknown>;
          return mapRecordRef.current
            ? mapRecordRef.current(raw, docSnapshot.id, index)
            : ({ ...raw, id: docSnapshot.id } as T);
        });

        setState({
          items: nextItems,
          loading: false,
          error: null,
        });
      },
      (error) => {
        console.error(`Realtime listener failed for ${collectionName}:`, error);
        setState((current) => ({
          items: current.items,
          loading: false,
          error: error.message || `Unable to load ${collectionName}.`,
        }));
      },
    );

    return () => unsubscribe();
  }, [collectionName]);

  return state;
};

export const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (typeof value === 'object') {
    const maybeTimestamp = value as { toDate?: () => Date; seconds?: number };
    if (typeof maybeTimestamp.toDate === 'function') {
      return maybeTimestamp.toDate();
    }
    if (typeof maybeTimestamp.seconds === 'number') {
      return new Date(maybeTimestamp.seconds * 1000);
    }
  }
  return null;
};

export const formatDateTime = (value: unknown): string => {
  const parsed = toDate(value);
  if (!parsed) return 'No timestamp';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed);
};

export const formatDateShort = (value: unknown): string => {
  const parsed = toDate(value);
  if (!parsed) return 'No date';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
  }).format(parsed);
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const dateMatchesFilter = (value: unknown, filter: string): boolean => {
  if (!filter) return true;
  const parsed = toDate(value);
  if (!parsed) return false;
  return parsed.toISOString().slice(0, 10) === filter;
};

export const sameDay = (left: unknown, right: Date): boolean => {
  const parsed = toDate(left);
  if (!parsed) return false;
  return (
    parsed.getFullYear() === right.getFullYear() &&
    parsed.getMonth() === right.getMonth() &&
    parsed.getDate() === right.getDate()
  );
};

export const startsInPastDays = (value: unknown, days: number): boolean => {
  const parsed = toDate(value);
  if (!parsed) return false;
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  return parsed >= cutoff;
};

export const stringValue = (...candidates: unknown[]): string => {
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }
  return '';
};

export const numberValue = (...candidates: unknown[]): number => {
  for (const candidate of candidates) {
    if (typeof candidate === 'number' && Number.isFinite(candidate)) return candidate;
    if (typeof candidate === 'string') {
      const cleaned = Number(candidate.replace(/[^\d.-]/g, ''));
      if (Number.isFinite(cleaned)) return cleaned;
    }
  }
  return 0;
};

export const matchesSearch = (search: string, ...candidates: unknown[]): boolean => {
  if (!search.trim()) return true;
  const needle = search.trim().toLowerCase();
  return candidates.some((candidate) => String(candidate ?? '').toLowerCase().includes(needle));
};

export const statusTone = (status: string): string => {
  const normalized = status.toLowerCase();
  if (
    normalized.includes('active') ||
    normalized.includes('completed') ||
    normalized.includes('success') ||
    normalized.includes('delivered') ||
    normalized.includes('confirmed')
  ) {
    return 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/30';
  }
  if (
    normalized.includes('pending') ||
    normalized.includes('assigned') ||
    normalized.includes('arriving') ||
    normalized.includes('progress')
  ) {
    return 'bg-amber-500/15 text-amber-100 ring-1 ring-amber-300/30';
  }
  if (
    normalized.includes('cancelled') ||
    normalized.includes('failed') ||
    normalized.includes('inactive') ||
    normalized.includes('rejected')
  ) {
    return 'bg-rose-500/15 text-rose-100 ring-1 ring-rose-300/30';
  }
  return 'bg-slate-500/15 text-slate-200 ring-1 ring-slate-300/20';
};

export const useLastSevenDays = <T,>(items: T[], getDate: (item: T) => unknown) =>
  useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));
      return {
        key: date.toISOString().slice(0, 10),
        label: new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(date),
        date,
        value: 0,
      };
    });

    items.forEach((item) => {
      const parsed = toDate(getDate(item));
      if (!parsed) return;
      const key = parsed.toISOString().slice(0, 10);
      const match = days.find((day) => day.key === key);
      if (match) match.value += 1;
    });

    return days;
  }, [items, getDate]);

export const descendingByDate = <T,>(items: T[], getDate: (item: T) => unknown): T[] =>
  [...items].sort((left, right) => {
    const rightValue = toDate(getDate(right))?.getTime() ?? 0;
    const leftValue = toDate(getDate(left))?.getTime() ?? 0;
    return rightValue - leftValue;
  });
