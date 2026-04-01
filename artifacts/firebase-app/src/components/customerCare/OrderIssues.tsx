import React, { useState } from 'react';
import { Search, Phone, XCircle, RefreshCw, ArrowUpCircle, ChevronDown } from 'lucide-react';

const orderIssues = [
  { orderId: '#1024', customer: 'Rahul Sharma', vendor: "Bob's Burgers", issue: 'Order Delay', status: 'Preparing', reported: 'Mar 31, 10:02 AM', amount: '₹398' },
  { orderId: '#1022', customer: 'Priya Patel', vendor: 'Green Grocers', issue: 'Wrong Item', status: 'Delivered', reported: 'Mar 31, 09:45 AM', amount: '₹210' },
  { orderId: '#1019', customer: 'Vikram Nair', vendor: 'Pizza Palace', issue: 'Order Not Received', status: 'Out for Delivery', reported: 'Mar 31, 09:10 AM', amount: '₹550' },
  { orderId: '#1015', customer: 'Kiran Mehta', vendor: 'FreshMart', issue: 'Payment Issue', status: 'Pending', reported: 'Mar 31, 07:44 AM', amount: '₹1,240' },
  { orderId: '#1013', customer: 'Nisha Jain', vendor: 'Spice Route', issue: 'Order Delay', status: 'Preparing', reported: 'Mar 30, 11:15 PM', amount: '₹320' },
  { orderId: '#1010', customer: 'Deepa Nair', vendor: 'QuickMart', issue: 'Wrong Item Delivered', status: 'Delivered', reported: 'Mar 30, 09:25 PM', amount: '₹180' },
];

const issueBadge: Record<string, string> = {
  'Order Delay': 'bg-amber-500/20 text-amber-400',
  'Wrong Item': 'bg-red-500/20 text-red-400',
  'Order Not Received': 'bg-red-500/20 text-red-400',
  'Payment Issue': 'bg-purple-500/20 text-purple-400',
  'Wrong Item Delivered': 'bg-red-500/20 text-red-400',
};

const statusBadge: Record<string, string> = {
  Preparing: 'bg-blue-500/20 text-blue-400',
  Delivered: 'bg-green-500/20 text-green-400',
  'Out for Delivery': 'bg-cyan-500/20 text-cyan-400',
  Pending: 'bg-amber-500/20 text-amber-400',
};

export const OrderIssues: React.FC = () => {
  const [search, setSearch] = useState('');
  const [issueFilter, setIssueFilter] = useState('All');

  const issueTypes = ['All', 'Order Delay', 'Wrong Item', 'Order Not Received', 'Payment Issue', 'Wrong Item Delivered'];

  const filtered = orderIssues.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.orderId.includes(search);
    const matchIssue = issueFilter === 'All' || o.issue === issueFilter;
    return matchSearch && matchIssue;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-2xl font-bold">Order Issues</h1>
        <p className="text-slate-400 text-sm mt-1">Track and resolve customer order complaints</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Issues', value: '24', color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Order Delays', value: '10', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Wrong Items', value: '8', color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Resolved Today', value: '15', color: 'text-green-400', bg: 'bg-green-500/10' },
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
            placeholder="Search by customer or order ID..."
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
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Vendor</th>
                <th className="text-left px-5 py-3 font-medium">Issue Type</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Order Status</th>
                <th className="text-left px-5 py-3 font-medium">Reported</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(o => (
                <tr key={o.orderId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-400 font-mono font-medium">{o.orderId}</td>
                  <td className="px-5 py-3.5 text-slate-200 font-medium">{o.customer}</td>
                  <td className="px-5 py-3.5 text-slate-300">{o.vendor}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${issueBadge[o.issue] || 'bg-slate-500/20 text-slate-400'}`}>{o.issue}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 font-medium">{o.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[o.status] || 'bg-slate-500/20 text-slate-400'}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{o.reported}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="p-1.5 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all" title="Contact Vendor">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-lg transition-all" title="Issue Refund">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all" title="Cancel Order">
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
          <div className="text-center py-12 text-slate-500">No order issues match your filters.</div>
        )}
      </div>
    </div>
  );
};
