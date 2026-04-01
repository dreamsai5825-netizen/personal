import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { foodOrderStore, groceryOrderStore } from '../../lib/vendorOrderStore';
import { XCircle } from 'lucide-react';

const statusOptions = [
  { value: 'pending', label: 'Order Placed' },
  { value: 'accepted', label: 'Order Accepted' },
  { value: 'assigned', label: 'Order Assigned to Delivery Partner' },
  { value: 'delivery_accepted', label: 'Order Accepted by Delivery Partner' },
  { value: 'cancelled_by_partner', label: 'Order Cancelled by Delivery Partner' },
  { value: 'cancelled_by_customer', label: 'Order Cancelled by Customer' },
  { value: 'cancelled_by_vendor', label: 'Order Cancelled by Vendor' },
  { value: 'delivered', label: 'Delivered' },
];

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const allVendorOrders = [...foodOrderStore.getOrders(), ...groceryOrderStore.getOrders()];
  const vendorOrder = orderId
    ? allVendorOrders.find(o => o.id === orderId || o.id === `#${orderId}`)
    : undefined;

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const snap = await getDoc(doc(db, 'orders', orderId!));
      setOrder(snap.exists() ? snap.data() : null);
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  const handleAction = (action: string) => {
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setEvent({ type: 'success', message: `${action} succeeded!` });
      } else {
        setEvent({ type: 'error', message: `${action} failed!` });
      }
      setTimeout(() => setEvent(null), 2000);
    }, 1000);
  };

  if (loading) return <div>Loading...</div>;
  if (!order) return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-gray-500">Order not found in database.</p>
        {vendorOrder && (
          <div className="mt-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
            <p className="text-orange-700 text-sm font-semibold mb-2">Vendor Order Data (from store)</p>
            <p className="text-gray-700 text-sm"><strong>Order ID:</strong> {vendorOrder.id}</p>
            <p className="text-gray-700 text-sm"><strong>Customer:</strong> {vendorOrder.customer}</p>
            <p className="text-gray-700 text-sm"><strong>Status:</strong> {vendorOrder.status}</p>
            {vendorOrder.status === 'Rejected' && vendorOrder.rejectionReason && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-700 text-sm font-semibold">Rejection Reason</p>
                    <p className="text-red-600 text-sm mt-0.5">{vendorOrder.rejectionReason}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const isRejected = order.orderStatus === 'cancelled_by_vendor' || vendorOrder?.status === 'Rejected';
  const rejectionReason = vendorOrder?.rejectionReason;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-orange-600">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DetailCard label="Order ID" value={order.orderId || orderId} />
          <DetailCard label="Customer" value={order.userId} />
          <DetailCard label="Vendor" value={order.vendorId} />
          <DetailCard label="Order Type" value={order.orderType} />
          <DetailCard label="Items" value={order.items?.length || 0} />
          <DetailCard label="Amount" value={`₹${order.totalPrice}`} />
          <DetailCard label="Payment" value={order.paymentStatus} />
          <DetailCard label="Status" value={statusOptions.find(s => s.value === order.orderStatus)?.label || order.orderStatus} />
          <DetailCard label="Delivery Partner" value={order.deliveryPartnerId || 'N/A'} />
          <DetailCard label="Order Time" value={order.createdAt ? order.createdAt.replace('T', ' ').slice(0, 16) : ''} />
        </div>

        {(isRejected && rejectionReason) && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 font-semibold text-sm uppercase tracking-wide mb-1">Order Rejected by Vendor</p>
                <p className="text-red-600 text-sm font-medium">{rejectionReason}</p>
                <p className="text-red-400 text-xs mt-1">This reason has been communicated to the customer who placed this order.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Assign Delivery Partner')}>Assign Delivery Partner</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Update Status')}>Update Status</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Cancel')}>Cancel</button>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => handleAction('Refund')}>Refund</button>
        </div>
      </div>
      {event && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className={`bg-white rounded-xl shadow-xl p-8 flex flex-col items-center gap-4 min-w-[300px] ${event.type === 'success' ? 'border-green-500 border-2' : 'border-red-500 border-2'}`}>
            <div className={`text-4xl ${event.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{event.type === 'success' ? '✔️' : '❌'}</div>
            <div className="text-lg font-bold">{event.message}</div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailCard: React.FC<{ label: string; value: any }> = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 shadow flex flex-col">
    <span className="text-gray-500 text-xs">{label}</span>
    <span className="font-semibold text-lg break-all">{value}</span>
  </div>
);
