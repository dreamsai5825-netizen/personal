import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { auth, db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth';
import { motion } from 'motion/react';
import { User as UserIcon, Mail, Phone, MapPin, Camera, Save, AlertCircle, CheckCircle, Edit3, Plus } from 'lucide-react';
import { openRazorpayPayment } from '../lib/razorpay';

export const Profile: React.FC = () => {
  const { user, profile, isEmailVerified } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
  });

  const handleSave = async () => {
    if (!user || !profile) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: formData.name });

      // Update email if changed
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email);
        await sendEmailVerification(user);
        setSuccess('Profile updated! Please check your email to verify the new address.');
      }

      // Update Firestore profile
      const profileRef = doc(db, 'users', user.uid);
      await updateDoc(profileRef, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      if (!formData.email.includes('@')) {
        setSuccess('Profile updated successfully!');
      }

      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await sendEmailVerification(user);
      setSuccess('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState('500');

  const handleAddMoney = () => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0 || !user || !profile) return;

    setLoading(true);
    openRazorpayPayment(
      amount,
      { name: profile.name, email: user.email || '', phone: profile.phone || '' },
      async (res: any) => {
        try {
          const profileRef = doc(db, 'users', user.uid);
          const newBalance = (profile.walletBalance || 0) + amount;
          await updateDoc(profileRef, { walletBalance: newBalance });
          setSuccess(`Successfully added ₹${amount} to your wallet!`);
          setShowAddMoney(false);
        } catch (e) {
          setError('Failed to update wallet balance.');
        } finally {
          setLoading(false);
        }
      },
      (err: any) => {
        setError('Payment failed or was cancelled.');
        setLoading(false);
      }
    );
  };

  if (!user || !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-bold">
                  {profile.profileImage ? (
                    <img src={profile.profileImage} alt="" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-orange-100 capitalize">{profile.role.replace('_', ' ')}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${profile.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                  <span className="text-sm capitalize">{profile.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 text-sm font-medium">{success}</p>
              </div>
            )}

            {/* Email Verification Status */}
            {user.email && !isEmailVerified && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="text-yellow-800 text-sm font-medium">Email not verified</p>
                      <p className="text-yellow-700 text-xs">Please verify your email to access all features</p>
                    </div>
                  </div>
                  <button
                    onClick={handleResendVerification}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-600 text-white text-sm rounded-xl hover:bg-yellow-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Resend'}
                  </button>
                </div>
              </div>
            )}

            {/* Profile Form */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-900 font-medium">{user.email}</p>
                      {isEmailVerified && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <p className="text-gray-900 font-medium capitalize">{profile.role.replace('_', ' ')}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Balance</label>
                <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4">
                  <p className="text-3xl font-bold text-green-600">₹{profile.walletBalance || 0}</p>
                  <button
                    onClick={() => setShowAddMoney(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Money
                  </button>
                </div>
              </div>

              {showAddMoney && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-green-800 font-bold">Add Balance</h3>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input 
                        type="number" 
                        value={addAmount}
                        onChange={e => setAddAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 bg-white border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-700"
                      />
                    </div>
                    <button 
                      onClick={handleAddMoney}
                      disabled={loading || !addAmount}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {['500', '1000', '2000'].map(amt => (
                      <button 
                        key={amt} 
                        onClick={() => setAddAmount(amt)}
                        className="px-3 py-1.5 bg-white border border-green-200 text-green-700 rounded-lg text-sm font-bold hover:bg-green-100"
                      >
                        +₹{amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isEditing && (
                <div className="flex justify-end pt-6">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-2xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};