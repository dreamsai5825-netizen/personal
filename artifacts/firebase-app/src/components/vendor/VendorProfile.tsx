import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { VendorEarnings } from './VendorEarnings';
import { VendorReviews } from './VendorReviews';
import { VendorSupport } from './VendorSupport';
import { Wallet, Star, DollarSign, HeadphonesIcon, User, ArrowUpRight, ArrowDownRight, CheckCircle, Plus } from 'lucide-react';
import { openRazorpayPayment } from '../../lib/razorpay';

const WalletTab = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [addAmount, setAddAmount] = useState('500');
  const [showAdd, setShowAdd] = useState(false);

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
          setShowAdd(false);
        } catch (e) {
          alert('Failed to update wallet balance.');
        } finally {
          setLoading(false);
        }
      },
      (err: any) => {
        alert('Payment failed or was cancelled.');
        setLoading(false);
      }
    );
  };

  const transactions = [
    { id: '1', type: 'credit', amount: 450, desc: 'Order #4892 completed', date: 'Today, 2:30 PM' },
    { id: '2', type: 'debit', amount: 1500, desc: 'Withdrawn to Bank', date: 'Yesterday, 10:00 AM' },
    { id: '3', type: 'credit', amount: 320, desc: 'Order #4890 completed', date: 'Yesterday, 9:15 AM' },
    { id: '4', type: 'debit', amount: 250, desc: 'Refunded to Customer (Order #4885)', date: 'Mon, 4:20 PM' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-emerald-900 border border-emerald-800 rounded-2xl p-6">
        <p className="text-emerald-400 text-sm font-medium">Available Balance</p>
        <h2 className="text-white text-4xl font-bold mt-2">₹{profile?.walletBalance || 0}</h2>
        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 py-3 rounded-xl font-semibold transition-colors">Withdraw Funds</button>
          <button onClick={() => setShowAdd(!showAdd)} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Money
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="bg-emerald-800 border border-emerald-700 rounded-2xl p-6 space-y-4">
          <h3 className="text-white font-bold">Add Balance</h3>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">₹</span>
              <input 
                type="number" 
                value={addAmount}
                onChange={e => setAddAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-emerald-900 border border-emerald-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-white"
              />
            </div>
            <button 
              onClick={handleAddMoney}
              disabled={loading || !addAmount}
              className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay with Razorpay'}
            </button>
          </div>
          <div className="flex gap-2">
            {['500', '1000', '2000'].map(amt => (
              <button 
                key={amt} 
                onClick={() => setAddAmount(amt)}
                className="px-3 py-1.5 bg-emerald-900 border border-emerald-700 text-emerald-400 rounded-lg text-sm font-bold hover:bg-emerald-800"
              >
                +₹{amt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-white font-bold text-lg mb-4">Transaction History</h3>
        <div className="space-y-3">
          {transactions.map(t => (
            <div key={t.id} className="bg-emerald-900 border border-emerald-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {t.type === 'credit' ? <ArrowDownRight className="w-5 h-5 text-green-400" /> : <ArrowUpRight className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{t.desc}</p>
                  <p className="text-emerald-500 text-xs">{t.date}</p>
                </div>
              </div>
              <p className={`font-bold ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                {t.type === 'credit' ? '+' : '-'}₹{t.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileInfoTab = () => {
  const { profile, user } = useAuth();
  return (
    <div className="bg-emerald-900 border border-emerald-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-4 border-b border-emerald-800 pb-6">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
          {profile?.name?.charAt(0) || 'V'}
        </div>
        <div>
          <h2 className="text-white text-2xl font-bold">{profile?.name || 'Vendor Name'}</h2>
          <p className="text-emerald-400">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-xs font-medium">Verified Vendor</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-emerald-500 text-xs font-medium">Phone</label>
          <p className="text-white">{profile?.phone || 'Not Provided'}</p>
        </div>
        <div>
          <label className="text-emerald-500 text-xs font-medium">Role</label>
          <p className="text-white capitalize">{profile?.role?.replace('_', ' ') || 'Vendor'}</p>
        </div>
      </div>
    </div>
  );
};

export const VendorProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'wallet' | 'earnings' | 'reviews' | 'support'>('info');

  const tabs = [
    { id: 'info', label: 'Info', icon: User },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'earnings', label: 'Earnings & Reports', icon: DollarSign },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'support', label: 'Support', icon: HeadphonesIcon },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 md:pb-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Store Profile</h1>
        <p className="text-emerald-400 text-sm mt-1">Manage your wallet, reviews, earnings and support</p>
      </div>

      <div className="flex overflow-x-auto no-scrollbar border-b border-emerald-800">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.id ? 'border-orange-500 text-orange-400' : 'border-transparent text-emerald-500 hover:text-emerald-300'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-[50vh]">
        {activeTab === 'info' && <ProfileInfoTab />}
        {activeTab === 'wallet' && <WalletTab />}
        {activeTab === 'earnings' && <VendorEarnings />}
        {activeTab === 'reviews' && <VendorReviews />}
        {activeTab === 'support' && <VendorSupport />}
      </div>
    </div>
  );
};
