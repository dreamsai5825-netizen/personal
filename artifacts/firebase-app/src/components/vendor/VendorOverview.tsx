import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ShoppingBag, Clock, DollarSign, Star, TrendingUp, Package } from 'lucide-react';

const weeklyRevenue = [
  { day: 'Mon', orders: 18, revenue: 3240 },
  { day: 'Tue', orders: 24, revenue: 4320 },
  { day: 'Wed', orders: 21, revenue: 3780 },
  { day: 'Thu', orders: 30, revenue: 5400 },
  { day: 'Fri', orders: 38, revenue: 6840 },
  { day: 'Sat', orders: 45, revenue: 8100 },
  { day: 'Sun', orders: 36, revenue: 6480 },
];

const recentOrders = [
  { id: '#1031', customer: 'Rahul Sharma', items: 'Burger x2, Fries x1', amount: '₹548', status: 'New', time: '2m ago' },
  { id: '#1030', customer: 'Priya Patel', items: 'Pizza x1, Coke x2', amount: '₹420', status: 'Preparing', time: '10m ago' },
  { id: '#1029', customer: 'Amit Kumar', items: 'Biryani x2', amount: '₹598', status: 'Ready', time: '22m ago' },
  { id: '#1028', customer: 'Sneha R.', items: 'Salad x1, Juice x1', amount: '₹280', status: 'Completed', time: '45m ago' },
];

const statusBadge: Record<string, string> = {
  New: 'bg-blue-500/20 text-blue-400',
  Accepted: 'bg-purple-500/20 text-purple-400',
  Preparing: 'bg-amber-500/20 text-amber-400',
  Ready: 'bg-emerald-500/20 text-emerald-400',
  Completed: 'bg-slate-500/20 text-slate-400',
};

const stats = [
  { label: "Today's Orders", value: '12', sub: '+3 from yesterday', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Pending Orders', value: '4', sub: 'Needs attention', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: "Today's Revenue", value: '₹4,500', sub: '+18% from yesterday', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Average Rating', value: '4.6', sub: 'Based on 312 reviews', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'Active Products', value: '34', sub: '2 out of stock', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'This Month', value: '₹92,400', sub: '↑22% vs last month', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export const VendorOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Vendor Dashboard</h1>
        <p className="text-emerald-400 text-sm mt-1">Welcome back! Here's how your store is performing today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-emerald-400 text-xs font-medium">{label}</p>
              <p className="text-white text-2xl font-bold leading-tight">{value}</p>
              <p className="text-emerald-500 text-xs mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-emerald-900 border border-emerald-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Weekly Performance</h3>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={weeklyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
              <XAxis dataKey="day" stroke="#6ee7b7" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6ee7b7" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: 8, color: '#fff' }} />
              <Legend />
              <Bar dataKey="orders" name="Orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Revenue (₹)" fill="#34d399" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-2">Order Status</h3>
          <div className="space-y-3 mt-4">
            {[
              { label: 'New', count: 2, color: 'bg-blue-500', total: 12 },
              { label: 'Preparing', count: 4, color: 'bg-amber-500', total: 12 },
              { label: 'Ready', count: 2, color: 'bg-emerald-500', total: 12 },
              { label: 'Completed', count: 4, color: 'bg-slate-500', total: 12 },
            ].map(({ label, count, color, total }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-emerald-300">{label}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
                <div className="h-2 bg-emerald-800 rounded-full">
                  <div className={`h-2 ${color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 bg-emerald-800/50 rounded-xl border border-emerald-700">
            <p className="text-emerald-400 text-xs">Avg. Prep Time</p>
            <p className="text-white text-xl font-bold mt-0.5">18 min</p>
            <p className="text-emerald-500 text-xs">↓3 min from last week</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recent Orders</h3>
          <a href="/food-vendor/orders" className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-emerald-500 text-xs uppercase border-b border-emerald-800">
                <th className="text-left pb-3 font-medium">Order</th>
                <th className="text-left pb-3 font-medium">Customer</th>
                <th className="text-left pb-3 font-medium">Items</th>
                <th className="text-left pb-3 font-medium">Amount</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800">
              {recentOrders.map(o => (
                <tr key={o.id} className="hover:bg-emerald-800/40 transition-colors">
                  <td className="py-3 text-emerald-400 font-mono font-medium">{o.id}</td>
                  <td className="py-3 text-white">{o.customer}</td>
                  <td className="py-3 text-emerald-300 text-xs">{o.items}</td>
                  <td className="py-3 text-white font-semibold">{o.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="py-3 text-emerald-500 text-xs">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
