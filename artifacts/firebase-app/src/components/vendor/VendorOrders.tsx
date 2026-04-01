import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle, XCircle, Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { foodOrderStore as orderStore, VendorOrder, VendorOrderStatus, statusBadge, nextStatus } from '../../lib/vendorOrderStore';
import { useAuth } from '../../AuthContext';

const RejectionReasonModal: React.FC<{
  order: VendorOrder;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}> = ({ order, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const presetReasons = [
    'Item currently unavailable',
    'Store is closing soon',
    'Too busy, unable to fulfil',
    'Delivery address out of range',
    'Payment issue',
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-emerald-900 border border-emerald-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 p-5 border-b border-emerald-800">
          <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Reject Order {order.id}</h2>
            <p className="text-emerald-400 text-sm">This reason will be shown to the customer</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <p className="text-emerald-300 text-sm font-medium mb-2">Select a reason</p>
            <div className="grid grid-cols-2 gap-2">
              {presetReasons.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r === 'Other' ? '' : r)}
                  className={`text-left px-3 py-2 rounded-lg text-xs border transition-all ${
                    reason === r
                      ? 'bg-red-500/20 border-red-500/50 text-red-300'
                      : 'bg-emerald-800 border-emerald-700 text-emerald-300 hover:border-emerald-500'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-emerald-300 text-sm font-medium mb-2">Or type a custom reason</p>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={3}
              className="w-full bg-emerald-800 border border-emerald-700 text-emerald-100 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-emerald-600 resize-none"
            />
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-amber-300 text-xs">Rejection reason will be visible to the customer and all admins.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-2.5 border border-emerald-700 text-emerald-300 hover:text-white hover:bg-emerald-800 font-medium rounded-xl transition-all text-sm">
              Cancel
            </button>
            <button
              onClick={() => reason.trim() && onConfirm(reason.trim())}
              disabled={!reason.trim()}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all text-sm"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailModal: React.FC<{
  order: VendorOrder;
  onClose: () => void;
  onUpdateStatus: (id: string, s: VendorOrderStatus) => void;
  onReject: (order: VendorOrder) => void;
}> = ({ order, onClose, onUpdateStatus, onReject }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
    <div className="bg-emerald-900 border border-emerald-700 rounded-2xl w-full max-w-md">
      <div className="flex items-center justify-between p-5 border-b border-emerald-800">
        <h2 className="text-white font-bold text-lg">Order {order.id}</h2>
        <button onClick={onClose} className="text-emerald-400 hover:text-white">✕</button>
      </div>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-emerald-800 rounded-xl p-3">
            <p className="text-emerald-400 text-xs">Customer</p>
            <p className="text-white font-medium">{order.customer}</p>
            <p className="text-emerald-400 text-xs">{order.phone}</p>
          </div>
          <div className="bg-emerald-800 rounded-xl p-3">
            <p className="text-emerald-400 text-xs">Status</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium mt-1 inline-block border ${statusBadge[order.status]}`}>{order.status}</span>
            <p className="text-emerald-400 text-xs mt-1">{order.time}</p>
          </div>
        </div>
        <div className="bg-emerald-800 rounded-xl p-3">
          <p className="text-emerald-400 text-xs mb-1">Delivery Address</p>
          <p className="text-emerald-100 text-sm">{order.address}</p>
        </div>
        <div className="bg-emerald-800 rounded-xl p-3">
          <p className="text-emerald-400 text-xs mb-2">Items Ordered</p>
          {order.items.split(', ').map((item, i) => (
            <div key={i} className="flex justify-between text-sm py-1 border-b border-emerald-700 last:border-0">
              <span className="text-emerald-100">{item}</span>
            </div>
          ))}
          <div className="flex justify-between mt-2 pt-2 border-t border-emerald-700">
            <span className="text-emerald-400 text-sm font-medium">Total</span>
            <span className="text-white font-bold">{order.amount}</span>
          </div>
        </div>

        {order.status === 'Rejected' && order.rejectionReason && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <p className="text-red-300 text-xs font-semibold uppercase tracking-wide mb-1">Rejection Reason</p>
            <p className="text-red-200 text-sm">{order.rejectionReason}</p>
          </div>
        )}

        {order.status === 'New' && (
          <div className="flex gap-3">
            <button
              onClick={() => { onUpdateStatus(order.id, 'Accepted'); onClose(); }}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Accept Order
            </button>
            <button
              onClick={() => { onReject(order); onClose(); }}
              className="flex-1 py-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <XCircle className="w-4 h-4" /> Reject Order
            </button>
          </div>
        )}

        {nextStatus[order.status] && order.status !== 'New' && (
          <button
            onClick={() => { onUpdateStatus(order.id, nextStatus[order.status]!); onClose(); }}
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors"
          >
            Mark as {nextStatus[order.status]}
          </button>
        )}
      </div>
    </div>
  </div>
);

export const VendorOrders: React.FC = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selected, setSelected] = useState<VendorOrder | null>(null);
  const [rejectTarget, setRejectTarget] = useState<VendorOrder | null>(null);

  const isGrocery = profile?.role === 'grocery_store_vendor';

  useEffect(() => {
    const refresh = () => {
      setOrders(orderStore.getOrders().filter(o => isGrocery ? o.vendorType === 'grocery' : o.vendorType === 'food'));
    };
    refresh();
    const unsub = orderStore.subscribe(refresh);
    return unsub;
  }, [isGrocery]);

  const statuses = ['All', 'New', 'Accepted', 'Preparing', 'Ready for Pickup', 'Picked Up', 'Completed', 'Rejected'];

  const updateStatus = (id: string, status: VendorOrderStatus) => {
    orderStore.updateStatus(id, status);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    orderStore.updateStatus(rejectTarget.id, 'Rejected', reason);
    setRejectTarget(null);
  };

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const newCount = orders.filter(o => o.status === 'New').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Orders Management</h1>
          <p className="text-emerald-400 text-sm mt-1">Manage and fulfil customer orders</p>
        </div>
        {newCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl animate-pulse">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-blue-400 font-semibold text-sm">{newCount} New Order{newCount > 1 ? 's' : ''}!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'New', count: orders.filter(o => o.status === 'New').length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Preparing', count: orders.filter(o => o.status === 'Preparing').length, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Ready', count: orders.filter(o => o.status === 'Ready for Pickup').length, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Completed', count: orders.filter(o => o.status === 'Completed').length, color: 'text-slate-400', bg: 'bg-slate-500/10' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-emerald-800 rounded-xl p-4 text-center`}>
            <p className={`${s.color} text-2xl font-bold`}>{s.count}</p>
            <p className="text-emerald-400 text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders or customers..."
            className="w-full bg-emerald-900 border border-emerald-700 text-emerald-100 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-emerald-600"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none bg-emerald-900 border border-emerald-700 text-emerald-100 text-sm pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {statuses.map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-emerald-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="bg-emerald-900 border border-emerald-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-emerald-500 text-xs uppercase border-b border-emerald-800">
                <th className="text-left px-5 py-3 font-medium">Order ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium">Items</th>
                <th className="text-left px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Time</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800">
              {filtered.map(o => (
                <tr key={o.id} className={`hover:bg-emerald-800/40 transition-colors ${o.status === 'New' ? 'bg-blue-500/5' : ''}`}>
                  <td className="px-5 py-3.5 text-emerald-400 font-mono font-medium">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{o.customer}</p>
                    <p className="text-emerald-500 text-xs">{o.phone}</p>
                  </td>
                  <td className="px-5 py-3.5 text-emerald-300 text-xs max-w-40">{o.items}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">{o.amount}</td>
                  <td className="px-5 py-3.5">
                    <div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge[o.status]}`}>{o.status}</span>
                      {o.status === 'Rejected' && o.rejectionReason && (
                        <p className="text-red-400 text-xs mt-1 max-w-32 truncate" title={o.rejectionReason}>
                          Reason: {o.rejectionReason}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-emerald-500 text-xs">{o.time}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setSelected(o)} className="p-1.5 bg-emerald-700/50 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-all" title="View Details">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {o.status === 'New' && (
                        <>
                          <button onClick={() => updateStatus(o.id, 'Accepted')} className="p-1.5 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white rounded-lg transition-all" title="Accept">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setRejectTarget(o)} className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all" title="Reject">
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {nextStatus[o.status] && o.status !== 'New' && (
                        <button onClick={() => updateStatus(o.id, nextStatus[o.status]!)} className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white rounded-lg transition-all" title={`Mark as ${nextStatus[o.status]}`}>
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-emerald-600">No orders match your filters.</div>
        )}
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={updateStatus}
          onReject={(o) => { setSelected(null); setRejectTarget(o); }}
        />
      )}
      {rejectTarget && (
        <RejectionReasonModal
          order={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
};
