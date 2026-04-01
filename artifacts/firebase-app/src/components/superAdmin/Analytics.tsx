import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Download, TrendingUp, ShoppingBag, Car, Store, User } from 'lucide-react';

type Filter = 'daily' | 'weekly' | 'monthly' | 'custom';

const dailyRevenue = [
  { date: 'Jun 25', revenue: 280000, orders: 980, rides: 420 },
  { date: 'Jun 26', revenue: 310000, orders: 1050, rides: 460 },
  { date: 'Jun 27', revenue: 340000, orders: 1200, rides: 530 },
  { date: 'Jun 28', revenue: 290000, orders: 1010, rides: 390 },
  { date: 'Jun 29', revenue: 360000, orders: 1280, rides: 560 },
  { date: 'Jun 30', revenue: 420000, orders: 1450, rides: 620 },
  { date: 'Jul 1', revenue: 380000, orders: 1320, rides: 580 },
];

const weeklyRevenue = [
  { date: 'Week 1', revenue: 1800000, orders: 6200, rides: 2800 },
  { date: 'Week 2', revenue: 2100000, orders: 7100, rides: 3200 },
  { date: 'Week 3', revenue: 2400000, orders: 8400, rides: 3700 },
  { date: 'Week 4', revenue: 2200000, orders: 7800, rides: 3500 },
];

const monthlyRevenue = [
  { date: 'Jan', revenue: 7200000, orders: 24000, rides: 10800 },
  { date: 'Feb', revenue: 8100000, orders: 27000, rides: 12000 },
  { date: 'Mar', revenue: 7800000, orders: 26000, rides: 11500 },
  { date: 'Apr', revenue: 9200000, orders: 30000, rides: 13500 },
  { date: 'May', revenue: 10400000, orders: 34000, rides: 15000 },
  { date: 'Jun', revenue: 9800000, orders: 32000, rides: 14200 },
  { date: 'Jul', revenue: 11200000, orders: 37000, rides: 16500 },
];

const vendorPerformance = [
  { name: "Raj's Kitchen", orders: 1240, revenue: 186000, rating: 4.8 },
  { name: 'Spice Garden', orders: 980, revenue: 147000, rating: 4.6 },
  { name: 'Fresh Farms', orders: 860, revenue: 129000, rating: 4.7 },
  { name: 'QuickBite', orders: 1100, revenue: 165000, rating: 4.5 },
  { name: 'Green Grocer', orders: 720, revenue: 108000, rating: 4.9 },
];

const driverPerformance = [
  { name: 'Ravi Kumar', rides: 284, earnings: 42600, rating: 4.9 },
  { name: 'Suresh Singh', rides: 241, earnings: 36150, rating: 4.7 },
  { name: 'Manoj Patel', rides: 312, earnings: 46800, rating: 4.8 },
  { name: 'Deepak Sharma', rides: 198, earnings: 29700, rating: 4.6 },
  { name: 'Arjun Nair', rides: 267, earnings: 40050, rating: 4.9 },
];

const tooltipStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  color: '#f9fafb',
};

export const Analytics: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('daily');
  const [activeReport, setActiveReport] = useState<'revenue' | 'orders' | 'rides' | 'vendor' | 'driver'>('revenue');

  const data = filter === 'daily' ? dailyRevenue : filter === 'weekly' ? weeklyRevenue : monthlyRevenue;

  const summaryCards = [
    { label: 'Revenue Today', value: '₹3,40,000', change: '+18%', icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Orders Today', value: '1,200', change: '+12%', icon: ShoppingBag, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'Rides Today', value: '530', change: '+8%', icon: Car, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Avg Order Value', value: '₹280', change: '+5%', icon: Store, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Platform-wide performance insights</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg text-sm transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">{card.label}</p>
              <p className="text-white font-bold">{card.value}</p>
              <p className="text-green-400 text-xs">{card.change} vs yesterday</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {(['daily', 'weekly', 'monthly'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {(['revenue', 'orders', 'rides', 'vendor', 'driver'] as const).map(r => (
            <button
              key={r}
              onClick={() => setActiveReport(r)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${activeReport === r ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      {activeReport === 'revenue' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-4">Revenue Report</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {(activeReport === 'orders' || activeReport === 'rides') && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-4 capitalize">{activeReport} Report</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey={activeReport} fill={activeReport === 'orders' ? '#f97316' : '#06b6d4'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'vendor' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Vendor Performance</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {['Vendor', 'Orders', 'Revenue', 'Rating'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendorPerformance.map((v, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-white text-sm font-medium">{v.name}</td>
                  <td className="px-5 py-3 text-gray-300 text-sm">{v.orders.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-green-400 text-sm font-medium">₹{v.revenue.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className="text-yellow-400 text-sm">★ {v.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'driver' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Driver Performance</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {['Driver', 'Rides', 'Earnings', 'Rating'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {driverPerformance.map((d, i) => (
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-white text-sm font-medium">{d.name}</td>
                  <td className="px-5 py-3 text-gray-300 text-sm">{d.rides}</td>
                  <td className="px-5 py-3 text-green-400 text-sm font-medium">₹{d.earnings.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className="text-yellow-400 text-sm">★ {d.rating}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
