import React from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Award, Clock } from 'lucide-react';

const monthlyData = [
  { month: 'Sep', tickets: 820, resolved: 790, escalated: 30 },
  { month: 'Oct', tickets: 940, resolved: 910, escalated: 30 },
  { month: 'Nov', tickets: 1100, resolved: 1050, escalated: 50 },
  { month: 'Dec', tickets: 1300, resolved: 1240, escalated: 60 },
  { month: 'Jan', tickets: 980, resolved: 960, escalated: 20 },
  { month: 'Feb', tickets: 1050, resolved: 1020, escalated: 30 },
  { month: 'Mar', tickets: 1180, resolved: 1120, escalated: 60 },
];

const csatTrend = [
  { month: 'Sep', score: 4.1 },
  { month: 'Oct', score: 4.2 },
  { month: 'Nov', score: 3.9 },
  { month: 'Dec', score: 4.0 },
  { month: 'Jan', score: 4.3 },
  { month: 'Feb', score: 4.4 },
  { month: 'Mar', score: 4.3 },
];

const topAgents = [
  { name: 'Meera Lakshmanan', resolved: 312, csat: 4.8, avg: '1.2h' },
  { name: 'Sanjay Kumar', resolved: 298, csat: 4.7, avg: '1.4h' },
  { name: 'Pooja Desai', resolved: 275, csat: 4.6, avg: '1.6h' },
  { name: 'Rahul Verma', resolved: 260, csat: 4.5, avg: '1.8h' },
  { name: 'Anita Singh', resolved: 244, csat: 4.4, avg: '2.0h' },
];

export const SupportReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Support Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Performance analytics and support team insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Resolution Rate', value: '94.9%', change: '+1.2%', up: true, icon: Award },
          { label: 'Avg. Resolution Time', value: '1.8h', change: '-15 min', up: true, icon: Clock },
          { label: 'CSAT Score', value: '4.3/5', change: '+0.1', up: true, icon: TrendingUp },
          { label: 'Escalation Rate', value: '5.1%', change: '-0.5%', up: true, icon: TrendingDown },
        ].map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-slate-400 text-xs font-medium">{label}</p>
              <Icon className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-white text-2xl font-bold">{value}</p>
            <p className={`text-xs mt-1 ${up ? 'text-green-400' : 'text-red-400'}`}>{change} this month</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Monthly Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <Legend />
              <Bar dataKey="tickets" name="Total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="escalated" name="Escalated" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">CSAT Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={csatTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis domain={[3.5, 5]} stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <Line type="monotone" dataKey="score" name="CSAT" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Agents */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Top Performing Agents — March 2026</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="text-left pb-3 font-medium">Rank</th>
                <th className="text-left pb-3 font-medium">Agent</th>
                <th className="text-left pb-3 font-medium">Tickets Resolved</th>
                <th className="text-left pb-3 font-medium">CSAT Score</th>
                <th className="text-left pb-3 font-medium">Avg. Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {topAgents.map((a, i) => (
                <tr key={a.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pr-4">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-amber-500 text-white' : i === 1 ? 'bg-slate-400 text-slate-900' : i === 2 ? 'bg-amber-700 text-white' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {i + 1}
                    </div>
                  </td>
                  <td className="py-3 text-slate-200 font-medium">{a.name}</td>
                  <td className="py-3 text-slate-300">{a.resolved}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-700 rounded-full">
                        <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: `${(a.csat / 5) * 100}%` }} />
                      </div>
                      <span className="text-slate-300 text-xs">{a.csat}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{a.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
