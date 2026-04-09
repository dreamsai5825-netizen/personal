import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { foodOrderStore, groceryOrderStore, VendorOrder, VendorOrderStatus, statusBadge, nextStatus } from '../../lib/vendorOrderStore';
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
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-emerald-900 border border-emerald-700 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-emerald-800">
          <XCircle className="w-5 h-5 text-red-400" />
          <h2 className="text-white font-bold">Reject Order {order.id.slice(-4)}</h2>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-emerald-300 text-sm font-medium">Select a reason</p>
          <div className="grid grid-cols-1 gap-2">
            {presetReasons.map(r => (
              <button
                key={r}
                onClick={() => setReason(r === 'Other' ? '' : r)}
                className={`text-left px-3 py-2 rounded-lg text-sm border transition-all ${
                  reason === r ? 'bg-red-500/20 border-red-500/50 text-red-300' : 'bg-emerald-800 border-emerald-700 text-emerald-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Custom reason..."
            rows={2}
            className="w-full bg-emerald-800 border border-emerald-700 text-emerald-100 text-sm px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-emerald-600 resize-none"
          />
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-2 text-emerald-300 border border-emerald-700 rounded-xl text-sm">Cancel</button>
            <button
              onClick={() => reason.trim() && onConfirm(reason.trim())}
              disabled={!reason.trim()}
              className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white font-semibold rounded-xl text-sm"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VendorOrders: React.FC = () => {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'New' | 'Pending' | 'Completed' | 'Status'>('New');
  const [rejectTarget, setRejectTarget] = useState<VendorOrder | null>(null);

  const isGrocery = profile?.role === 'grocery_store_vendor';
  const activeStore = isGrocery ? groceryOrderStore : foodOrderStore;

  useEffect(() => {
    const refresh = () => setOrders(activeStore.getOrders());
    refresh();
    const unsub = activeStore.subscribe(refresh);
    return unsub;
  }, [isGrocery, activeStore]);

  const updateStatus = (id: string, status: VendorOrderStatus) => {
    activeStore.updateStatus(id, status);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    activeStore.updateStatus(rejectTarget.id, 'Rejected', reason);
    setRejectTarget(null);
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'New') return o.status === 'New';
    if (activeTab === 'Pending') return o.status === 'Accepted' || o.status === 'Preparing';
    if (activeTab === 'Completed') return o.status === 'Ready for Pickup' || o.status === 'Picked Up' || o.status === 'Completed';
    return true; // Status tab shows all
  });

  const tabs = [
    { id: 'New', label: 'New' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Status', label: 'Status' }
  ] as const;

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)]">
      {/* Tabs */}
      <div className="flex border-b border-emerald-800 mb-4 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === t.id ? 'border-orange-500 text-orange-500' : 'border-transparent text-emerald-400 hover:text-emerald-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-emerald-600">No orders here.</div>
        ) : (
          filteredOrders.map(o => (
            <div key={o.id} className="bg-emerald-900 border border-emerald-800 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-emerald-400 text-xs font-mono mb-1">Order {o.id.slice(-6)}</p>
                  <p className="text-white font-medium text-sm">{o.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{o.amount}</p>
                </div>
              </div>

              {activeTab === 'New' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => updateStatus(o.id, 'Accepted')} className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors">
                    Accept
                  </button>
                  <button onClick={() => setRejectTarget(o)} className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">
                    Reject
                  </button>
                </div>
              )}

              {activeTab === 'Pending' && (
                <div className="mt-4">
                  <button onClick={() => updateStatus(o.id, 'Ready for Pickup')} className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-colors">
                    Ready
                  </button>
                </div>
              )}

              {activeTab === 'Completed' && (
                <div className="mt-4 text-center">
                  <div className={`py-2 rounded-xl text-sm font-bold ${
                    o.status === 'Completed' || o.status === 'Picked Up' ? 'bg-green-500/20 text-green-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {o.status === 'Completed' || o.status === 'Picked Up' ? 'Delivered' : 'Completed (Ready for Pickup)'}
                  </div>
                </div>
              )}

              {activeTab === 'Status' && (
                <div className="mt-4 flex justify-between items-center bg-emerald-800/50 p-3 rounded-xl border border-emerald-800">
                  <span className="text-emerald-300 text-xs">Current Status:</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusBadge[o.status]}`}>{o.status}</span>
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
