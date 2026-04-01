import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, ShoppingBag, Car, TrendingUp, Package, Bike, Truck, DollarSign } from 'lucide-react';

const dailyOrders = [
  { day: 'Mon', orders: 820, rides: 340 },
  { day: 'Tue', orders: 932, rides: 410 },
  { day: 'Wed', orders: 1100, rides: 390 },
  { day: 'Thu', orders: 980, rides: 460 },
  { day: 'Fri', orders: 1200, rides: 530 },
  { day: 'Sat', orders: 1450, rides: 620 },
  { day: 'Sun', orders: 1200, rides: 580 },
];

const revenueData = [
  { month: 'Jan', revenue: 240000 },
  { month: 'Feb', revenue: 310000 },
  { month: 'Mar', revenue: 280000 },
  { month: 'Apr', revenue: 360000 },
  { month: 'May', revenue: 420000 },
  { month: 'Jun', revenue: 390000 },
  { month: 'Jul', revenue: 480000 },
];

const userGrowth = [
  { month: 'Jan', users: 28000 },
  { month: 'Feb', users: 32000 },
  { month: 'Mar', users: 35000 },
  { month: 'Apr', users: 38000 },
  { month: 'May', users: 41000 },
  { month: 'Jun', users: 43500 },
  { month: 'Jul', users: 45000 },
];

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bg: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon: Icon, color, bg }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <p className="text-white text-2xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-green-400 text-xs mt-0.5">{sub}</p>}
    </div>
  </div>
);

export const SuperAdminOverview: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 45000,
    totalVendors: 1240,
    totalOrders: 12800,
    totalRides: 8700,
    totalRevenue: 3400000,
    activeDrivers: 384,
    activeDeliveryPartners: 512,
    ordersToday: 1200,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnap, vendorsSnap, ordersSnap, ridesSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'vendors')),
          getDocs(collection(db, 'orders')),
          getDocs(collection(db, 'rides')),
        ]);
        setStats(prev => ({
          ...prev,
          totalUsers: usersSnap.size || prev.totalUsers,
          totalVendors: vendorsSnap.size || prev.totalVendors,
          totalOrders: ordersSnap.size || prev.totalOrders,
          totalRides: ridesSnap.size || prev.totalRides,
        }));
      } catch (e) {
        // use default demo data
      }
    };
    fetchStats();
  }, []);

  const cards: StatCardProps[] = [
    { label: 'Total Users', value: stats.totalUsers.toLocaleString('en-IN'), sub: '+12% this month', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Vendors', value: stats.totalVendors.toLocaleString('en-IN'), sub: '+8% this month', icon: Package, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Orders', value: stats.totalOrders.toLocaleString('en-IN'), sub: `Today: ${stats.ordersToday.toLocaleString('en-IN')}`, icon: ShoppingBag, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Total Rides', value: stats.totalRides.toLocaleString('en-IN'), sub: '+5% this week', icon: Car, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`, sub: 'Today: ₹3,40,000', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Active Drivers', value: stats.activeDrivers.toLocaleString('en-IN'), sub: 'Currently online', icon: Car, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Delivery Partners', value: stats.activeDeliveryPartners.toLocaleString('en-IN'), sub: 'Currently active', icon: Bike, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Revenue Today', value: '₹3,40,000', sub: '+18% vs yesterday', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const tooltipStyle = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#f9fafb',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">Platform Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time system-wide metrics and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {cards.map(card => <StatCard key={card.label} {...card} />)}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Orders */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Daily Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ride Requests */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Ride Requests</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={dailyOrders}>
              <defs>
                <linearGradient id="rideGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rides" stroke="#06b6d4" fill="url(#rideGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Graph */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Monthly Revenue (₹)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toLocaleString('en-IN'), 'Users']} />
              <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
