import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

const monthlyData = [
  { month: 'Sep', gross: 142000, commission: 17040, net: 124960 },
  { month: 'Oct', gross: 158000, commission: 18960, net: 139040 },
  { month: 'Nov', gross: 175000, commission: 21000, net: 154000 },
  { month: 'Dec', gross: 210000, commission: 25200, net: 184800 },
  { month: 'Jan', gross: 168000, commission: 20160, net: 147840 },
  { month: 'Feb', gross: 192000, commission: 23040, net: 168960 },
  { month: 'Mar', gross: 218400, commission: 26208, net: 192192 },
];

const weeklyData = [
  { day: 'Mon', orders: 22, revenue: 8800 },
  { day: 'Tue', orders: 28, revenue: 11200 },
  { day: 'Wed', orders: 25, revenue: 10000 },
  { day: 'Thu', orders: 35, revenue: 14000 },
  { day: 'Fri', orders: 42, revenue: 16800 },
  { day: 'Sat', orders: 55, revenue: 22000 },
  { day: 'Sun', orders: 48, revenue: 19200 },
];

const current = monthlyData[monthlyData.length - 1];

export const GroceryVendorEarnings: React.FC = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Earnings & Reports</h1>
          <p className="text-blue-400 text-sm mt-1">Track your grocery store revenue</p>
        </div>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-sm capitalize transition-all ${period === p ? 'bg-blue-500 text-white' : 'bg-blue-900 border border-blue-800 text-blue-400 hover:bg-blue-800'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Revenue', value: `₹${current.gross.toLocaleString()}`, sub: 'This month', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Platform Commission (12%)', value: `₹${current.commission.toLocaleString()}`, sub: 'Deducted', color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Net Earnings', value: `₹${current.net.toLocaleString()}`, sub: 'This month', color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total (All Time)', value: '₹12,63,792', sub: '↑28% YoY', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className={`${bg} border border-blue-800 rounded-xl p-5`}>
            <p className="text-blue-400 text-xs">{label}</p>
            <p className={`${color} text-xl font-bold mt-1 leading-tight`}>{value}</p>
            <p className="text-blue-600 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-900 border border-blue-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Monthly Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
            <XAxis dataKey="month" stroke="#93c5fd" tick={{ fontSize: 12 }} />
            <YAxis stroke="#93c5fd" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: '#1e3a5f', border: '1px solid #1d4ed8', borderRadius: 8, color: '#fff' }} formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
            <Legend />
            <Bar dataKey="gross" name="Gross Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="commission" name="Commission" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="net" name="Net Earnings" fill="#60a5fa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-blue-900 border border-blue-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">This Week's Revenue</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="day" stroke="#93c5fd" tick={{ fontSize: 12 }} />
              <YAxis stroke="#93c5fd" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e3a5f', border: '1px solid #1d4ed8', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-blue-900 border border-blue-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-400" /> Export Reports
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Daily Report', desc: "Today's orders and revenue", icon: '📅' },
              { label: 'Weekly Report', desc: 'Last 7 days summary', icon: '📊' },
              { label: 'Monthly Report', desc: 'Full month breakdown with commission', icon: '📈' },
            ].map(({ label, desc, icon }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-blue-800/60 border border-blue-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-blue-500 text-xs">{desc}</p>
                  </div>
                </div>
                <button onClick={() => alert(`Exporting ${label}...`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-blue-300 hover:text-white text-xs rounded-lg transition-all">
                  <Download className="w-3 h-3" /> Export
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
