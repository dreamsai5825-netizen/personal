import React, { useState } from 'react';
import { Search, Phone, XCircle, RefreshCw, ArrowUpCircle, ChevronDown, Car } from 'lucide-react';

const rideIssues = [
  { rideId: '#2104', passenger: 'Rahul Sharma', driver: 'Amit Verma', issue: 'Driver Late', status: 'Completed', reported: 'Mar 31, 10:00 AM', fare: '₹185' },
  { rideId: '#2103', passenger: 'Priya Patel', driver: 'Suresh Kumar', issue: 'Driver Behavior', status: 'Completed', reported: 'Mar 31, 09:30 AM', fare: '₹220' },
  { rideId: '#2101', passenger: 'Vikram Nair', driver: 'Raj Singh', issue: 'Wrong Route', status: 'In Progress', reported: 'Mar 31, 08:50 AM', fare: '₹310' },
  { rideId: '#2100', passenger: 'Rohan Singh', driver: 'Dev Sharma', issue: 'Overcharging', status: 'Completed', reported: 'Mar 30, 11:00 PM', fare: '₹450' },
  { rideId: '#2098', passenger: 'Sneha Reddy', driver: 'Karan Mehta', issue: 'Ride Cancelled', status: 'Cancelled', reported: 'Mar 30, 09:20 PM', fare: '₹0' },
  { rideId: '#2095', passenger: 'Deepa Nair', driver: 'Vijay Kumar', issue: 'Safety Issue', status: 'Completed', reported: 'Mar 30, 08:10 PM', fare: '₹275' },
];

const issueBadge: Record<string, string> = {
  'Driver Late': 'bg-amber-500/20 text-amber-400',
  'Driver Behavior': 'bg-red-500/20 text-red-400',
  'Wrong Route': 'bg-purple-500/20 text-purple-400',
  'Overcharging': 'bg-red-500/20 text-red-400',
  'Ride Cancelled': 'bg-slate-500/20 text-slate-400',
  'Safety Issue': 'bg-red-600/20 text-red-500',
};

const statusBadge: Record<string, string> = {
  Completed: 'bg-green-500/20 text-green-400',
  'In Progress': 'bg-blue-500/20 text-blue-400',
  Cancelled: 'bg-slate-500/20 text-slate-400',
};

export const RideIssues: React.FC = () => {
  const [search, setSearch] = useState('');
  const [issueFilter, setIssueFilter] = useState('All');

  const issueTypes = ['All', 'Driver Late', 'Driver Behavior', 'Wrong Route', 'Overcharging', 'Ride Cancelled', 'Safety Issue'];

  const filtered = rideIssues.filter(r => {
    const matchSearch = r.passenger.toLowerCase().includes(search.toLowerCase()) || r.rideId.includes(search) || r.driver.toLowerCase().includes(search.toLowerCase());
    const matchIssue = issueFilter === 'All' || r.issue === issueFilter;
    return matchSearch && matchIssue;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-2xl font-bold">Ride Issues</h1>
        <p className="text-slate-400 text-sm mt-1">Manage passenger and driver ride complaints</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Issues', value: '18', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Driver Complaints', value: '7', color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Overcharging', value: '4', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Resolved Today', value: '11', color: 'text-green-400', bg: 'bg-green-500/10' },
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
            placeholder="Search passenger, driver, or ride ID..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <select
            value={issueFilter}
            onChange={e => setIssueFilter(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-sm pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {issueTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="text-left px-5 py-3 font-medium">Ride ID</th>
                <th className="text-left px-5 py-3 font-medium">Passenger</th>
                <th className="text-left px-5 py-3 font-medium">Driver</th>
                <th className="text-left px-5 py-3 font-medium">Issue Type</th>
                <th className="text-left px-5 py-3 font-medium">Fare</th>
                <th className="text-left px-5 py-3 font-medium">Ride Status</th>
                <th className="text-left px-5 py-3 font-medium">Reported</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(r => (
                <tr key={r.rideId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-400 font-mono font-medium">{r.rideId}</td>
                  <td className="px-5 py-3.5 text-slate-200 font-medium">{r.passenger}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                        <Car className="w-3 h-3 text-slate-400" />
                      </div>
                      <span className="text-slate-300">{r.driver}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${issueBadge[r.issue] || 'bg-slate-500/20 text-slate-400'}`}>{r.issue}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-medium">{r.fare}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[r.status] || 'bg-slate-500/20 text-slate-400'}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{r.reported}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all" title="Contact Driver">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-lg transition-all" title="Issue Refund">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all" title="Cancel Ride">
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-white rounded-lg transition-all" title="Escalate">
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No ride issues match your filters.</div>
        )}
      </div>
    </div>
  );
};
