import React, { useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Chrome, ArrowRight, User as UserIcon, Phone, Eye, EyeOff, CheckCircle, AlertCircle, Wrench, Zap, Droplets, Wind, Car, Sparkles, ChevronRight } from 'lucide-react';
import { UserProfile, ServiceWorkerCategory } from '../types';
import { useAuth } from '../AuthContext';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

type MechanicSubType = 'mechanic_bike' | 'mechanic_car' | null;

const SERVICE_WORKER_CATEGORIES: {
  id: ServiceWorkerCategory;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  description: string;
  hasSubCategory?: boolean;
}[] = [
  { id: 'plumber', label: 'Plumber', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', description: 'Pipe leaks, taps, toilets' },
  { id: 'electrician', label: 'Electrician', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', description: 'Wiring, switches, appliances' },
  { id: 'ac_repair', label: 'AC Repair', icon: Wind, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200', description: 'Servicing, gas refills, repairs' },
  { id: 'car_wash', label: 'Car Wash', icon: Car, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', description: 'Doorstep car cleaning' },
  { id: 'mechanic_bike', label: 'Mechanic', icon: Wrench, color: 'text-red-600', bg: 'bg-red-50 border-red-200', description: 'Bike & car repairs', hasSubCategory: true },
  { id: 'cleaning', label: 'Cleaning', icon: Sparkles, color: 'text-green-600', bg: 'bg-green-50 border-green-200', description: 'Home & office cleaning' },
];

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('customer');
  const [serviceWorkerCategory, setServiceWorkerCategory] = useState<ServiceWorkerCategory | null>(null);
  const [mechanicSubType, setMechanicSubType] = useState<MechanicSubType>(null);
  const [showMechanicPicker, setShowMechanicPicker] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [debugPhoneNumber, setDebugPhoneNumber] = useState('');
  const [debugVerificationState, setDebugVerificationState] = useState('');
  const navigate = useNavigate();

  const resetOtpState = () => {
    setShowOtp(false);
    setOtp('');
    setPhoneOtp('');
    setConfirmationResult(null);
    setPhoneConfirmationResult(null);
    setSuccess('');
    setError('');
    setOtpCooldown(0);
    setDebugVerificationState('');
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCooldown > 0) {
      timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  const { user, needsPhoneVerification, profile, isSuperAdmin, isCustomerCare, isAdmin } = useAuth();

  const getRedirectPath = () => {
    if (isSuperAdmin) return '/admin/super';
    if (isCustomerCare) return '/admin/support';
    if (isAdmin) return '/admin/overview';
    if (profile?.role === 'service_worker') return '/worker/dashboard';
    return '/';
  };

  useEffect(() => {
    if (user && !needsPhoneVerification) {
      if (isSuperAdmin) navigate('/admin/super');
      else if (isCustomerCare) navigate('/admin/support');
      else if (isAdmin) navigate('/admin/overview');
      else if (profile?.role === 'service_worker') navigate('/worker/dashboard');
    }
  }, [user, isSuperAdmin, isCustomerCare, isAdmin, needsPhoneVerification, profile?.role]);

  useEffect(() => {
    if (user && needsPhoneVerification) {
      setIsLogin(false);
      setAuthMethod('phone');
      setName(profile?.name || '');
      setEmail(profile?.email || '');
      setError('Please verify your phone number to complete registration');
    }
  }, [user, needsPhoneVerification, profile]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const profileRef = doc(db, 'users', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        const tempProfile: UserProfile = {
          userId: user.uid,
          name: user.displayName || 'User',
          email: user.email || '',
          phone: '',
          role: 'customer',
          createdAt: new Date().toISOString(),
          status: 'active',
          walletBalance: 0,
          profileImage: user.photoURL || undefined,
        };
        await setDoc(profileRef, tempProfile);
        setAuthMethod('phone');
        setIsLogin(false);
        setName(user.displayName || '');
        setEmail(user.email || '');
        setError('Please verify your phone number to complete registration');
        return;
      }
      navigate(getRedirectPath());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = undefined;
    }
  };

  const setupRecaptcha = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          clearRecaptcha();
          setError('reCAPTCHA expired. Please try again.');
        }
      });
      await window.recaptchaVerifier.render();
    }
    return window.recaptchaVerifier;
  };

  useEffect(() => {
    return () => clearRecaptcha();
  }, []);

  const handlePhoneAuth = async () => {
    try {
      const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
      if (!normalizedPhone || normalizedPhone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      setLoading(true);
      setError('');
      const phoneNumber = `+91${normalizedPhone}`;
      setDebugPhoneNumber(phoneNumber);
      const recaptchaVerifier = await setupRecaptcha();
      setDebugVerificationState(`Requesting OTP for ${phoneNumber}`);
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setDebugVerificationState(`Firebase accepted OTP request for ${phoneNumber}.`);
      setConfirmationResult(confirmation);
      setShowOtp(true);
      setSuccess('OTP sent to your phone number');
    } catch (err: any) {
      setDebugVerificationState(`OTP request failed: ${err?.code || err?.message || 'unknown error'}`);
      if (err.code === 'auth/invalid-app-credential') {
        clearRecaptcha();
        setError('Phone auth is blocked. Enable Phone sign-in in Firebase Console and add your domain.');
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFinalCategory = (): ServiceWorkerCategory | null => {
    if (serviceWorkerCategory === 'mechanic_bike') {
      return mechanicSubType || null;
    }
    return serviceWorkerCategory;
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      const profileRef = doc(db, 'users', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (!profileSnap.exists()) {
        const finalCategory = getFinalCategory();
        const newProfile: UserProfile = {
          userId: user.uid,
          name: name || 'User',
          email: '',
          phone: `+91${phone}`,
          role: role as any,
          createdAt: new Date().toISOString(),
          status: 'active',
          walletBalance: 0,
          ...(role === 'service_worker' && finalCategory ? {
            serviceWorkerProfile: {
              category: finalCategory,
              rating: 0,
              totalJobs: 0,
              isAvailable: true,
            }
          } : {}),
        };
        await setDoc(profileRef, newProfile);
      }
      navigate(role === 'service_worker' ? '/worker/dashboard' : getRedirectPath());
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneVerification = async () => {
    if (loading || otpCooldown > 0) return;
    try {
      if (!phone || phone.length !== 10) {
        setError('Please enter a valid 10-digit phone number');
        return;
      }
      setLoading(true);
      setError('');
      const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
      const phoneNumber = `+91${normalizedPhone}`;
      setDebugPhoneNumber(phoneNumber);
      setOtpCooldown(30);
      const recaptchaVerifier = await setupRecaptcha();
      setDebugVerificationState(`Requesting OTP for ${phoneNumber}`);
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setDebugVerificationState(`Firebase accepted OTP request for ${phoneNumber}.`);
      setPhoneConfirmationResult(confirmation);
      setSuccess('OTP sent to your phone number');
      setShowOtp(true);
    } catch (err: any) {
      setDebugVerificationState(`OTP request failed: ${err?.code || err?.message || 'unknown error'}`);
      let errorMessage = 'Failed to send OTP. Please try again.';
      if (err.code === 'auth/invalid-phone-number') errorMessage = 'Invalid phone number format';
      else if (err.code === 'auth/too-many-requests') errorMessage = 'Too many OTP requests. Please wait before retrying.';
      else if (err.code === 'auth/invalid-app-credential') {
        clearRecaptcha();
        errorMessage = 'Invalid app credential. Please check Firebase Console settings.';
      } else if (err.message) errorMessage = err.message;
      if (err.code === 'auth/too-many-requests') setOtpCooldown(0);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      setLoading(true);
      setError('');
      await phoneConfirmationResult.confirm(phoneOtp);
      const user = auth.currentUser;
      if (user) {
        const profileRef = doc(db, 'users', user.uid);
        await updateDoc(profileRef, { phone: `+91${phone}`, status: 'active' });
      }
      setPhoneVerified(true);
      setSuccess('Phone number verified successfully!');
      setPhoneOtp('');
      setTimeout(() => navigate(getRedirectPath()), 2000);
    } catch (err: any) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'service_worker' && !isLogin) {
      const finalCategory = getFinalCategory();
      if (!finalCategory) {
        setError('Please select your service category');
        return;
      }
    }

    if (authMethod === 'phone') {
      if (!showOtp) {
        if (!phone || phone.length !== 10) {
          setError('Please enter a valid 10-digit phone number');
          return;
        }
        await handlePhoneAuth();
      } else {
        if (!otp || otp.length !== 6) {
          setError('Please enter a valid 6-digit OTP');
          return;
        }
        await verifyOtp();
      }
      return;
    }

    if (authMethod === 'email') {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      if (!isLogin && password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!isLogin && password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        if (authMethod === 'email') {
          await signInWithEmailAndPassword(auth, email, password);
        }
        navigate(getRedirectPath());
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        await updateProfile(user, { displayName: name });
        await sendEmailVerification(user);

        const finalCategory = getFinalCategory();
        const newProfile: UserProfile = {
          userId: user.uid,
          name: name,
          email: email,
          phone: phone,
          role: role as any,
          createdAt: new Date().toISOString(),
          status: 'active',
          walletBalance: 0,
          ...(role === 'service_worker' && finalCategory ? {
            serviceWorkerProfile: {
              category: finalCategory,
              rating: 0,
              totalJobs: 0,
              isAvailable: true,
            }
          } : {}),
        };
        await setDoc(doc(db, 'users', user.uid), newProfile);
        setSuccess('Account created successfully!');
        setTimeout(() => navigate(role === 'service_worker' ? '/worker/dashboard' : getRedirectPath()), 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (cat: typeof SERVICE_WORKER_CATEGORIES[0]) => {
    if (cat.hasSubCategory) {
      setServiceWorkerCategory('mechanic_bike');
      setShowMechanicPicker(true);
    } else {
      setServiceWorkerCategory(cat.id);
      setMechanicSubType(null);
      setShowMechanicPicker(false);
    }
  };

  const selectedCategoryDisplay = () => {
    if (!serviceWorkerCategory) return null;
    if (serviceWorkerCategory === 'mechanic_bike' || serviceWorkerCategory === 'mechanic_car') {
      if (!mechanicSubType) return null;
      return mechanicSubType === 'mechanic_bike' ? 'Bike Mechanic' : 'Car Mechanic';
    }
    return SERVICE_WORKER_CATEGORIES.find(c => c.id === serviceWorkerCategory)?.label;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200 overflow-hidden border border-gray-100"
      >
        <div className="p-8 sm:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-6 shadow-xl shadow-orange-200">
              O
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin ? 'Enter your details to access your account' : 'Join OmniServe to get everything delivered'}
            </p>

            <div className="flex bg-gray-100 rounded-xl p-1 mt-6 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); resetOtpState(); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${authMethod === 'email' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'}`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('phone'); resetOtpState(); }}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${authMethod === 'phone' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600'}`}
              >
                Phone
              </button>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm font-medium">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {debugVerificationState && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <p className="text-blue-900 text-xs font-semibold">Debug</p>
              <p className="text-blue-800 text-xs mt-1 break-all">{debugVerificationState}</p>
              {debugPhoneNumber && (
                <p className="text-blue-700 text-xs mt-1">Phone: {debugPhoneNumber}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                {/* Full Name */}
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Role Selector */}
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setServiceWorkerCategory(null);
                      setMechanicSubType(null);
                      setShowMechanicPicker(false);
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
                  >
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="driver">Driver</option>
                    <option value="delivery_partner">Delivery Partner</option>
                    <option value="service_worker">Service Worker</option>
                  </select>
                </div>

                {/* Service Worker Category Picker */}
                <AnimatePresence>
                  {role === 'service_worker' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                        <p className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                          <Wrench className="w-4 h-4" />
                          Select your service category
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {SERVICE_WORKER_CATEGORIES.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = cat.hasSubCategory
                              ? (serviceWorkerCategory === 'mechanic_bike' || serviceWorkerCategory === 'mechanic_car')
                              : serviceWorkerCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategorySelect(cat)}
                                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                                  isSelected
                                    ? 'border-orange-400 bg-orange-100'
                                    : `${cat.bg} hover:border-orange-300`
                                }`}
                              >
                                <Icon className={`w-5 h-5 ${cat.color} flex-shrink-0`} />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-800 truncate">{cat.label}</p>
                                  <p className="text-[10px] text-gray-500 truncate">{cat.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Mechanic Sub-category */}
                        <AnimatePresence>
                          {showMechanicPicker && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="mt-3 p-3 bg-white rounded-xl border border-red-100"
                            >
                              <p className="text-xs font-bold text-red-700 mb-2">Choose mechanic type:</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => { setMechanicSubType('mechanic_bike'); setServiceWorkerCategory('mechanic_bike'); }}
                                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                                    mechanicSubType === 'mechanic_bike'
                                      ? 'bg-red-500 text-white border-red-500'
                                      : 'border-red-200 text-red-700 hover:bg-red-50'
                                  }`}
                                >
                                  🏍️ Bike
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setMechanicSubType('mechanic_car'); setServiceWorkerCategory('mechanic_car'); }}
                                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                                    mechanicSubType === 'mechanic_car'
                                      ? 'bg-red-500 text-white border-red-500'
                                      : 'border-red-200 text-red-700 hover:bg-red-50'
                                  }`}
                                >
                                  🚗 Car
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Selected Badge */}
                        {selectedCategoryDisplay() && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2"
                          >
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs font-semibold text-green-700">
                              Selected: {selectedCategoryDisplay()}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Email Field */}
            {authMethod === 'email' && (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            )}

            {/* Phone Field */}
            {authMethod === 'phone' && !showOtp && (
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-4 bg-gray-100 border border-r-0 border-gray-100 rounded-l-2xl text-gray-600 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 pl-4 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-r-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* OTP Field (Phone Auth) */}
            {showOtp && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-center text-lg font-mono tracking-widest"
                  required
                />
              </div>
            )}

            {/* Phone Number for Email Signup */}
            {!isLogin && authMethod === 'email' && (
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <div className="flex">
                  <span className="inline-flex items-center px-3 py-4 bg-gray-100 border border-r-0 border-gray-100 rounded-l-2xl text-gray-600 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Phone Number (Required)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="flex-1 pl-4 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-r-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  {phoneVerified && (
                    <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  )}
                </div>
              </div>
            )}

            {/* Phone OTP Verification during Email Signup */}
            {!isLogin && authMethod === 'email' && phone && phone.length === 10 && !phoneVerified && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Verify Phone Number</span>
                  <button
                    type="button"
                    onClick={sendPhoneVerification}
                    disabled={loading || otpCooldown > 0}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : otpCooldown > 0 ? `Resend (${otpCooldown}s)` : 'Send OTP'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-center text-lg font-mono tracking-widest"
                  />
                </div>
                <button
                  type="button"
                  onClick={verifyPhoneOtp}
                  disabled={loading || phoneOtp.length !== 6}
                  className="w-full bg-green-500 text-white py-3 rounded-2xl font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Phone'}
                </button>
              </div>
            )}

            {/* Password Fields for Email */}
            {authMethod === 'email' && (
              <>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-base hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : authMethod === 'phone' && !showOtp ? 'Send OTP' : 'Sign Up'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {isLogin && authMethod === 'email' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-orange-500 hover:underline text-sm font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border-2 border-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <Chrome className="w-5 h-5 text-red-500" />
            Google
          </button>

          <p className="text-center mt-8 text-gray-600 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setPhoneVerified(false);
                setServiceWorkerCategory(null);
                setMechanicSubType(null);
                setShowMechanicPicker(false);
                resetOtpState();
              }}
              className="text-orange-500 hover:underline font-bold"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>

          <div id="recaptcha-container"></div>
        </div>
      </motion.div>
    </div>
  );
};
