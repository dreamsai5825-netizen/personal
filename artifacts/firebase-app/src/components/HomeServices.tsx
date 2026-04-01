import React, { useState, useEffect } from 'react';
import { addDoc, collection, doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench, Zap, Droplets, Wind, Car, Sparkles, Star,
  Clock, ShieldCheck, ArrowRight, ChevronRight,
  CheckCircle2, Users, MapPin, Radio, UserCheck,
  Phone, ThumbsDown, Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ServiceWorkerCategory, ServiceBookingRequest } from '../types';

interface ServiceCard {
  service_id: string;
  service_name: string;
  starting_price: number;
  rating: number;
  duration: string;
  description: string;
  popular?: boolean;
}

const categories = [
  {
    id: 'plumber' as ServiceWorkerCategory,
    name: 'Plumbing',
    icon: Droplets,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Leak fixes, pipe work & more',
    services: [
      { service_id: 'p1', service_name: 'Pipe Leakage Fix', starting_price: 299, rating: 4.8, duration: '60 min', description: 'Fix leaking pipes and joints at home or office.' },
      { service_id: 'p2', service_name: 'Tap / Faucet Repair', starting_price: 199, rating: 4.7, duration: '30 min', description: 'Repair or replace dripping taps and faucets.' },
      { service_id: 'p3', service_name: 'Toilet Repair', starting_price: 349, rating: 4.9, duration: '45 min', description: 'Fix flush mechanism, seat, or running toilet.', popular: true },
      { service_id: 'p4', service_name: 'Water Heater Installation', starting_price: 499, rating: 4.6, duration: '90 min', description: 'Install or service your water heater.' },
    ],
  },
  {
    id: 'electrician' as ServiceWorkerCategory,
    name: 'Electrician',
    icon: Zap,
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    description: 'Wiring, switches & appliances',
    services: [
      { service_id: 'e1', service_name: 'Switch / Socket Repair', starting_price: 149, rating: 4.8, duration: '30 min', description: 'Fix or replace faulty switches and sockets.' },
      { service_id: 'e2', service_name: 'Fan Installation', starting_price: 249, rating: 4.7, duration: '45 min', description: 'Ceiling or wall fan installation service.', popular: true },
      { service_id: 'e3', service_name: 'Wiring & Rewiring', starting_price: 599, rating: 4.6, duration: '120 min', description: 'Complete home wiring or rewiring work.' },
      { service_id: 'e4', service_name: 'MCB / Fuse Fix', starting_price: 199, rating: 4.9, duration: '30 min', description: 'Fix tripping MCBs or blown fuses.' },
    ],
  },
  {
    id: 'ac_repair' as ServiceWorkerCategory,
    name: 'AC Repair',
    icon: Wind,
    color: 'bg-cyan-500',
    lightColor: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    description: 'Servicing, gas & repairs',
    services: [
      { service_id: 'a1', service_name: 'AC Service & Cleaning', starting_price: 499, rating: 4.9, duration: '60 min', description: 'Deep cleaning of filters and coils for optimal cooling.', popular: true },
      { service_id: 'a2', service_name: 'Gas Refill (Recharge)', starting_price: 1299, rating: 4.7, duration: '90 min', description: 'Refill refrigerant gas for better performance.' },
      { service_id: 'a3', service_name: 'AC Not Cooling Fix', starting_price: 399, rating: 4.8, duration: '60 min', description: 'Diagnose and fix cooling issues.' },
      { service_id: 'a4', service_name: 'AC Installation', starting_price: 799, rating: 4.6, duration: '120 min', description: 'Professional AC installation with copper piping.' },
    ],
  },
  {
    id: 'car_wash' as ServiceWorkerCategory,
    name: 'Car Wash',
    icon: Car,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    description: 'Doorstep car cleaning',
    services: [
      { service_id: 'c1', service_name: 'Basic Exterior Wash', starting_price: 199, rating: 4.7, duration: '30 min', description: 'Complete exterior wash with wipe down.' },
      { service_id: 'c2', service_name: 'Interior + Exterior', starting_price: 399, rating: 4.9, duration: '60 min', description: 'Full interior vacuuming and exterior wash.', popular: true },
      { service_id: 'c3', service_name: 'Premium Detailing', starting_price: 999, rating: 4.8, duration: '180 min', description: 'Deep cleaning, polishing and wax coat.' },
      { service_id: 'c4', service_name: 'Engine Bay Cleaning', starting_price: 599, rating: 4.6, duration: '90 min', description: 'Professional engine bay degreasing and cleaning.' },
    ],
  },
  {
    id: 'mechanic_bike' as ServiceWorkerCategory,
    name: 'Mechanic',
    icon: Wrench,
    color: 'bg-red-500',
    lightColor: 'bg-red-50',
    textColor: 'text-red-600',
    description: 'Bike & car repairs at home',
    subTypes: [
      { id: 'mechanic_bike' as ServiceWorkerCategory, label: 'Bike Mechanic', emoji: '🏍️' },
      { id: 'mechanic_car' as ServiceWorkerCategory, label: 'Car Mechanic', emoji: '🚗' },
    ],
    services: [
      { service_id: 'm1', service_name: 'Bike Service (Basic)', starting_price: 299, rating: 4.8, duration: '60 min', description: 'Oil change, chain lubrication and basic checks.', vehicleType: 'bike' },
      { service_id: 'm2', service_name: 'Bike Service (Full)', starting_price: 599, rating: 4.9, duration: '120 min', description: 'Complete bike overhaul and tune-up.', popular: true, vehicleType: 'bike' },
      { service_id: 'm3', service_name: 'Puncture Repair', starting_price: 149, rating: 4.7, duration: '30 min', description: 'Quick tyre puncture fix at your doorstep.', vehicleType: 'both' },
      { service_id: 'm4', service_name: 'Car Service (Basic)', starting_price: 699, rating: 4.8, duration: '90 min', description: 'Oil change, filter check and basic car service.', vehicleType: 'car' },
      { service_id: 'm5', service_name: 'Battery Replacement', starting_price: 499, rating: 4.6, duration: '45 min', description: 'New battery installation for bikes or cars.', vehicleType: 'both' },
      { service_id: 'm6', service_name: 'Car AC Service', starting_price: 899, rating: 4.7, duration: '120 min', description: 'Complete car AC check and gas refill.', vehicleType: 'car' },
    ],
  },
  {
    id: 'cleaning' as ServiceWorkerCategory,
    name: 'Cleaning',
    icon: Sparkles,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    textColor: 'text-green-600',
    description: 'Deep clean your home',
    services: [
      { service_id: 'cl1', service_name: 'Home Deep Cleaning', starting_price: 999, rating: 4.9, duration: '180 min', description: 'Complete home deep clean including kitchen and bathrooms.', popular: true },
      { service_id: 'cl2', service_name: 'Kitchen Cleaning', starting_price: 499, rating: 4.8, duration: '90 min', description: 'Degreasing, chimney & appliance cleaning.' },
      { service_id: 'cl3', service_name: 'Bathroom Sanitisation', starting_price: 299, rating: 4.7, duration: '60 min', description: 'Tile scrubbing, descaling and disinfection.' },
      { service_id: 'cl4', service_name: 'Sofa / Carpet Cleaning', starting_price: 699, rating: 4.6, duration: '120 min', description: 'Foam wash and stain removal for sofas and carpets.' },
    ],
  },
];

type BookingStatus = 'idle' | 'booked' | 'broadcasting' | 'assigned' | 'rejected_loop';

interface LiveBooking {
  bookingId: string;
  status: ServiceBookingRequest['status'];
  assignedWorkerName?: string;
  assignedWorkerPhone?: string;
  assignedWorkerRating?: number;
  assignedWorkerId?: string;
  serviceName: string;
}

export const HomeServices: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[0] | null>(null);
  const [mechanicSubType, setMechanicSubType] = useState<ServiceWorkerCategory | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [address, setAddress] = useState('');
  const [bookingStatus, setBookingStatus] = useState<BookingStatus>('idle');
  const [liveBooking, setLiveBooking] = useState<LiveBooking | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const getEffectiveCategory = (): ServiceWorkerCategory => {
    if (selectedCategory?.id === 'mechanic_bike') {
      return mechanicSubType || 'mechanic_bike';
    }
    return selectedCategory?.id as ServiceWorkerCategory;
  };

  const getFilteredServices = () => {
    if (!selectedCategory) return [];
    if (selectedCategory.id !== 'mechanic_bike' || !mechanicSubType) return selectedCategory.services;
    return selectedCategory.services.filter((s: any) => {
      if (!s.vehicleType || s.vehicleType === 'both') return true;
      if (mechanicSubType === 'mechanic_bike') return s.vehicleType === 'bike' || s.vehicleType === 'both';
      if (mechanicSubType === 'mechanic_car') return s.vehicleType === 'car' || s.vehicleType === 'both';
      return true;
    });
  };

  useEffect(() => {
    if (!liveBooking?.bookingId) return;
    const unsub = onSnapshot(doc(db, 'service_bookings', liveBooking.bookingId), (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as ServiceBookingRequest;
      setLiveBooking(prev => ({
        ...prev!,
        status: data.status,
        assignedWorkerName: data.assignedWorkerName,
        assignedWorkerPhone: data.assignedWorkerPhone,
        assignedWorkerRating: data.assignedWorkerRating,
        assignedWorkerId: data.assignedWorkerId,
      }));
      if (data.status === 'worker_assigned') {
        setBookingStatus('assigned');
      } else if (data.status === 'broadcasting') {
        setBookingStatus('broadcasting');
      }
    });
    return () => unsub();
  }, [liveBooking?.bookingId]);

  const handleBooking = async () => {
    if (!user) { navigate('/login'); return; }
    if (!selectedService) return;
    if (!address.trim()) { return; }
    setLoading(true);
    try {
      const dateStr = scheduledDate || tomorrowStr;
      const category = getEffectiveCategory();
      const bookingData: Omit<ServiceBookingRequest, 'bookingId'> = {
        customerId: user.uid,
        customerName: profile?.name || 'Customer',
        customerPhone: profile?.phone || '',
        category,
        serviceName: selectedService.service_name,
        serviceId: selectedService.service_id,
        totalPrice: selectedService.starting_price + 99,
        address: address.trim(),
        scheduledDate: dateStr,
        scheduledTime,
        status: 'broadcasting',
        rejectedWorkerIds: [],
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, 'service_bookings'), bookingData);
      setLiveBooking({
        bookingId: docRef.id,
        status: 'broadcasting',
        serviceName: selectedService.service_name,
      });
      setBookingStatus('broadcasting');
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectWorker = async () => {
    if (!liveBooking?.bookingId || !liveBooking.assignedWorkerId) return;
    setRejectLoading(true);
    try {
      const bookingRef = doc(db, 'service_bookings', liveBooking.bookingId);
      const snap = await getDoc(bookingRef);
      if (!snap.exists()) return;
      const data = snap.data() as ServiceBookingRequest;
      await updateDoc(bookingRef, {
        status: 'broadcasting',
        assignedWorkerId: null,
        assignedWorkerName: null,
        assignedWorkerPhone: null,
        assignedWorkerRating: null,
        rejectedWorkerIds: [...(data.rejectedWorkerIds || []), liveBooking.assignedWorkerId],
      });
      setBookingStatus('broadcasting');
      setLiveBooking(prev => ({
        ...prev!,
        status: 'broadcasting',
        assignedWorkerId: undefined,
        assignedWorkerName: undefined,
        assignedWorkerPhone: undefined,
        assignedWorkerRating: undefined,
      }));
    } catch (err) {
      console.error('Reject error:', err);
    } finally {
      setRejectLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!liveBooking?.bookingId) return;
    try {
      await updateDoc(doc(db, 'service_bookings', liveBooking.bookingId), { status: 'cancelled' });
    } catch {}
    setBookingStatus('idle');
    setLiveBooking(null);
    setSelectedService(null);
  };

  const resetToHome = () => {
    setBookingStatus('idle');
    setLiveBooking(null);
    setSelectedService(null);
    setSelectedCategory(null);
    setMechanicSubType(null);
    setAddress('');
  };

  if (bookingStatus === 'broadcasting' || bookingStatus === 'assigned') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full"
        >
          <AnimatePresence mode="wait">
            {bookingStatus === 'broadcasting' && (
              <motion.div
                key="broadcasting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200 border border-gray-100 text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
                    <Radio className="w-10 h-10 text-orange-500" />
                  </div>
                  <span className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-30" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Finding your expert</h2>
                <p className="text-gray-500 text-sm mb-1">
                  We're broadcasting your request to all available <strong>{liveBooking?.serviceName}</strong> professionals nearby.
                </p>
                <p className="text-gray-400 text-xs mb-8">First one to accept gets the job — usually within 2–5 minutes</p>

                <div className="flex items-center gap-2 justify-center mb-8">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-orange-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleCancelBooking}
                  className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-semibold hover:border-red-300 hover:text-red-600 transition-all text-sm"
                >
                  Cancel Request
                </button>
              </motion.div>
            )}

            {bookingStatus === 'assigned' && liveBooking && (
              <motion.div
                key="assigned"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200 border border-gray-100"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserCheck className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Expert Assigned!</h2>
                  <p className="text-gray-500 text-sm mt-1">Review the assigned professional below</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 mb-5 border border-gray-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-extrabold text-orange-500">
                        {(liveBooking.assignedWorkerName || 'W')[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{liveBooking.assignedWorkerName || 'Professional'}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">
                          {liveBooking.assignedWorkerRating?.toFixed(1) || '4.8'}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">rating</span>
                      </div>
                    </div>
                  </div>

                  {liveBooking.assignedWorkerPhone && (
                    <a
                      href={`tel:${liveBooking.assignedWorkerPhone}`}
                      className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:bg-green-50 transition-all"
                    >
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">{liveBooking.assignedWorkerPhone}</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-xl mb-5">
                  <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <p className="text-xs text-blue-700 font-medium">This professional is verified and insured</p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={resetToHome}
                    className="w-full bg-orange-500 text-white py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Accept & Confirm
                  </button>

                  <button
                    onClick={handleRejectWorker}
                    disabled={rejectLoading}
                    className="w-full border-2 border-red-200 text-red-600 py-3.5 rounded-2xl font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {rejectLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <ThumbsDown className="w-5 h-5" />
                    )}
                    {rejectLoading ? 'Reassigning...' : 'Not Satisfied — Find Another'}
                  </button>

                  <button
                    onClick={handleCancelBooking}
                    className="w-full text-gray-400 py-2 text-sm hover:text-gray-600 transition-all"
                  >
                    Cancel booking
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Home Services</h1>
        <p className="text-gray-500 mt-2 text-lg">Professional experts at your doorstep — trusted, verified & affordable</p>
        <div className="flex flex-wrap gap-6 mt-6">
          {[
            { icon: ShieldCheck, label: 'Verified Professionals', color: 'text-green-500' },
            { icon: Clock, label: '60-min Response', color: 'text-blue-500' },
            { icon: Star, label: '4.8 Avg Rating', color: 'text-yellow-500' },
            { icon: Users, label: '50,000+ Happy Customers', color: 'text-purple-500' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedCategory ? (
          <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedCategory(cat); setSelectedService(null); setMechanicSubType(null); }}
                  className="bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all p-7 flex flex-col items-center gap-4 group text-center"
                >
                  <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{cat.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="services" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="grid lg:grid-cols-3 gap-10">

            {/* Left: Services */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={() => { setSelectedCategory(null); setSelectedService(null); setMechanicSubType(null); }}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" /> All Services
                </button>
                <span className="text-gray-300">/</span>
                <div className={`flex items-center gap-2 px-3 py-1 ${selectedCategory.lightColor} ${selectedCategory.textColor} rounded-full text-sm font-semibold`}>
                  <selectedCategory.icon className="w-4 h-4" />
                  {selectedCategory.name}
                </div>
              </div>

              {/* Mechanic Sub-type Picker */}
              {(selectedCategory as any).subTypes && (
                <div className="flex gap-3">
                  {(selectedCategory as any).subTypes.map((sub: { id: ServiceWorkerCategory; label: string; emoji: string }) => (
                    <button
                      key={sub.id}
                      onClick={() => { setMechanicSubType(sub.id); setSelectedService(null); }}
                      className={cn(
                        'flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm border-2 transition-all',
                        mechanicSubType === sub.id
                          ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-100'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-red-300'
                      )}
                    >
                      <span>{sub.emoji}</span>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                {getFilteredServices().map((service: any) => (
                  <motion.div
                    key={service.service_id}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedService(service)}
                    className={cn(
                      'bg-white rounded-3xl border-2 p-6 cursor-pointer transition-all relative',
                      selectedService?.service_id === service.service_id
                        ? 'border-orange-400 ring-4 ring-orange-50 shadow-xl'
                        : 'border-gray-100 hover:border-gray-200 hover:shadow-lg'
                    )}
                  >
                    {service.popular && (
                      <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">Popular</span>
                    )}
                    {selectedService?.service_id === service.service_id && (
                      <div className="absolute top-4 left-4">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 fill-orange-50" />
                      </div>
                    )}
                    <div className="mb-3 mt-1">
                      <h3 className="text-lg font-bold text-gray-900">{service.service_name}</h3>
                      <p className="text-sm text-gray-500 mt-1 leading-relaxed">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{service.duration}</span>
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />{service.rating}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-gray-400">Starting at</p>
                        <p className="text-2xl font-black text-gray-900">₹{service.starting_price}</p>
                      </div>
                      <div className={`w-10 h-10 ${selectedCategory.lightColor} ${selectedCategory.textColor} rounded-xl flex items-center justify-center`}>
                        <selectedCategory.icon className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right: Booking Panel */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {selectedService ? (
                  <motion.div
                    key="booking"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-3xl p-7 border border-gray-100 shadow-2xl shadow-gray-100 sticky top-24"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedService.service_name}</h3>
                    <p className="text-gray-500 text-sm mb-6">{selectedService.description}</p>

                    <div className="space-y-4 mb-6">
                      {/* Address */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                          Service Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                          <textarea
                            placeholder="Enter your full address..."
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            rows={2}
                            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Preferred Date</label>
                        <input
                          type="date"
                          value={scheduledDate || tomorrowStr}
                          min={tomorrowStr}
                          onChange={e => setScheduledDate(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Preferred Time</label>
                        <select
                          value={scheduledTime}
                          onChange={e => setScheduledTime(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
                        >
                          {['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(t => (
                            <option key={t} value={t}>{t} {parseInt(t) < 12 ? 'AM' : 'PM'}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-6 border-t border-gray-50 pt-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service Charge</span>
                        <span className="font-medium">₹{selectedService.starting_price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Visiting Fee</span>
                        <span className="font-medium">₹99</span>
                      </div>
                      <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-50">
                        <span>Total</span>
                        <span className="text-orange-500">₹{selectedService.starting_price + 99}</span>
                      </div>
                    </div>

                    {/* How it works */}
                    <div className="bg-orange-50 rounded-2xl p-4 mb-5 border border-orange-100">
                      <p className="text-xs font-bold text-orange-800 mb-2 flex items-center gap-1.5">
                        <Radio className="w-3.5 h-3.5" />
                        How it works
                      </p>
                      <ol className="space-y-1">
                        {[
                          'Your request is broadcast to all nearby experts',
                          'First available expert accepts your booking',
                          'Review expert details — accept or find another',
                        ].map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-orange-700">
                            <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center font-bold flex-shrink-0 text-[10px] mt-0.5">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-2xl mb-5">
                      <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-xs text-green-700 font-medium">30-day warranty + verified & insured professional</p>
                    </div>

                    <button
                      onClick={handleBooking}
                      disabled={loading || !address.trim()}
                      className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {user ? 'Find an Expert' : 'Login to Book'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>

                    {!address.trim() && selectedService && (
                      <p className="text-center text-xs text-red-400 mt-2">Please enter your address to continue</p>
                    )}
                    {!user && (
                      <p className="text-center text-xs text-gray-400 mt-3">You'll be redirected to login to complete your booking</p>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200 sticky top-24"
                  >
                    <div className={`w-20 h-20 ${selectedCategory.color} rounded-3xl flex items-center justify-center mx-auto mb-5 text-white opacity-40`}>
                      <selectedCategory.icon className="w-10 h-10" />
                    </div>
                    <p className="text-gray-400 font-bold">Select a service</p>
                    <p className="text-gray-300 text-sm mt-1">to view booking details</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
