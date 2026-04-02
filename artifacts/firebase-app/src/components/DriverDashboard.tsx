import React, { useState, useEffect, useRef } from 'react';
import {
  collection, query, where, onSnapshot, doc, updateDoc,
  orderBy, addDoc, arrayUnion, increment, getDoc,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star, Bell, Car, Wallet, User, MapPin, CheckCircle2,
  XCircle, Loader2, LogOut, ToggleLeft, ToggleRight,
  IndianRupee, Phone, Key, History, ArrowUpRight,
  ArrowDownRight, Shield, FileText, Navigation, Camera,
  Upload, ChevronRight, AlertCircle, Package, Clock,
} from 'lucide-react';
import { RideRequest, DriverTransaction } from '../types';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

type Tab = 'orders' | 'rides' | 'wallet' | 'ratings' | 'profile';

const DRIVER_CUT = 0.8;

export const DriverDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [isAvailable, setIsAvailable] = useState<boolean>(
    profile?.driverProfile?.isAvailable ?? true
  );

  /* ── New Orders ── */
  const [newOrders, setNewOrders] = useState<RideRequest[]>([]);
  const [notification, setNotification] = useState<RideRequest | null>(null);
  const [notifTimer, setNotifTimer] = useState(30);
  const seenIds = useRef<Set<string>>(new Set());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);

  /* ── Active / History ── */
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [rideHistory, setRideHistory] = useState<RideRequest[]>([]);
  const [arrivedAtPickup, setArrivedAtPickup] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [arriving, setArriving] = useState(false);
  const [completing, setCompleting] = useState(false);

  /* ── Wallet ── */
  const [transactions, setTransactions] = useState<DriverTransaction[]>([]);

  /* ── Profile ── */
  const dp = profile?.driverProfile;
  const [form, setForm] = useState({
    firstName: dp?.firstName || profile?.name?.split(' ')[0] || '',
    lastName: dp?.lastName || profile?.name?.split(' ').slice(1).join(' ') || '',
    experience: dp?.experience?.toString() || '',
    vehicleType: dp?.vehicleType || 'bike',
    vehicleNumber: dp?.vehicleNumber || '',
  });
  const [licenseUrl, setLicenseUrl] = useState(dp?.licenseUrl || '');
  const [rcCardUrl, setRcCardUrl] = useState(dp?.rcCardUrl || '');
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState(dp?.vehiclePhotoUrl || '');
  const [profilePhoto, setProfilePhoto] = useState(profile?.profileImage || '');
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  /* ── Redirect if not driver ── */
  useEffect(() => {
    if (profile && profile.role !== 'driver') navigate('/');
  }, [profile, navigate]);

  /* ── Sync profile state when profile loads ── */
  useEffect(() => {
    if (!profile) return;
    const dp = profile.driverProfile;
    setIsAvailable(dp?.isAvailable ?? true);
    setProfilePhoto(profile.profileImage || '');
    setForm({
      firstName: dp?.firstName || profile.name?.split(' ')[0] || '',
      lastName: dp?.lastName || profile.name?.split(' ').slice(1).join(' ') || '',
      experience: dp?.experience?.toString() || '',
      vehicleType: dp?.vehicleType || 'bike',
      vehicleNumber: dp?.vehicleNumber || '',
    });
    setLicenseUrl(dp?.licenseUrl || '');
    setRcCardUrl(dp?.rcCardUrl || '');
    setVehiclePhotoUrl(dp?.vehiclePhotoUrl || '');
  }, [profile?.userId]);

  /* ── Broadcast ride requests listener ── */
  useEffect(() => {
    if (!user || !isAvailable) { setNewOrders([]); return; }
    const vType = profile?.driverProfile?.vehicleType || 'bike';
    const q = query(
      collection(db, 'ride_requests'),
      where('status', '==', 'broadcasting'),
      where('vehicleType', '==', vType),
    );
    const unsub = onSnapshot(q, snap => {
      const list: RideRequest[] = [];
      snap.forEach(d => {
        const data = { requestId: d.id, ...d.data() } as RideRequest;
        if (!data.rejectedDriverIds?.includes(user.uid)) {
          list.push(data);
          if (!seenIds.current.has(data.requestId)) {
            seenIds.current.add(data.requestId);
            setNotification(prev => prev ?? data);
            setNotifTimer(30);
          }
        }
      });
      setNewOrders(list);
    });
    return () => unsub();
  }, [user?.uid, isAvailable, profile?.driverProfile?.vehicleType]);

  /* ── Notification countdown ── */
  useEffect(() => {
    if (!notification) return;
    if (notifTimer <= 0) { setNotification(null); return; }
    timerRef.current = setTimeout(() => setNotifTimer(t => t - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [notification, notifTimer]);

  /* ── Active ride listener ── */
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'ride_requests'),
      where('assignedDriverId', '==', user.uid),
      where('status', 'in', ['driver_assigned', 'driver_arrived', 'on_trip']),
    );
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        const d = snap.docs[0];
        setActiveRide({ requestId: d.id, ...d.data() } as RideRequest);
      } else {
        setActiveRide(null);
        setArrivedAtPickup(false);
        setOtpInput('');
        setOtpError('');
      }
    });
    return () => unsub();
  }, [user?.uid]);

  /* ── Ride history listener ── */
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'ride_requests'),
      where('assignedDriverId', '==', user.uid),
      where('status', 'in', ['completed', 'cancelled']),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, snap => {
      setRideHistory(snap.docs.map(d => ({ requestId: d.id, ...d.data() } as RideRequest)));
    });
    return () => unsub();
  }, [user?.uid]);

  /* ── Wallet transactions listener ── */
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'wallet_transactions'),
      where('driverId', '==', user.uid),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(q, snap => {
      setTransactions(snap.docs.map(d => ({ txId: d.id, ...d.data() } as DriverTransaction)));
    });
    return () => unsub();
  }, [user?.uid]);

  /* ── Handlers ── */
  const handleAcceptRide = async (req: RideRequest) => {
    if (!user || accepting) return;
    setAccepting(req.requestId);
    try {
      const rideRef = doc(db, 'ride_requests', req.requestId);
      const snap = await getDoc(rideRef);
      if (!snap.exists() || snap.data().status !== 'broadcasting') return;
      await updateDoc(rideRef, {
        status: 'driver_assigned',
        assignedDriverId: user.uid,
        assignedDriverName: profile?.name || 'Driver',
        assignedDriverPhone: profile?.phone || '',
      });
      setNotification(null);
      setActiveTab('rides');
    } catch (e) { console.error(e); }
    finally { setAccepting(null); }
  };

  const handleDeclineRide = async (req: RideRequest) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'ride_requests', req.requestId), {
        rejectedDriverIds: arrayUnion(user.uid),
      });
      setNotification(null);
    } catch (e) { console.error(e); }
  };

  const handleArriveAtPickup = async () => {
    if (!activeRide || arriving) return;
    setArriving(true);
    try {
      await updateDoc(doc(db, 'ride_requests', activeRide.requestId), { status: 'driver_arrived' });
      setArrivedAtPickup(true);
    } catch (e) { console.error(e); }
    finally { setArriving(false); }
  };

  const handleVerifyOtp = async () => {
    if (!activeRide || !user || verifyingOtp) return;
    if (otpInput.trim() !== activeRide.otp) {
      setOtpError('Incorrect OTP. Ask the customer again.');
      return;
    }
    setVerifyingOtp(true);
    setOtpError('');
    try {
      await updateDoc(doc(db, 'ride_requests', activeRide.requestId), { status: 'on_trip' });
      setOtpInput('');
    } catch (e) { console.error(e); }
    finally { setVerifyingOtp(false); }
  };

  const handleCompleteRide = async () => {
    if (!activeRide || !user || completing) return;
    setCompleting(true);
    try {
      await updateDoc(doc(db, 'ride_requests', activeRide.requestId), { status: 'completed' });
      const cut = Math.round(activeRide.fare * DRIVER_CUT);
      await updateDoc(doc(db, 'users', user.uid), {
        walletBalance: increment(cut),
        'driverProfile.totalRides': increment(1),
      });
      await addDoc(collection(db, 'wallet_transactions'), {
        driverId: user.uid,
        amount: cut,
        type: 'credit',
        description: `Ride: ${activeRide.pickupAddress} → ${activeRide.dropAddress}`,
        rideId: activeRide.requestId,
        createdAt: new Date().toISOString(),
      });
    } catch (e) { console.error(e); }
    finally { setCompleting(false); }
  };

  const handleToggleAvailability = async () => {
    if (!user) return;
    const next = !isAvailable;
    setIsAvailable(next);
    try {
      await updateDoc(doc(db, 'users', user.uid), { 'driverProfile.isAvailable': next });
    } catch { setIsAvailable(!next); }
  };

  const handleFileUpload = (
    file: File,
    setter: React.Dispatch<React.SetStateAction<string>>,
    field: string,
  ) => {
    if (!user) return;
    setUploadingFile(field);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const b64 = reader.result as string;
      setter(b64);
      try {
        if (field === 'profileImage') {
          await updateDoc(doc(db, 'users', user.uid), { profileImage: b64 });
        } else {
          await updateDoc(doc(db, 'users', user.uid), { [`driverProfile.${field}`]: b64 });
        }
      } catch (e) { console.error(e); }
      finally { setUploadingFile(null); }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user || savingProfile) return;
    setSavingProfile(true);
    try {
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      await updateDoc(doc(db, 'users', user.uid), {
        name: fullName || profile?.name,
        driverProfile: {
          firstName: form.firstName,
          lastName: form.lastName,
          experience: parseInt(form.experience) || 0,
          vehicleType: form.vehicleType,
          vehicleNumber: form.vehicleNumber.toUpperCase(),
          licenseUrl,
          rcCardUrl,
          vehiclePhotoUrl,
          rating: dp?.rating || 4.5,
          totalRides: dp?.totalRides || 0,
          isAvailable,
        },
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSavingProfile(false); }
  };

  const handleSignOut = async () => { await signOut(auth); navigate('/login'); };

  /* ── Derived values ── */
  const rating = dp?.rating ?? 4.5;
  const totalRides = dp?.totalRides ?? 0;
  const walletBalance = profile?.walletBalance ?? 0;

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'orders', label: 'New Orders', icon: Bell, badge: newOrders.length || undefined },
    { id: 'rides', label: 'My Rides', icon: Car, badge: activeRide ? 1 : undefined },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'ratings', label: 'Ratings', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  /* ═══════════════ TAB RENDERERS ═══════════════ */

  const renderNewOrders = () => {
    if (!isAvailable) return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ToggleLeft className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-700">You're Offline</h3>
        <p className="text-gray-400 text-sm mt-1 mb-5">Go online to receive new ride requests</p>
        <button onClick={handleToggleAvailability}
          className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl">
          Go Online
        </button>
      </div>
    );

    if (newOrders.length === 0) return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Bell className="w-10 h-10 text-orange-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-700">Waiting for Rides</h3>
        <p className="text-gray-400 text-sm mt-1">New requests will appear here automatically</p>
      </div>
    );

    return (
      <div className="p-4 space-y-3">
        {newOrders.map(req => (
          <motion.div key={req.requestId} layout
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{req.customerName}</p>
                    <p className="text-xs text-gray-400">{req.customerPhone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-0.5 text-orange-500 font-bold">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span className="text-lg">{req.fare}</span>
                  </div>
                  <p className="text-xs text-gray-400">{req.distance} km</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{req.pickupAddress}</p>
                </div>
                <div className="ml-1.25 w-px h-3 bg-gray-200 ml-[4px]" />
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{req.dropAddress}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleDeclineRide(req)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 font-semibold text-sm">
                  Decline
                </button>
                <button onClick={() => handleAcceptRide(req)}
                  disabled={accepting === req.requestId}
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm disabled:opacity-70 flex items-center justify-center gap-2">
                  {accepting === req.requestId
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : 'Accept'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderMyRides = () => (
    <div className="p-4 space-y-4">
      {activeRide ? (
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
          <div className="bg-orange-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Car className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold text-sm">Active Ride</span>
            </div>
            <span className={cn('px-2 py-0.5 rounded-full text-xs font-bold',
              activeRide.status === 'driver_assigned' ? 'bg-yellow-400 text-yellow-900' :
              activeRide.status === 'driver_arrived' ? 'bg-blue-400 text-blue-900' :
              'bg-green-400 text-green-900')}>
              {activeRide.status === 'driver_assigned' ? 'Head to Pickup' :
               activeRide.status === 'driver_arrived' ? 'At Pickup' : 'On Trip'}
            </span>
          </div>
          <div className="p-4 space-y-3">
            {/* Customer info */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{activeRide.customerName}</p>
                <div className="flex items-center gap-1 text-gray-400">
                  <Phone className="w-3 h-3" />
                  <p className="text-xs">{activeRide.customerPhone}</p>
                </div>
              </div>
              <a href={`tel:${activeRide.customerPhone}`}
                className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-green-600" />
              </a>
            </div>
            {/* Route */}
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pickup</p>
                  <p className="text-sm font-medium text-gray-800">{activeRide.pickupAddress}</p>
                  {activeRide.pickupLat && activeRide.pickupLng && (
                    <a href={`https://maps.google.com/?q=${activeRide.pickupLat},${activeRide.pickupLng}`}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-500 mt-0.5">
                      <Navigation className="w-3 h-3" /> Navigate
                    </a>
                  )}
                </div>
              </div>
              <div className="w-px h-4 bg-gray-200 ml-3.5" />
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Drop</p>
                  <p className="text-sm font-medium text-gray-800">{activeRide.dropAddress}</p>
                  {activeRide.dropLat && activeRide.dropLng && (
                    <a href={`https://maps.google.com/?q=${activeRide.dropLat},${activeRide.dropLng}`}
                      target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-500 mt-0.5">
                      <Navigation className="w-3 h-3" /> Navigate
                    </a>
                  )}
                </div>
              </div>
            </div>
            {/* Fare */}
            <div className="flex gap-2">
              <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <IndianRupee className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xl font-bold text-orange-500">{activeRide.fare}</span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">Total Fare</p>
              </div>
              <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-0.5">
                  <IndianRupee className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xl font-bold text-green-500">
                    {Math.round(activeRide.fare * DRIVER_CUT)}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">Your Earnings</p>
              </div>
              <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
                <span className="text-xl font-bold text-blue-500">{activeRide.distance}</span>
                <p className="text-[11px] text-gray-400 mt-0.5">km</p>
              </div>
            </div>

            {/* Action buttons based on status */}
            {activeRide.status === 'driver_assigned' && (
              <button onClick={handleArriveAtPickup} disabled={arriving}
                className="w-full py-3.5 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center gap-2">
                {arriving
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><MapPin className="w-4 h-4" /> I've Arrived at Pickup</>}
              </button>
            )}

            {activeRide.status === 'driver_arrived' && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 text-center">
                  Enter customer's OTP to start ride
                </p>
                <div className="flex gap-2">
                  <input
                    type="text" maxLength={4} inputMode="numeric"
                    value={otpInput} onChange={e => { setOtpInput(e.target.value); setOtpError(''); }}
                    placeholder="4-digit OTP"
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-orange-400 focus:outline-none"
                  />
                  <button onClick={handleVerifyOtp} disabled={verifyingOtp || otpInput.length !== 4}
                    className="px-5 py-3 bg-orange-500 text-white rounded-xl font-bold disabled:opacity-50 flex items-center gap-1">
                    {verifyingOtp ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  </button>
                </div>
                {otpError && (
                  <div className="flex items-center gap-1 text-red-500 text-xs">
                    <AlertCircle className="w-3.5 h-3.5" />{otpError}
                  </div>
                )}
              </div>
            )}

            {activeRide.status === 'on_trip' && (
              <button onClick={handleCompleteRide} disabled={completing}
                className="w-full py-3.5 rounded-xl bg-green-500 text-white font-bold flex items-center justify-center gap-2">
                {completing
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <><CheckCircle2 className="w-4 h-4" /> Complete Ride</>}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 py-10 px-6 text-center">
          <Car className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No active ride</p>
          <p className="text-gray-400 text-xs mt-1">Accept a new order to start</p>
        </div>
      )}

      {/* Ride History */}
      {rideHistory.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <History className="w-4 h-4 text-gray-400" />
            <h3 className="font-bold text-gray-700">Ride History</h3>
          </div>
          <div className="space-y-2">
            {rideHistory.map(r => (
              <div key={r.requestId} className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                  r.status === 'completed' ? 'bg-green-100' : 'bg-red-100')}>
                  {r.status === 'completed'
                    ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                    : <XCircle className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{r.pickupAddress}</p>
                  <p className="text-xs text-gray-400 truncate">→ {r.dropAddress}</p>
                  <p className="text-[11px] text-gray-300 mt-0.5">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                {r.status === 'completed' && (
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-0.5 text-green-500 font-bold text-sm">
                      <IndianRupee className="w-3 h-3" />
                      {Math.round(r.fare * DRIVER_CUT)}
                    </div>
                    <p className="text-[11px] text-gray-400">earned</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <div className="p-4 space-y-4">
      {/* Balance card */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
        <p className="text-white/70 text-sm font-medium">Available Balance</p>
        <div className="flex items-end gap-1 mt-1">
          <IndianRupee className="w-6 h-6 mb-1" />
          <span className="text-4xl font-extrabold">{walletBalance.toLocaleString('en-IN')}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 bg-white/20 rounded-xl p-2.5 text-center">
            <p className="text-white/70 text-xs">Total Earned</p>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3 h-3" />
              <span className="font-bold text-sm">
                {transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="flex-1 bg-white/20 rounded-xl p-2.5 text-center">
            <p className="text-white/70 text-xs">This Month</p>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              <IndianRupee className="w-3 h-3" />
              <span className="font-bold text-sm">
                {transactions.filter(t => {
                  const d = new Date(t.createdAt);
                  const now = new Date();
                  return t.type === 'credit' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                }).reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3 px-1">Transaction History</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Wallet className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-0.5">Complete rides to earn money</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map(tx => (
              <div key={tx.txId} className="bg-white rounded-xl border border-gray-100 p-3.5 flex items-center gap-3">
                <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                  tx.type === 'credit' ? 'bg-green-100' : 'bg-red-100')}>
                  {tx.type === 'credit'
                    ? <ArrowDownRight className="w-5 h-5 text-green-500" />
                    : <ArrowUpRight className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{tx.description}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className={cn('font-bold text-sm flex items-center gap-0.5 flex-shrink-0',
                  tx.type === 'credit' ? 'text-green-500' : 'text-red-500')}>
                  {tx.type === 'credit' ? '+' : '-'}
                  <IndianRupee className="w-3 h-3" />
                  {tx.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderRatings = () => {
    const ratingBars = [5, 4, 3, 2, 1];
    const ratingCounts: Record<number, number> = { 5: 65, 4: 20, 3: 8, 2: 4, 1: 3 };
    const maxCount = Math.max(...Object.values(ratingCounts));

    return (
      <div className="p-4 space-y-4">
        {/* Rating hero */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-gray-800">{rating.toFixed(1)}</p>
              <div className="flex justify-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className={cn('w-4 h-4', s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200')} />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">{totalRides} rides</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingBars.map(stars => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{stars}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${(ratingCounts[stars] / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-5 text-right">{ratingCounts[stars]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Total Rides', value: totalRides, icon: Car, color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Completion Rate', value: '96%', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Acceptance Rate', value: '89%', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'On Time', value: '94%', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2', stat.bg)}>
                <stat.icon className={cn('w-5 h-5', stat.color)} />
              </div>
              <p className="text-xl font-extrabold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
          <Star className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">Great Work!</p>
            <p className="text-xs text-orange-600 mt-0.5">Your rating is above the platform average of 4.2. Keep it up!</p>
          </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const UploadCard = ({
      label, icon: Icon, url, field, setter, accept,
    }: {
      label: string; icon: React.ElementType; url: string;
      field: string; setter: React.Dispatch<React.SetStateAction<string>>; accept?: string;
    }) => (
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          {url
            ? <p className="text-xs text-green-500 flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3" /> Uploaded</p>
            : <p className="text-xs text-gray-400 mt-0.5">Not uploaded yet</p>}
        </div>
        <label className={cn('cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1',
          url ? 'bg-gray-200 text-gray-600' : 'bg-orange-500 text-white')}>
          {uploadingFile === field
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <><Upload className="w-3.5 h-3.5" />{url ? 'Replace' : 'Upload'}</>}
          <input type="file" accept={accept || 'image/*'} className="hidden"
            onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], setter, field)} />
        </label>
        {url && (
          <a href={url} target="_blank" rel="noreferrer" className="text-xs text-blue-500">View</a>
        )}
      </div>
    );

    return (
      <div className="p-4 space-y-5 pb-10">
        {/* Profile Photo */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            {profilePhoto
              ? <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-orange-200" />
              : <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center border-4 border-orange-200">
                  <User className="w-12 h-12 text-orange-400" />
                </div>}
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center cursor-pointer shadow-md">
              {uploadingFile === 'profileImage'
                ? <Loader2 className="w-4 h-4 text-white animate-spin" />
                : <Camera className="w-4 h-4 text-white" />}
              <input type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0], setProfilePhoto, 'profileImage')} />
            </label>
          </div>
          <p className="mt-2 font-bold text-gray-700">{profile?.name || 'Driver'}</p>
          <p className="text-xs text-gray-400">{profile?.email}</p>
        </div>

        {/* Personal Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500" /> Personal Info
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
              <input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                placeholder="First name"
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
              <input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                placeholder="Last name"
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Driving Experience (years)</label>
            <input value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
              type="number" min="0" max="40" placeholder="e.g. 3"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:border-orange-400 focus:outline-none" />
          </div>
        </div>

        {/* Driver License */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" /> Driver License
          </h3>
          <UploadCard label="License Document" icon={FileText} url={licenseUrl}
            field="licenseUrl" setter={setLicenseUrl} />
        </div>

        {/* Vehicle Registration */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <Car className="w-4 h-4 text-orange-500" /> Vehicle Registration
          </h3>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Type</label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {(['bike', 'auto', 'car'] as const).map(v => (
                <button key={v} onClick={() => setForm(p => ({ ...p, vehicleType: v }))}
                  className={cn('py-2 rounded-xl border text-sm font-semibold capitalize',
                    form.vehicleType === v ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600')}>
                  {v === 'bike' ? '🏍️ Bike' : v === 'auto' ? '🛺 Auto' : '🚗 Car'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Vehicle Number</label>
            <input value={form.vehicleNumber}
              onChange={e => setForm(p => ({ ...p, vehicleNumber: e.target.value.toUpperCase() }))}
              placeholder="KA 01 AB 1234"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono font-bold tracking-wider uppercase focus:border-orange-400 focus:outline-none" />
          </div>
          <UploadCard label="RC Card (Registration Certificate)" icon={FileText}
            url={rcCardUrl} field="rcCardUrl" setter={setRcCardUrl} />
          <UploadCard label="Vehicle Photo" icon={Camera}
            url={vehiclePhotoUrl} field="vehiclePhotoUrl" setter={setVehiclePhotoUrl} />
        </div>

        {/* Save */}
        <button onClick={handleSaveProfile} disabled={savingProfile}
          className="w-full py-4 rounded-2xl bg-orange-500 text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70">
          {savingProfile
            ? <Loader2 className="w-5 h-5 animate-spin" />
            : profileSaved
              ? <><CheckCircle2 className="w-5 h-5" /> Saved!</>
              : 'Save Profile'}
        </button>

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="w-full py-3.5 rounded-2xl border-2 border-red-100 text-red-500 font-bold flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    );
  };

  /* ═══════════════ MAIN RENDER ═══════════════ */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative">

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 pt-10 pb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {profilePhoto
                ? <img src={profilePhoto} alt="Driver" className="w-11 h-11 rounded-full object-cover border-2 border-white/40" />
                : <div className="w-11 h-11 rounded-full bg-white/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>}
              <div className={cn('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-orange-500',
                isAvailable ? 'bg-green-400' : 'bg-gray-400')} />
            </div>
            <div>
              <p className="text-white/70 text-xs">Welcome back</p>
              <h1 className="text-white font-bold text-base leading-tight">{profile?.name || 'Driver'}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleToggleAvailability}
              className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold',
                isAvailable ? 'bg-green-400/20 text-green-100' : 'bg-white/10 text-white/60')}>
              {isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {isAvailable ? 'Online' : 'Offline'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'Wallet', value: `₹${walletBalance.toLocaleString('en-IN')}`, onClick: () => setActiveTab('wallet') },
            { label: 'Rating', value: `⭐ ${rating.toFixed(1)}`, onClick: () => setActiveTab('ratings') },
            { label: 'Rides', value: totalRides.toString(), onClick: () => setActiveTab('rides') },
          ].map(s => (
            <button key={s.label} onClick={s.onClick}
              className="bg-white/20 rounded-xl p-2.5 text-center active:bg-white/30">
              <p className="text-white font-bold text-sm">{s.value}</p>
              <p className="text-white/60 text-[11px] mt-0.5">{s.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
            {activeTab === 'orders' && renderNewOrders()}
            {activeTab === 'rides' && renderMyRides()}
            {activeTab === 'wallet' && renderWallet()}
            {activeTab === 'ratings' && renderRatings()}
            {activeTab === 'profile' && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 flex items-center z-40">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors',
              activeTab === tab.id ? 'text-orange-500' : 'text-gray-400')}>
            <div className="relative">
              <tab.icon className="w-5 h-5" />
              {tab.badge ? (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className={cn('text-[10px] font-medium', activeTab === tab.id ? 'font-bold' : '')}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div layoutId="tab-indicator"
                className="absolute bottom-0 w-10 h-0.5 bg-orange-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* New Ride Notification Popup */}
      <AnimatePresence>
        {notification && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 120, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
              exit={{ y: 120, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">

              {/* Popup header with countdown */}
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white animate-bounce" />
                    </div>
                    <div>
                      <p className="text-white font-bold">New Ride Request!</p>
                      <p className="text-white/70 text-xs">Accept within {notifTimer}s</p>
                    </div>
                  </div>
                  {/* SVG countdown ring */}
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                    <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                    <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="3"
                      strokeDasharray={`${(notifTimer / 30) * 100.5} 100.5`} strokeLinecap="round" />
                    <text x="20" y="25" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold"
                      transform="rotate(90,20,20)">{notifTimer}</text>
                  </svg>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {/* Customer */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{notification.customerName}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" />{notification.customerPhone}
                    </p>
                  </div>
                </div>

                {/* Route */}
                <div className="bg-gray-50 rounded-2xl p-3 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Pickup</p>
                      <p className="text-sm font-semibold text-gray-800">{notification.pickupAddress}</p>
                      {notification.pickupLat && notification.pickupLng && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {notification.pickupLat.toFixed(5)}, {notification.pickupLng.toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-px h-3 bg-gray-200 ml-3" />
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Drop</p>
                      <p className="text-sm font-semibold text-gray-800">{notification.dropAddress}</p>
                      {notification.dropLat && notification.dropLng && (
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                          {notification.dropLat.toFixed(5)}, {notification.dropLng.toFixed(5)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fare & distance */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-orange-50 rounded-2xl p-3 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <IndianRupee className="w-4 h-4 text-orange-500" />
                      <span className="text-2xl font-extrabold text-orange-500">{notification.fare}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">Total Fare</p>
                    <p className="text-[10px] text-green-500 font-semibold">
                      You earn ₹{Math.round(notification.fare * DRIVER_CUT)}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-3 text-center">
                    <span className="text-2xl font-extrabold text-blue-500">{notification.distance}</span>
                    <span className="text-sm text-blue-400 font-medium"> km</span>
                    <p className="text-[11px] text-gray-400 mt-0.5">Distance</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-1">
                  <button onClick={() => handleDeclineRide(notification)}
                    className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm flex items-center justify-center gap-1">
                    <XCircle className="w-4 h-4" /> Decline
                  </button>
                  <button onClick={() => handleAcceptRide(notification)}
                    disabled={accepting === notification.requestId}
                    className="flex-1 py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-1 disabled:opacity-70">
                    {accepting === notification.requestId
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <><CheckCircle2 className="w-4 h-4" /> Accept</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
