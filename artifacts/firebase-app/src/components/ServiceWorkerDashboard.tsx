import React, { useState, useEffect } from 'react';
import {
  collection, query, where, onSnapshot, doc, updateDoc,
  getDoc, orderBy, limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench, Zap, Droplets, Wind, Car, Sparkles,
  CheckCircle2, Clock, MapPin, Phone, Star,
  ToggleLeft, ToggleRight, Package,
  Radio, AlertTriangle, Loader2, LogOut,
  CalendarCheck, XCircle
} from 'lucide-react';
import { ServiceBookingRequest, ServiceWorkerCategory } from '../types';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const CATEGORY_META: Record<ServiceWorkerCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  plumber: { label: 'Plumber', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100' },
  electrician: { label: 'Electrician', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  ac_repair: { label: 'AC Technician', icon: Wind, color: 'text-cyan-600', bg: 'bg-cyan-100' },
  car_wash: { label: 'Car Wash', icon: Car, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  mechanic_bike: { label: 'Bike Mechanic', icon: Wrench, color: 'text-red-600', bg: 'bg-red-100' },
  mechanic_car: { label: 'Car Mechanic', icon: Wrench, color: 'text-orange-600', bg: 'bg-orange-100' },
  cleaning: { label: 'Cleaning', icon: Sparkles, color: 'text-green-600', bg: 'bg-green-100' },
};

type Tab = 'incoming' | 'active' | 'history';

export const ServiceWorkerDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(profile?.serviceWorkerProfile?.isAvailable ?? true);
  const [tab, setTab] = useState<Tab>('incoming');
  const [incomingRequests, setIncomingRequests] = useState<ServiceBookingRequest[]>([]);
  const [activeJobs, setActiveJobs] = useState<ServiceBookingRequest[]>([]);
  const [historyJobs, setHistoryJobs] = useState<ServiceBookingRequest[]>([]);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [togglingAvailability, setTogglingAvailability] = useState(false);

  const category = profile?.serviceWorkerProfile?.category;
  const meta = category ? CATEGORY_META[category] : null;
  const Icon = meta?.icon ?? Wrench;

  useEffect(() => {
    if (profile?.serviceWorkerProfile?.isAvailable !== undefined) {
      setIsAvailable(profile.serviceWorkerProfile.isAvailable);
    }
  }, [profile]);

  useEffect(() => {
    if (!user || !category) return;

    const incomingQ = query(
      collection(db, 'service_bookings'),
      where('category', '==', category),
      where('status', '==', 'broadcasting'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsub = onSnapshot(incomingQ, (snap) => {
      const reqs = snap.docs
        .map(d => ({ ...(d.data() as ServiceBookingRequest), bookingId: d.id }))
        .filter(r => !r.rejectedWorkerIds?.includes(user.uid));
      setIncomingRequests(reqs);
    });
    return () => unsub();
  }, [user, category]);

  useEffect(() => {
    if (!user) return;

    const activeQ = query(
      collection(db, 'service_bookings'),
      where('assignedWorkerId', '==', user.uid),
      where('status', 'in', ['worker_assigned', 'in_progress']),
      orderBy('createdAt', 'desc')
    );
    const unsubActive = onSnapshot(activeQ, (snap) => {
      setActiveJobs(snap.docs.map(d => ({ ...(d.data() as ServiceBookingRequest), bookingId: d.id })));
    });

    const historyQ = query(
      collection(db, 'service_bookings'),
      where('assignedWorkerId', '==', user.uid),
      where('status', 'in', ['completed', 'cancelled']),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubHistory = onSnapshot(historyQ, (snap) => {
      setHistoryJobs(snap.docs.map(d => ({ ...(d.data() as ServiceBookingRequest), bookingId: d.id })));
    });

    return () => { unsubActive(); unsubHistory(); };
  }, [user]);

  const handleToggleAvailability = async () => {
    if (!user || togglingAvailability) return;
    setTogglingAvailability(true);
    const newVal = !isAvailable;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        'serviceWorkerProfile.isAvailable': newVal,
      });
      setIsAvailable(newVal);
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleAcceptJob = async (booking: ServiceBookingRequest) => {
    if (!user || !profile) return;
    setAcceptingId(booking.bookingId);
    try {
      const bookingRef = doc(db, 'service_bookings', booking.bookingId);
      const snap = await getDoc(bookingRef);
      if (!snap.exists()) return;
      const data = snap.data() as ServiceBookingRequest;

      if (data.status !== 'broadcasting') {
        setAcceptingId(null);
        return;
      }
      if (data.rejectedWorkerIds?.includes(user.uid)) {
        setAcceptingId(null);
        return;
      }

      await updateDoc(bookingRef, {
        status: 'worker_assigned',
        assignedWorkerId: user.uid,
        assignedWorkerName: profile.name,
        assignedWorkerPhone: profile.phone,
        assignedWorkerRating: profile.serviceWorkerProfile?.rating ?? 0,
      });
    } catch (err) {
      console.error('Accept error:', err);
    } finally {
      setAcceptingId(null);
    }
  };

  const handleMarkComplete = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'service_bookings', bookingId), { status: 'completed' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const stats = {
    rating: profile?.serviceWorkerProfile?.rating?.toFixed(1) ?? '0.0',
    totalJobs: profile?.serviceWorkerProfile?.totalJobs ?? 0,
    activeCount: activeJobs.length,
    incomingCount: incomingRequests.length,
  };

  if (!profile || profile.role !== 'service_worker') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Access denied. This dashboard is for service workers only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-11 h-11 rounded-2xl flex items-center justify-center', meta?.bg ?? 'bg-gray-100')}>
              <Icon className={cn('w-6 h-6', meta?.color ?? 'text-gray-600')} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base leading-tight">{profile.name}</p>
              <p className={cn('text-xs font-semibold', meta?.color ?? 'text-gray-500')}>{meta?.label ?? 'Service Worker'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAvailability}
              disabled={togglingAvailability}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border-2',
                isAvailable
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-gray-100 text-gray-500 border-gray-200'
              )}
            >
              {togglingAvailability ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAvailable ? (
                <ToggleRight className="w-4 h-4" />
              ) : (
                <ToggleLeft className="w-4 h-4" />
              )}
              {isAvailable ? 'Online' : 'Offline'}
            </button>
            <button onClick={handleSignOut} className="p-2 text-gray-400 hover:text-gray-700 transition-all">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-24">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3 py-5">
          {[
            { icon: Star, label: 'Rating', value: stats.rating, color: 'text-yellow-500', bg: 'bg-yellow-50' },
            { icon: CalendarCheck, label: 'Total Jobs', value: stats.totalJobs, color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: Package, label: 'Active', value: stats.activeCount, color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Radio, label: 'Incoming', value: stats.incomingCount, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map(({ icon: StatIcon, label, value, color, bg }) => (
            <div key={label} className={cn('rounded-2xl p-3 text-center', bg)}>
              <StatIcon className={cn('w-5 h-5 mx-auto mb-1', color)} />
              <p className="text-lg font-extrabold text-gray-900">{value}</p>
              <p className="text-[10px] font-medium text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Offline Banner */}
        {!isAvailable && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-4 bg-gray-100 rounded-2xl flex items-center gap-3 border border-gray-200"
          >
            <AlertTriangle className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-600 font-medium">You are offline. Go online to receive new job requests.</p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
          {([
            { key: 'incoming', label: 'Incoming', count: stats.incomingCount },
            { key: 'active', label: 'Active', count: stats.activeCount },
            { key: 'history', label: 'History', count: null },
          ] as { key: Tab; label: string; count: number | null }[]).map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5',
                tab === key ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500'
              )}
            >
              {label}
              {count !== null && count > 0 && (
                <span className={cn(
                  'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                  tab === key ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-600'
                )}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {tab === 'incoming' && (
            <motion.div key="incoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {!isAvailable ? (
                <div className="text-center py-16 text-gray-400">
                  <ToggleLeft className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">Go online to see requests</p>
                </div>
              ) : incomingRequests.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Radio className="w-12 h-12 mx-auto mb-3 opacity-40 animate-pulse" />
                  <p className="font-semibold text-gray-500">Listening for new requests...</p>
                  <p className="text-sm mt-1 text-gray-400">New jobs will appear here automatically</p>
                </div>
              ) : (
                incomingRequests.map((req) => (
                  <IncomingCard
                    key={req.bookingId}
                    booking={req}
                    onAccept={() => handleAcceptJob(req)}
                    accepting={acceptingId === req.bookingId}
                    meta={meta}
                  />
                ))
              )}
            </motion.div>
          )}

          {tab === 'active' && (
            <motion.div key="active" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {activeJobs.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">No active jobs</p>
                  <p className="text-sm mt-1">Accept an incoming request to get started</p>
                </div>
              ) : (
                activeJobs.map((job) => (
                  <ActiveJobCard key={job.bookingId} booking={job} onComplete={() => handleMarkComplete(job.bookingId)} />
                ))
              )}
            </motion.div>
          )}

          {tab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {historyJobs.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">No job history yet</p>
                </div>
              ) : (
                historyJobs.map((job) => (
                  <HistoryCard key={job.bookingId} booking={job} />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ── Incoming Request Card ── */
function IncomingCard({
  booking,
  onAccept,
  accepting,
  meta,
}: {
  booking: ServiceBookingRequest;
  onAccept: () => void;
  accepting: boolean;
  meta: { label: string; icon: React.ElementType; color: string; bg: string } | null;
}) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = new Date(booking.createdAt).getTime();
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(t);
  }, [booking.createdAt]);

  const timeStr = elapsed < 60 ? `${elapsed}s ago` : `${Math.floor(elapsed / 60)}m ago`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl border-2 border-orange-100 shadow-lg shadow-orange-50 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-5 pt-4 pb-0">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-xs font-semibold text-orange-600">New Request · {timeStr}</span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{booking.serviceName}</h3>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{booking.customerName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Earning</p>
            <p className="text-xl font-extrabold text-green-600">₹{booking.totalPrice}</p>
          </div>
        </div>

        <div className="space-y-2 mb-5">
          {booking.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{booking.address}</span>
            </div>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              {booking.scheduledDate} at {booking.scheduledTime}
            </span>
          </div>
        </div>

        <button
          onClick={onAccept}
          disabled={accepting}
          className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-100 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {accepting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Accept Job — ₹{booking.totalPrice}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ── Active Job Card ── */
function ActiveJobCard({
  booking,
  onComplete,
}: {
  booking: ServiceBookingRequest;
  onComplete: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl border-2 border-blue-100 shadow-md p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
          {booking.status === 'in_progress' ? 'In Progress' : 'Confirmed — Waiting to Start'}
        </span>
      </div>
      <h3 className="font-extrabold text-gray-900 text-lg mb-1">{booking.serviceName}</h3>
      <p className="text-sm text-gray-500 mb-3">{booking.customerName}</p>

      <div className="space-y-2 mb-5 text-sm text-gray-600">
        {booking.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <span>{booking.address}</span>
          </div>
        )}
        {booking.customerPhone && (
          <a href={`tel:${booking.customerPhone}`} className="flex items-center gap-2 text-blue-600 font-medium">
            <Phone className="w-4 h-4" />
            {booking.customerPhone}
          </a>
        )}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          {booking.scheduledDate} at {booking.scheduledTime}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <span className="text-xl font-extrabold text-green-600">₹{booking.totalPrice}</span>
        <button
          onClick={onComplete}
          className="flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark Complete
        </button>
      </div>
    </div>
  );
}

/* ── History Card ── */
function HistoryCard({ booking }: { booking: ServiceBookingRequest }) {
  const isCompleted = booking.status === 'completed';
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', isCompleted ? 'bg-green-100' : 'bg-red-100')}>
          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">{booking.serviceName}</p>
          <p className="text-xs text-gray-400">{booking.scheduledDate}</p>
        </div>
      </div>
      <p className={cn('font-bold text-base', isCompleted ? 'text-green-600' : 'text-gray-400')}>
        {isCompleted ? `+₹${booking.totalPrice}` : 'Cancelled'}
      </p>
    </div>
  );
}
