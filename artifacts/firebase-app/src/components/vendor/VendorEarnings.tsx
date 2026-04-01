import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';

const monthlyData = [
  { month: 'Sep', gross: 68000, commission: 8160, net: 59840 },
  { month: 'Oct', gross: 74000, commission: 8880, net: 65120 },
  { month: 'Nov', gross: 82000, commission: 9840, net: 72160 },
  { month: 'Dec', gross: 95000, commission: 11400, net: 83600 },
  { month: 'Jan', gross: 78000, commission: 9360, net: 68640 },
  { month: 'Feb', gross: 88000, commission: 10560, net: 77440 },
  { month: 'Mar', gross: 92400, commission: 11088, net: 81312 },
];

const weeklyData = [
  { day: 'Mon', orders: 18, revenue: 3240 },
  { day: 'Tue', orders: 24, revenue: 4320 },
  { day: 'Wed', orders: 21, revenue: 3780 },
  { day: 'Thu', orders: 30, revenue: 5400 },
  { day: 'Fri', orders: 38, revenue: 6840 },
  { day: 'Sat', orders: 45, revenue: 8100 },
  { day: 'Sun', orders: 36, revenue: 6480 },
];

const current = monthlyData[monthlyData.length - 1];

export const VendorEarnings: React.FC = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const exportReport = (type: string) => {
    alert(`Exporting ${type} report... (In production, this would download a CSV/PDF)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Earnings & Reports</h1>
          <p className="text-emerald-400 text-sm mt-1">Track your revenue and financial performance</p>
        </div>
        <div className="flex gap-2">
          {(['daily', 'weekly', 'monthly'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-sm capitalize transition-all ${period === p ? 'bg-emerald-500 text-white' : 'bg-emerald-900 border border-emerald-800 text-emerald-400 hover:bg-emerald-800'}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Gross Revenue', value: `₹${current.gross.toLocaleString()}`, sub: 'This month', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Platform Commission (12%)', value: `₹${current.commission.toLocaleString()}`, sub: 'Deducted', color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Net Earnings', value: `₹${current.net.toLocaleString()}`, sub: 'This month', color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total (All Time)', value: '₹5,78,112', sub: '↑22% YoY', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, sub, color, bg }) => (
          <div key={label} className={`${bg} border border-emerald-800 rounded-xl p-5`}>
            <p className="text-emerald-400 text-xs">{label}</p>
            <p className={`${color} text-xl font-bold mt-1 leading-tight`}>{value}</p>
            <p className="text-emerald-600 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Monthly Revenue Breakdown</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
            <XAxis dataKey="month" stroke="#6ee7b7" tick={{ fontSize: 12 }} />
            <YAxis stroke="#6ee7b7" tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: 8, color: '#fff' }}
              formatter={(v: number) => [`₹${v.toLocaleString()}`, '']}
            />
            <Legend />
            <Bar dataKey="gross" name="Gross Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="commission" name="Commission" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="net" name="Net Earnings" fill="#34d399" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Orders Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">This Week's Revenue</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
              <XAxis dataKey="day" stroke="#6ee7b7" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6ee7b7" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#064e3b', border: '1px solid #065f46', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Export Reports */}
        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" /> Export Reports
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Daily Report', desc: 'Today\'s orders and revenue', icon: '📅' },
              { label: 'Weekly Report', desc: 'Last 7 days summary', icon: '📊' },
              { label: 'Monthly Report', desc: 'Full month breakdown with commission', icon: '📈' },
            ].map(({ label, desc, icon }) => (
              <div key={label} className="flex items-center justify-between p-3 bg-emerald-800/60 border border-emerald-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{label}</p>
                    <p className="text-emerald-500 text-xs">{desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => exportReport(label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs rounded-lg transition-all"
                >
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
