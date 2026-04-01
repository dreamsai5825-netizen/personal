import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Ticket, CheckCircle, RefreshCw, MessageSquare, TrendingUp, Clock } from 'lucide-react';

const weeklyTickets = [
  { day: 'Mon', opened: 38, resolved: 42 },
  { day: 'Tue', opened: 52, resolved: 49 },
  { day: 'Wed', opened: 61, resolved: 55 },
  { day: 'Thu', opened: 45, resolved: 60 },
  { day: 'Fri', opened: 70, resolved: 65 },
  { day: 'Sat', opened: 48, resolved: 50 },
  { day: 'Sun', opened: 32, resolved: 38 },
];

const issueTypes = [
  { name: 'Order Issues', value: 38, color: '#3b82f6' },
  { name: 'Payment', value: 22, color: '#8b5cf6' },
  { name: 'Ride Issues', value: 18, color: '#f59e0b' },
  { name: 'Refunds', value: 14, color: '#10b981' },
  { name: 'Other', value: 8, color: '#6b7280' },
];

const recentTickets = [
  { id: '#1208', customer: 'Rahul Sharma', issue: 'Order Delay', priority: 'High', status: 'Open', time: '5m ago' },
  { id: '#1207', customer: 'Priya Patel', issue: 'Wrong Item', priority: 'Medium', status: 'In Progress', time: '12m ago' },
  { id: '#1206', customer: 'Amit Kumar', issue: 'Driver Behavior', priority: 'High', status: 'Open', time: '25m ago' },
  { id: '#1205', customer: 'Sneha R.', issue: 'Refund Request', priority: 'Low', status: 'Resolved', time: '1h ago' },
  { id: '#1204', customer: 'Kiran M.', issue: 'Payment Issue', priority: 'High', status: 'Escalated', time: '2h ago' },
];

const statCards = [
  { label: 'Open Tickets', value: '45', sub: '+8 since yesterday', icon: Ticket, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { label: 'Resolved Today', value: '120', sub: '↑12% from yesterday', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
  { label: 'Pending Refunds', value: '8', sub: '₹12,450 total value', icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { label: 'Active Chats', value: '6', sub: 'Avg. wait: 2 min', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { label: 'Avg. Resolution Time', value: '1.8h', sub: '↓15% improvement', icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { label: 'CSAT Score', value: '4.3/5', sub: 'Based on 89 reviews', icon: TrendingUp, color: 'text-rose-400', bg: 'bg-rose-500/10' },
];

const priorityData = [
  { priority: 'High', count: 12, color: 'bg-red-500' },
  { priority: 'Medium', count: 20, color: 'bg-amber-500' },
  { priority: 'Low', count: 13, color: 'bg-green-500' },
];

const priorityBadge: Record<string, string> = {
  High: 'bg-red-500/20 text-red-400',
  Medium: 'bg-amber-500/20 text-amber-400',
  Low: 'bg-green-500/20 text-green-400',
};

const statusBadge: Record<string, string> = {
  Open: 'bg-blue-500/20 text-blue-400',
  'In Progress': 'bg-purple-500/20 text-purple-400',
  Resolved: 'bg-green-500/20 text-green-400',
  Escalated: 'bg-red-500/20 text-red-400',
};

export const CustomerCareOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Support Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Real-time overview of customer support operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-slate-400 text-xs font-medium">{label}</p>
              <p className="text-white text-2xl font-bold leading-tight">{value}</p>
              <p className="text-green-400 text-xs mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tickets Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Weekly Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyTickets}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              <Legend />
              <Bar dataKey="opened" name="Opened" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Ticket Priority</h3>
          <div className="space-y-4 mt-2">
            {priorityData.map(({ priority, count, color }) => (
              <div key={priority}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">{priority}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full">
                  <div
                    className={`h-2 ${color} rounded-full`}
                    style={{ width: `${(count / 45) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="text-slate-400 text-xs font-medium mb-3">Issue Type Breakdown</h4>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={issueTypes} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value">
                  {issueTypes.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {issueTypes.map(({ name, color }) => (
                <div key={name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-slate-400 text-xs">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recent Tickets</h3>
          <a href="/admin/support/tickets" className="text-blue-400 text-sm hover:text-blue-300 transition-colors">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="text-left pb-3 font-medium">Ticket</th>
                <th className="text-left pb-3 font-medium">Customer</th>
                <th className="text-left pb-3 font-medium">Issue</th>
                <th className="text-left pb-3 font-medium">Priority</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentTickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 text-blue-400 font-mono font-medium">{t.id}</td>
                  <td className="py-3 text-slate-200">{t.customer}</td>
                  <td className="py-3 text-slate-300">{t.issue}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="py-3 text-slate-500">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
