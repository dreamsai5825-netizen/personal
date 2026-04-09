import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Package, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { foodOrderStore, groceryOrderStore, VendorOrder, statusBadge, VendorOrderStatus } from '../../lib/vendorOrderStore';
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
            <p className="text-emerald-400 text-sm">Please provide a reason — this will be shown to the customer</p>
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
            <p className="text-amber-300 text-xs">This reason will be visible to <span className="font-semibold">{order.customer}</span> and all admins who view this order.</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 border border-emerald-700 text-emerald-300 hover:text-white hover:bg-emerald-800 font-medium rounded-xl transition-all text-sm"
            >
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

export const VendorNotifications: React.FC = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [rejectTarget, setRejectTarget] = useState<VendorOrder | null>(null);
  const [filter, setFilter] = useState<'all' | 'new' | 'actioned'>('all');

  const isGrocery = profile?.role === 'grocery_store_vendor';
  const activeStore = isGrocery ? groceryOrderStore : foodOrderStore;

  useEffect(() => {
    setOrders(activeStore.getOrders());
    const unsub = activeStore.subscribe(() => {
      setOrders(activeStore.getOrders());
    });
    return unsub;
  }, [isGrocery, activeStore]);

  const handleAccept = (order: VendorOrder) => {
    activeStore.updateStatus(order.id, 'Accepted');
    activeStore.markNotified(order.id);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    activeStore.updateStatus(rejectTarget.id, 'Rejected', reason);
    activeStore.markNotified(rejectTarget.id);
    setRejectTarget(null);
  };

  const filtered = orders.filter(o => {
    if (filter === 'new') return o.status === 'New';
    if (filter === 'actioned') return o.status !== 'New';
    return true;
  });

  const newCount = orders.filter(o => o.status === 'New').length;
  const pendingCount = orders.filter(o => !o.notified).length;

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-emerald-400" />
            </div>
            Notifications
          </h1>
          <p className="text-emerald-400 text-sm mt-1 ml-13">Order alerts and updates for your store</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-xl animate-pulse">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-blue-400 font-semibold text-sm">{pendingCount} new alert{pendingCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <p className="text-blue-400 text-2xl font-bold">{newCount}</p>
          <p className="text-emerald-400 text-xs mt-0.5">Pending Action</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
          <p className="text-emerald-400 text-2xl font-bold">{orders.filter(o => o.status === 'Accepted').length}</p>
          <p className="text-emerald-400 text-xs mt-0.5">Accepted Today</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-red-400 text-2xl font-bold">{orders.filter(o => o.status === 'Rejected').length}</p>
          <p className="text-emerald-400 text-xs mt-0.5">Rejected Today</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'new', 'actioned'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              filter === f
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-900 text-emerald-400 hover:bg-emerald-800 hover:text-white border border-emerald-700'
            }`}
          >
            {f === 'all' ? 'All Notifications' : f === 'new' ? 'Pending Action' : 'Actioned'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-emerald-900 border border-emerald-800 rounded-2xl p-12 text-center">
            <Bell className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
            <p className="text-emerald-500 font-medium">No notifications here</p>
            <p className="text-emerald-700 text-sm mt-1">New order alerts will appear here</p>
          </div>
        ) : (
          filtered.map(order => (
            <div
              key={order.id}
              className={`bg-emerald-900 border rounded-2xl p-5 transition-all ${
                order.status === 'New'
                  ? 'border-blue-500/40 shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/20'
                  : order.status === 'Rejected'
                  ? 'border-red-500/30'
                  : 'border-emerald-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    order.status === 'New' ? 'bg-blue-500/20' :
                    order.status === 'Rejected' ? 'bg-red-500/20' :
                    'bg-emerald-800'
                  }`}>
                    <Package className={`w-6 h-6 ${
                      order.status === 'New' ? 'text-blue-400' :
                      order.status === 'Rejected' ? 'text-red-400' :
                      'text-emerald-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white font-bold text-lg">{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusBadge[order.status]}`}>
                        {order.status}
                      </span>
                      {order.status === 'New' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white animate-pulse">NEW ORDER</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-emerald-200">
                        <User className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{order.customer}</span>
                        <span className="text-emerald-600">·</span>
                        <span className="text-emerald-400 text-xs">{order.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-300">
                        <Package className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">{order.items}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{order.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-emerald-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(order.timestamp)}</span>
                        <span className="text-emerald-700">·</span>
                        <span className="text-white font-semibold">{order.amount}</span>
                      </div>
                    </div>

                    {order.status === 'Rejected' && order.rejectionReason && (
                      <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-start gap-2">
                        <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-300 text-xs font-semibold uppercase tracking-wide mb-0.5">Rejection Reason</p>
                          <p className="text-red-200 text-sm">{order.rejectionReason}</p>
                          <p className="text-red-500 text-xs mt-1">This reason has been sent to the customer and is visible to all admins.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {order.status === 'New' && (
                <div className="mt-4 pt-4 border-t border-emerald-800 flex gap-3">
                  <button
                    onClick={() => handleAccept(order)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept Order
                  </button>
                  <button
                    onClick={() => setRejectTarget(order)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white font-semibold rounded-xl transition-all text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Order
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

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
