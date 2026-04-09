import { useEffect, useState } from 'react';
import { collection, DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export type FirestoreRecord = Record<string, unknown> & { id: string };

export interface SuperAdminSnapshotState {
  users: FirestoreRecord[];
  admins: FirestoreRecord[];
  vendors: FirestoreRecord[];
  orders: FirestoreRecord[];
  rides: FirestoreRecord[];
  drivers: FirestoreRecord[];
  deliveryPartners: FirestoreRecord[];
}

export const EMPTY_SUPER_ADMIN_STATE: SuperAdminSnapshotState = {
  users: [],
  admins: [],
  vendors: [],
  orders: [],
  rides: [],
  drivers: [],
  deliveryPartners: [],
};

export const USER_ROLE_LABELS: Record<string, string> = {
  customer: 'Customers',
  vendor: 'Food Vendors',
  food_store_vendor: 'Food Vendors',
  grocery_store_vendor: 'Grocery Vendors',
  delivery_partner: 'Delivery Partners',
  service_worker: 'Service Workers',
  driver: 'Drivers',
  admin: 'Admins',
  super_admin: 'Super Admins',
  system_admin: 'System Admins',
  platform_owner: 'Platform Owners',
  customercare: 'Customer Care',
  customer_care: 'Customer Care',
  'customer care': 'Customer Care',
  operations_admin: 'Operations Admins',
  customer_care_admin: 'Customer Care Admins',
  verification_admin: 'Verification Admins',
  finance_admin: 'Finance Admins',
};

export const ADMIN_ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admins',
  system_admin: 'System Admins',
  platform_owner: 'Platform Owners',
  operations_admin: 'Operations Admins',
  customer_care_admin: 'Customer Care Admins',
  verification_admin: 'Verification Admins',
  finance_admin: 'Finance Admins',
};

export const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  disabled: 'Disabled',
  pending_verification: 'Pending Verification',
  pending_phone_verification: 'Pending Phone Verification',
  suspended: 'Suspended',
  requested: 'Requested',
  accepted: 'Accepted',
  driver_arriving: 'Driver Arriving',
  on_trip: 'On Trip',
  completed: 'Completed',
  cancelled: 'Cancelled',
  pending: 'Pending',
  preparing: 'Preparing',
  picked_up: 'Picked Up',
  out_for_delivery: 'Out For Delivery',
  delivered: 'Delivered',
  broadcasting: 'Broadcasting',
  driver_assigned: 'Driver Assigned',
  driver_arrived: 'Driver Arrived',
  worker_assigned: 'Worker Assigned',
  in_progress: 'In Progress',
  no_worker_found: 'No Worker Found',
};

const toRecords = (snapshot: QuerySnapshot<DocumentData>): FirestoreRecord[] =>
  snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

export const normalizeRoleKey = (value: unknown) => String(value ?? '').trim().toLowerCase().replace(/\s+/g, '_');

export const roleLabel = (value: unknown) => {
  const key = normalizeRoleKey(value);
  return USER_ROLE_LABELS[key] ?? (key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) || 'Unknown');
};

export const adminRoleLabel = (value: unknown) => {
  const key = normalizeRoleKey(value);
  return ADMIN_ROLE_LABELS[key] ?? roleLabel(value);
};

export const statusLabel = (value: unknown) => {
  const key = normalizeRoleKey(value);
  return STATUS_LABELS[key] ?? String(value ?? 'Unknown').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getRecordName = (record: FirestoreRecord) => {
  const name = record.name;
  if (typeof name === 'string' && name.trim()) return name;
  const vendorName = record.vendorName;
  if (typeof vendorName === 'string' && vendorName.trim()) return vendorName;
  const firstName = typeof record.firstName === 'string' ? record.firstName : '';
  const lastName = typeof record.lastName === 'string' ? record.lastName : '';
  const fullName = `${firstName} ${lastName}`.trim();
  if (fullName) return fullName;
  return 'Unnamed';
};

export const getRecordEmail = (record: FirestoreRecord) => {
  const email = record.email;
  return typeof email === 'string' ? email : 'N/A';
};

export const getRecordPhone = (record: FirestoreRecord) => {
  const phone = record.phone;
  return typeof phone === 'string' ? phone : 'N/A';
};

export const asDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    const parsed = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

export const startOfDay = (date: Date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const isSameDay = (left: Date, right: Date) => startOfDay(left).getTime() === startOfDay(right).getTime();

export const isSameMonth = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

export const getNumeric = (value: unknown) => {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
};

export const countBy = (values: string[]) =>
  values.reduce<Record<string, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});

export const useSuperAdminLiveData = () => {
  const [snapshots, setSnapshots] = useState<SuperAdminSnapshotState>(EMPTY_SUPER_ADMIN_STATE);

  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, 'users'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, users: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'admins'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, admins: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'vendors'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, vendors: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'orders'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, orders: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'rides'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, rides: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'drivers'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, drivers: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'deliveryPartners'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, deliveryPartners: toRecords(snapshot) }));
      }),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  return snapshots;
};
