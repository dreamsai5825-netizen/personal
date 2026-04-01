import React, { useState } from 'react';
import { AlertTriangle, Clock, ChevronDown, Search, ArrowUpCircle, CheckCircle } from 'lucide-react';

const escalations = [
  { id: 'ESC-0012', ticketId: '#1204', customer: 'Kiran Mehta', issue: 'Payment Issue', level: 'Level 2', team: 'Finance Team', assignedTo: 'Sanjay K.', escalatedAt: 'Mar 31, 09:00 AM', status: 'Active' },
  { id: 'ESC-0011', ticketId: '#1200', customer: 'Arjun Patel', issue: 'Safety Concern', level: 'Operations', team: 'Operations Team', assignedTo: 'Meera L.', escalatedAt: 'Mar 31, 08:30 AM', status: 'Active' },
  { id: 'ESC-0010', ticketId: '#1198', customer: 'Ritu Sharma', issue: 'Fraud Complaint', level: 'Super Admin', team: 'Super Admin', assignedTo: 'Super Admin', escalatedAt: 'Mar 31, 07:15 AM', status: 'Active' },
  { id: 'ESC-0009', ticketId: '#1195', customer: 'Dev Mehta', issue: 'Repeated Issues', level: 'Level 2', team: 'Support Lead', assignedTo: 'Rahul V.', escalatedAt: 'Mar 30, 11:40 PM', status: 'Resolved' },
  { id: 'ESC-0008', ticketId: '#1190', customer: 'Anita Singh', issue: 'Driver Misconduct', level: 'Operations', team: 'Driver Relations', assignedTo: 'Pooja D.', escalatedAt: 'Mar 30, 09:20 PM', status: 'Resolved' },
];

const levelBadge: Record<string, string> = {
  'Level 1': 'bg-blue-500/20 text-blue-400',
  'Level 2': 'bg-purple-500/20 text-purple-400',
  'Operations': 'bg-amber-500/20 text-amber-400',
  'Super Admin': 'bg-red-500/20 text-red-400',
};

const statusBadge: Record<string, string> = {
  Active: 'bg-red-500/20 text-red-400',
  Resolved: 'bg-green-500/20 text-green-400',
};

const escalationLevels = [
  { level: 'Level 1', label: 'Level 1 Support', color: 'bg-blue-500', desc: 'Front-line agents handle basic queries and order issues.' },
  { level: 'Level 2', label: 'Level 2 Support', color: 'bg-purple-500', desc: 'Senior agents handle complex payment, billing, and dispute cases.' },
  { level: 'Operations', label: 'Operations Team', color: 'bg-amber-500', desc: 'Operations team handles driver misconduct, safety, and logistics.' },
  { level: 'Super Admin', label: 'Super Admin', color: 'bg-red-500', desc: 'Escalated to platform owners for critical fraud or policy violations.' },
];

export const Escalations: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = escalations.filter(e => {
    const matchSearch = e.customer.toLowerCase().includes(search.toLowerCase()) || e.id.includes(search);
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-2xl font-bold">Escalation System</h1>
        <p className="text-slate-400 text-sm mt-1">Manage unresolved issues escalated through the support tiers</p>
      </div>

      {/* Escalation Tier Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {escalationLevels.map(l => (
          <div key={l.level} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className={`w-8 h-8 ${l.color} rounded-lg flex items-center justify-center mb-3`}>
              <ArrowUpCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-white text-sm font-semibold">{l.label}</p>
            <p className="text-slate-500 text-xs mt-1 leading-relaxed">{l.desc}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Escalations', value: escalations.filter(e => e.status === 'Active').length, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Resolved Today', value: escalations.filter(e => e.status === 'Resolved').length, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Avg. Resolution', value: '4.2h', color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-slate-800 rounded-xl p-4`}>
            <p className="text-slate-400 text-xs">{s.label}</p>
            <p className={`${s.color} text-2xl font-bold mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search escalations..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-sm pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {['All', 'Active', 'Resolved'].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="text-left px-5 py-3 font-medium">Escalation ID</th>
                <th className="text-left px-5 py-3 font-medium">Ticket</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Issue</th>
                <th className="text-left px-5 py-3 font-medium">Level</th>
                <th className="text-left px-5 py-3 font-medium">Assigned To</th>
                <th className="text-left px-5 py-3 font-medium">Escalated At</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-amber-400 font-mono font-medium">{e.id}</td>
                  <td className="px-5 py-3.5 text-blue-400 font-mono text-xs">{e.ticketId}</td>
                  <td className="px-5 py-3.5 text-slate-200 font-medium">{e.customer}</td>
                  <td className="px-5 py-3.5 text-slate-300">{e.issue}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelBadge[e.level] || 'bg-slate-500/20 text-slate-400'}`}>{e.level}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-slate-200 text-sm">{e.assignedTo}</p>
                      <p className="text-slate-500 text-xs">{e.team}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />{e.escalatedAt}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[e.status]}`}>{e.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No escalations match your filters.</div>
        )}
      </div>
    </div>
  );
};
