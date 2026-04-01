import React, { useState } from 'react';
import { Search, Filter, Eye, MessageSquare, ArrowUpCircle, X, CheckCircle, ChevronDown } from 'lucide-react';

const allTickets = [
  { id: '#1208', customer: 'Rahul Sharma', phone: '+91 9876543210', issue: 'Order Delay', ref: 'Order #1024', priority: 'High', status: 'Open', created: 'Mar 31, 10:05 AM' },
  { id: '#1207', customer: 'Priya Patel', phone: '+91 9123456780', issue: 'Wrong Item', ref: 'Order #1022', priority: 'Medium', status: 'In Progress', created: 'Mar 31, 09:52 AM' },
  { id: '#1206', customer: 'Amit Kumar', phone: '+91 9988776655', issue: 'Driver Behavior', ref: 'Ride #2104', priority: 'High', status: 'Open', created: 'Mar 31, 09:38 AM' },
  { id: '#1205', customer: 'Sneha Reddy', phone: '+91 9871234560', issue: 'Refund Request', ref: 'Order #1018', priority: 'Low', status: 'Resolved', created: 'Mar 31, 08:10 AM' },
  { id: '#1204', customer: 'Kiran Mehta', phone: '+91 9765432108', issue: 'Payment Issue', ref: 'Order #1015', priority: 'High', status: 'Escalated', created: 'Mar 31, 07:44 AM' },
  { id: '#1203', customer: 'Nisha Jain', phone: '+91 9654321078', issue: 'Order Delay', ref: 'Order #1013', priority: 'Medium', status: 'Closed', created: 'Mar 30, 11:20 PM' },
  { id: '#1202', customer: 'Rohan Singh', phone: '+91 9543210987', issue: 'Ride Complaint', ref: 'Ride #2100', priority: 'Medium', status: 'In Progress', created: 'Mar 30, 10:55 PM' },
  { id: '#1201', customer: 'Deepa Nair', phone: '+91 9432109876', issue: 'Payment Issue', ref: 'Order #1010', priority: 'High', status: 'Resolved', created: 'Mar 30, 09:30 PM' },
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
  Closed: 'bg-slate-500/20 text-slate-400',
};

const issueTypes = ['All Issues', 'Order Delay', 'Wrong Item', 'Payment Issue', 'Ride Complaint', 'Driver Behavior', 'Refund Request'];
const statuses = ['All Status', 'Open', 'In Progress', 'Resolved', 'Escalated', 'Closed'];

type Ticket = typeof allTickets[0];

const TicketDetailModal: React.FC<{ ticket: Ticket; onClose: () => void }> = ({ ticket, onClose }) => {
  const [reply, setReply] = useState('');
  const chatHistory = [
    { from: 'Customer', msg: `Hi, I have an issue with ${ticket.ref}. ${ticket.issue}.`, time: '10:02 AM' },
    { from: 'System', msg: 'Ticket created and assigned to support team.', time: '10:05 AM' },
    { from: 'Agent', msg: 'Hello! I understand your concern. Let me look into this for you right away.', time: '10:08 AM' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-white font-bold text-lg">Ticket {ticket.id}</h2>
            <p className="text-slate-400 text-sm">{ticket.issue} · {ticket.ref}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">Customer Info</p>
              <p className="text-white font-medium">{ticket.customer}</p>
              <p className="text-slate-400 text-sm">{ticket.phone}</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-4">
              <p className="text-slate-400 text-xs mb-2">Ticket Details</p>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[ticket.priority]}`}>{ticket.priority}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[ticket.status]}`}>{ticket.status}</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">{ticket.created}</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-3">Issue Description</p>
            <p className="text-slate-200 text-sm">Customer reported: {ticket.issue} for {ticket.ref}. Customer requests immediate resolution and/or compensation.</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs mb-3">Chat History</p>
            <div className="space-y-3">
              {chatHistory.map((c, i) => (
                <div key={i} className={`flex gap-3 ${c.from === 'Agent' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    c.from === 'Customer' ? 'bg-blue-500' : c.from === 'Agent' ? 'bg-green-500' : 'bg-slate-600'
                  } text-white`}>
                    {c.from.charAt(0)}
                  </div>
                  <div className={`max-w-xs rounded-xl p-3 text-sm ${c.from === 'Agent' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                    <p>{c.msg}</p>
                    <p className="text-xs opacity-60 mt-1">{c.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Type your reply..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 resize-none"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
              <MessageSquare className="w-4 h-4" /> Send Reply
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors">
              <ArrowUpCircle className="w-4 h-4" /> Escalate
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors">
              <CheckCircle className="w-4 h-4" /> Resolve
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm rounded-lg transition-colors">
              <X className="w-4 h-4" /> Close Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TicketManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [issueFilter, setIssueFilter] = useState('All Issues');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selected, setSelected] = useState<Ticket | null>(null);

  const filtered = allTickets.filter(t => {
    const matchSearch = t.customer.toLowerCase().includes(search.toLowerCase()) || t.id.includes(search);
    const matchIssue = issueFilter === 'All Issues' || t.issue === issueFilter;
    const matchStatus = statusFilter === 'All Status' || t.status === statusFilter;
    return matchSearch && matchIssue && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white text-2xl font-bold">Support Tickets</h1>
        <p className="text-slate-400 text-sm mt-1">Manage and resolve customer support requests</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer or ticket ID..."
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
              <tr className="text-slate-500 text-xs uppercase border-b border-slate-800 bg-slate-900/80">
                <th className="text-left px-5 py-3 font-medium">Ticket ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Issue Type</th>
                <th className="text-left px-5 py-3 font-medium">Reference</th>
                <th className="text-left px-5 py-3 font-medium">Priority</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Created</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 text-blue-400 font-mono font-medium">{t.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-slate-200 font-medium">{t.customer}</p>
                    <p className="text-slate-500 text-xs">{t.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{t.issue}</td>
                  <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">{t.ref}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge[t.priority]}`}>{t.priority}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[t.status]}`}>{t.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-xs">{t.created}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelected(t)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white text-xs rounded-lg transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">No tickets match your filters.</div>
        )}
      </div>

      {selected && <TicketDetailModal ticket={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
