import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, RefreshCw, ChevronDown } from 'lucide-react';

const refunds = [
  { id: '#5007', customer: 'Rahul Sharma', ref: 'Order #1024', amount: '₹398', reason: 'Order not delivered', status: 'Pending', requested: 'Mar 31, 10:05 AM' },
  { id: '#5006', customer: 'Priya Patel', ref: 'Order #1022', amount: '₹210', reason: 'Wrong item received', status: 'Approved', requested: 'Mar 31, 09:45 AM' },
  { id: '#5005', customer: 'Vikram Nair', ref: 'Ride #2101', amount: '₹120', reason: 'Overcharging by driver', status: 'Processed', requested: 'Mar 31, 08:50 AM' },
  { id: '#5004', customer: 'Kiran Mehta', ref: 'Order #1015', amount: '₹1,240', reason: 'Duplicate payment', status: 'Pending', requested: 'Mar 31, 07:44 AM' },
  { id: '#5003', customer: 'Nisha Jain', ref: 'Order #1013', amount: '₹320', reason: 'Order cancelled', status: 'Rejected', requested: 'Mar 30, 11:15 PM' },
  { id: '#5002', customer: 'Rohan Singh', ref: 'Ride #2100', amount: '₹450', reason: 'Route deviation', status: 'Approved', requested: 'Mar 30, 10:55 PM' },
  { id: '#5001', customer: 'Deepa Nair', ref: 'Order #1010', amount: '₹180', reason: 'Food quality issue', status: 'Processed', requested: 'Mar 30, 09:25 PM' },
];

const statusBadge: Record<string, string> = {
  Pending: 'bg-amber-500/20 text-amber-400',
  Approved: 'bg-blue-500/20 text-blue-400',
  Rejected: 'bg-red-500/20 text-red-400',
  Processed: 'bg-green-500/20 text-green-400',
};

type Refund = typeof refunds[0];

export const RefundManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [items, setItems] = useState(refunds);

  const statuses = ['All', 'Pending', 'Approved', 'Rejected', 'Processed'];

  const filtered = items.filter(r => {
    const matchSearch = r.customer.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search) || r.ref.includes(search);
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, newStatus: string) => {
    setItems(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const totals = {
    pending: items.filter(r => r.status === 'Pending').length,
    approved: items.filter(r => r.status === 'Approved').length,
    processed: items.filter(r => r.status === 'Processed').length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-2xl font-bold">Refund Management</h1>
        <p className="text-slate-400 text-sm mt-1">Review and process customer refund requests</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approval', value: totals.pending, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Approved', value: totals.approved, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Processed', value: totals.processed, color: 'text-green-400', bg: 'bg-green-500/10' },
          { label: 'Total Value', value: '₹2,918', color: 'text-purple-400', bg: 'bg-purple-500/10' },
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
            placeholder="Search by customer or refund ID..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-900 border border-slate-700 text-slate-200 text-sm pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800">
                <th className="text-left px-5 py-3 font-medium">Refund ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Reference</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Reason</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Requested</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-400 font-mono font-medium">{r.id}</td>
                  <td className="px-5 py-3.5 text-slate-200 font-medium">{r.customer}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono text-xs">{r.ref}</td>
                  <td className="px-5 py-3.5 text-white font-bold">{r.amount}</td>
                  <td className="px-5 py-3.5 text-slate-300 max-w-32 truncate">{r.reason}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{r.requested}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {r.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(r.id, 'Approved')}
                            className="p-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-lg transition-all"
                            title="Approve"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, 'Rejected')}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {r.status === 'Approved' && (
                        <button
                          onClick={() => updateStatus(r.id, 'Processed')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs rounded-lg transition-all"
                        >
                          <RefreshCw className="w-3 h-3" /> Process
                        </button>
                      )}
                      {(r.status === 'Processed' || r.status === 'Rejected') && (
                        <span className="text-slate-600 text-xs">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No refund requests match your filters.</div>
        )}
      </div>
    </div>
  );
};
