import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  doc, 
  updateDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { Ride, TrackingData } from '../types';
import { useAuth } from '../AuthContext';
import { useSuccess } from './SuccessModal';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Bike, 
  Car, 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

export const RideHailing: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess } = useSuccess();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('Indiranagar, Bangalore');
  const [drop, setDrop] = useState('Koramangala, Bangalore');
  const [vehicleType, setVehicleType] = useState<'bike' | 'auto'>('bike');
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'rides'),
      where('userId', '==', user.uid),
      where('status', 'in', ['requested', 'accepted', 'driver_arriving', 'on_trip']),
      orderBy('createdAt', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const ride = { rideId: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Ride;
        setActiveRide(ride);
        
        if (ride.driverId) {
          // Listen to tracking updates
          const trackQ = query(
            collection(db, 'ride_tracking'),
            where('rideId', '==', ride.rideId),
            orderBy('timestamp', 'desc'),
            limit(1)
          );
          
          onSnapshot(trackQ, (trackSnap) => {
            if (!trackSnap.empty) {
              setTracking(trackSnap.docs[0].data() as TrackingData);
            }
          });
        }
      } else {
        setActiveRide(null);
        setTracking(null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const handleRequestRide = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);

    try {
      const rideData = {
        userId: user.uid,
        vehicleType,
        pickupLatitude: 12.9716, // Mock coordinates
        pickupLongitude: 77.5946,
        dropLatitude: 12.9279,
        dropLongitude: 77.6271,
        distance: 5.2,
        fare: vehicleType === 'bike' ? 65 : 120,
        status: 'requested',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, 'rides'), rideData);
      showSuccess(
        'Ride Requested!', 
        `We're finding a ${vehicleType} for you. Your ride from ${pickup} to ${drop} is being processed.`,
        'Track Ride',
        '/rides'
      );
    } catch (error) {
      console.error("Error requesting ride:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;
    await updateDoc(doc(db, 'rides', activeRide.rideId), {
      status: 'cancelled'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <Navigation className="text-yellow-500" />
              Book a Ride
            </h1>
            <p className="text-gray-500 mt-1">Fast and affordable rides at your doorstep</p>
          </div>

          {!activeRide ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100"
            >
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full z-10"></div>
                  <div className="absolute left-[27px] top-[50%] bottom-[-50%] w-0.5 bg-gray-100"></div>
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 opacity-0" />
                  <input 
                    type="text" 
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Pickup Location"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-medium"
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full z-10"></div>
                  <input 
                    type="text" 
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="Drop Location"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-yellow-500 outline-none transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setVehicleType('bike')}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3",
                      vehicleType === 'bike' ? "border-yellow-500 bg-yellow-50" : "border-gray-100 hover:border-yellow-200"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", vehicleType === 'bike' ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600")}>
                      <Bike className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Bike Taxi</p>
                      <p className="text-xs text-gray-500">₹65 • 2 mins</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setVehicleType('auto')}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3",
                      vehicleType === 'auto' ? "border-yellow-500 bg-yellow-50" : "border-gray-100 hover:border-yellow-200"
                    )}
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", vehicleType === 'auto' ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600")}>
                      <Car className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Auto Taxi</p>
                      <p className="text-xs text-gray-500">₹120 • 5 mins</p>
                    </div>
                  </button>
                </div>

                <button 
                  onClick={handleRequestRide}
                  disabled={loading}
                  className="w-full bg-yellow-500 text-white py-5 rounded-2xl font-bold text-xl hover:bg-yellow-600 transition-all shadow-xl shadow-yellow-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Finding Driver...' : user ? 'Request Ride' : 'Login to Book'}
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {activeRide.status === 'requested' ? 'Finding your driver...' : 
                     activeRide.status === 'accepted' ? 'Driver assigned' :
                     activeRide.status === 'driver_arriving' ? 'Driver is arriving' : 'On trip'}
                  </h3>
                  <p className="text-gray-500">Ride ID: #{activeRide.rideId.slice(-6)}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 animate-pulse">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              {activeRide.driverId && (
                <div className="bg-gray-50 rounded-3xl p-6 mb-8 flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 overflow-hidden border border-gray-100">
                    <img src="https://i.pravatar.cc/100?u=driver" alt="" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg text-gray-900">Rajesh Kumar</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      4.8 • KA 01 AB 1234
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">OTP</p>
                    <p className="text-2xl font-black text-yellow-600">4821</p>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 truncate">{pickup}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 truncate">{drop}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleCancelRide}
                  className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" /> Cancel
                </button>
                <button className="flex-1 bg-yellow-500 text-white py-4 rounded-2xl font-bold hover:bg-yellow-600 transition-all flex items-center justify-center gap-2">
                   Support
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="relative h-[600px] bg-gray-200 rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl">
          {/* Mock Map */}
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,13/800x600?access_token=pk.eyJ1IjoiYWlzdHVkaW8iLCJhIjoiY2x0eGZ4Z3Z4MDZ4eDJrcXN4Z3Z4MDZ4ZSJ9')] bg-cover bg-center">
            {/* Pickup Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-6 h-6 bg-green-500 border-4 border-white rounded-full shadow-lg"></div>
            </div>
            
            {/* Driver Marker */}
            {tracking && (
              <motion.div 
                animate={{ 
                  x: (tracking.longitude - 77.5946) * 10000, 
                  y: (tracking.latitude - 12.9716) * 10000 
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              >
                <div className="w-10 h-10 bg-yellow-500 border-4 border-white rounded-2xl shadow-xl flex items-center justify-center text-white">
                  {vehicleType === 'bike' ? <Bike className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="absolute top-6 left-6 right-6">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Safety Score</p>
                  <p className="font-bold text-sm">98% Secure</p>
                </div>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Insured</p>
                  <p className="font-bold text-sm">₹5L Cover</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

