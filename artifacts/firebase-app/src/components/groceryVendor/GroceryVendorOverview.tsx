import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ShoppingCart, Clock, DollarSign, Star, TrendingUp, Package } from 'lucide-react';

const weeklyRevenue = [
  { day: 'Mon', orders: 22, revenue: 8800 },
  { day: 'Tue', orders: 28, revenue: 11200 },
  { day: 'Wed', orders: 25, revenue: 10000 },
  { day: 'Thu', orders: 35, revenue: 14000 },
  { day: 'Fri', orders: 42, revenue: 16800 },
  { day: 'Sat', orders: 55, revenue: 22000 },
  { day: 'Sun', orders: 48, revenue: 19200 },
];

const recentOrders = [
  { id: '#G204', customer: 'Meena Iyer', items: 'Milk x2, Bread x1', amount: '₹185', status: 'New', time: '2m ago' },
  { id: '#G203', customer: 'Suresh Nair', items: 'Rice 5kg, Dal 1kg', amount: '₹640', status: 'Accepted', time: '12m ago' },
  { id: '#G202', customer: 'Anita Rao', items: 'Tomatoes x2, Onions 2kg', amount: '₹210', status: 'Preparing', time: '25m ago' },
  { id: '#G201', customer: 'Deepak Verma', items: 'Butter, Eggs 12pk', amount: '₹320', status: 'Completed', time: '50m ago' },
];

const statusBadge: Record<string, string> = {
  New: 'bg-blue-500/20 text-blue-400',
  Accepted: 'bg-purple-500/20 text-purple-400',
  Preparing: 'bg-amber-500/20 text-amber-400',
  Ready: 'bg-green-500/20 text-green-400',
  Completed: 'bg-slate-500/20 text-slate-400',
};

const stats = [
  { label: "Today's Orders", value: '18', sub: '+5 from yesterday', icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Pending Orders', value: '3', sub: 'Needs attention', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: "Today's Revenue", value: '₹7,200', sub: '+22% from yesterday', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Average Rating', value: '4.4', sub: 'Based on 189 reviews', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { label: 'Active Products', value: '142', sub: '8 out of stock', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'This Month', value: '₹2,18,400', sub: '↑18% vs last month', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

export const GroceryVendorOverview: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-white text-2xl font-bold">Grocery Store Dashboard</h1>
      <p className="text-blue-400 text-sm mt-1">Welcome back! Here's how your grocery store is performing today.</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
        <div key={label} className="bg-blue-900 border border-blue-800 rounded-xl p-5 flex items-center gap-4">
          <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
          <div>
            <p className="text-blue-400 text-xs font-medium">{label}</p>
            <p className="text-white text-2xl font-bold leading-tight">{value}</p>
            <p className="text-blue-500 text-xs mt-0.5">{sub}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-blue-900 border border-blue-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Weekly Performance</h3>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={weeklyRevenue}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="day" stroke="#93c5fd" tick={{ fontSize: 12 }} />
            <YAxis stroke="#93c5fd" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e3a5f', border: '1px solid #1d4ed8', borderRadius: 8, color: '#fff' }} />
            <Legend />
            <Bar dataKey="orders" name="Orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="revenue" name="Revenue (₹)" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-blue-900 border border-blue-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-2">Order Status</h3>
        <div className="space-y-3 mt-4">
          {[
            { label: 'New', count: 3, color: 'bg-blue-500', total: 18 },
            { label: 'Preparing', count: 5, color: 'bg-amber-500', total: 18 },
            { label: 'Ready', count: 4, color: 'bg-green-500', total: 18 },
            { label: 'Completed', count: 6, color: 'bg-slate-500', total: 18 },
          ].map(({ label, count, color, total }) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-300">{label}</span>
                <span className="text-white font-semibold">{count}</span>
              </div>
              <div className="h-2 bg-blue-800 rounded-full">
                <div className={`h-2 ${color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 p-3 bg-blue-800/50 rounded-xl border border-blue-700">
          <p className="text-blue-400 text-xs">Avg. Packing Time</p>
          <p className="text-white text-xl font-bold mt-0.5">12 min</p>
          <p className="text-blue-500 text-xs">↓2 min from last week</p>
        </div>
      </div>
    </div>

    <div className="bg-blue-900 border border-blue-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Orders</h3>
        <a href="/grocery-vendor/orders" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">View all →</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-blue-500 text-xs uppercase border-b border-blue-800">
              <th className="text-left pb-3 font-medium">Order</th>
              <th className="text-left pb-3 font-medium">Customer</th>
              <th className="text-left pb-3 font-medium">Items</th>
              <th className="text-left pb-3 font-medium">Amount</th>
              <th className="text-left pb-3 font-medium">Status</th>
              <th className="text-left pb-3 font-medium">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-800">
            {recentOrders.map(o => (
              <tr key={o.id} className="hover:bg-blue-800/40 transition-colors">
                <td className="py-3 text-blue-400 font-mono font-medium">{o.id}</td>
                <td className="py-3 text-white">{o.customer}</td>
                <td className="py-3 text-blue-300 text-xs">{o.items}</td>
                <td className="py-3 text-white font-semibold">{o.amount}</td>
                <td className="py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[o.status]}`}>{o.status}</span>
                </td>
                <td className="py-3 text-blue-500 text-xs">{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
