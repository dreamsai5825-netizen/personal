import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { foodOrderStore, groceryOrderStore } from '../../lib/vendorOrderStore';
import { XCircle } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Order Placed' },
  { value: 'accepted', label: 'Order Accepted' },
  { value: 'assigned', label: 'Order Assigned to Delivery Partner' },
  { value: 'delivery_accepted', label: 'Order Accepted by Delivery Partner' },
  { value: 'cancelled_by_partner', label: 'Order Cancelled by Delivery Partner' },
  { value: 'cancelled_by_customer', label: 'Order Cancelled by Customer' },
  { value: 'cancelled_by_vendor', label: 'Order Cancelled by Vendor' },
  { value: 'delivered', label: 'Delivered' },
];

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const vendorOrders = [...foodOrderStore.getOrders(), ...groceryOrderStore.getOrders()];

  const getRejectionReason = (orderId: string): string | undefined => {
    const vo = vendorOrders.find(o => o.id === orderId || o.id === `#${orderId}`);
    return vo?.status === 'Rejected' ? vo.rejectionReason : undefined;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      let q = collection(db, 'orders');
      let allOrders = (await getDocs(q)).docs.map((doc, idx) => ({ ...doc.data(), id: doc.id, serial: idx + 1 }));
      if (search) allOrders = allOrders.filter(o => (o.orderId || o.id).toLowerCase().includes(search.toLowerCase()));
      if (status) allOrders = allOrders.filter(o => o.orderStatus === status);
      if (date) allOrders = allOrders.filter(o => o.createdAt && o.createdAt.startsWith(date));
      setOrders(allOrders);
      setLoading(false);
    };
    fetchOrders();
  }, [search, status, date]);

  const rejectedVendorOrders = [...foodOrderStore.getOrders(), ...groceryOrderStore.getOrders()].filter(o => o.status === 'Rejected' && o.rejectionReason);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      {rejectedVendorOrders.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-semibold text-sm">Vendor-Rejected Orders with Reasons</p>
          </div>
          <div className="space-y-2">
            {rejectedVendorOrders.map(o => (
              <div key={o.id} className="flex items-start gap-3 p-3 bg-white border border-red-100 rounded-lg">
                <span className="text-red-600 font-mono font-semibold text-sm flex-shrink-0">{o.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-700 text-sm"><strong>{o.customer}</strong> · {o.amount}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-red-500 text-xs font-medium">Rejection reason:</span>
                    <span className="text-red-600 text-xs">{o.rejectionReason}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4 mb-6 items-end bg-gray-50 p-4 rounded-xl shadow-sm">
        <input
          className="border rounded px-3 py-2 w-48"
          placeholder="Search Order Number"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
          {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Order Type</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Rejection Reason</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const reason = getRejectionReason(order.orderId || order.id);
                return (
                  <tr key={order.id} className={`hover:bg-orange-50 cursor-pointer ${reason ? 'bg-red-50' : ''}`}>
                    <td className="border px-4 py-2">{order.orderId || order.id}</td>
                    <td className="border px-4 py-2 capitalize">{order.orderType}</td>
                    <td className="border px-4 py-2 capitalize">{statusOptions.find(s => s.value === order.orderStatus)?.label || order.orderStatus}</td>
                    <td className="border px-4 py-2">
                      {reason ? (
                        <div className="flex items-start gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          <span className="text-red-600 text-xs">{reason}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="border px-4 py-2 flex gap-2">
                      <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs" onClick={() => navigate(`/admin/orders/${order.id}`)}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
