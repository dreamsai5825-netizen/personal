import React, { useDeferredValue, useMemo, useState } from 'react';
import { ArrowRight, Search, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { foodOrderStore, groceryOrderStore } from '../../lib/vendorOrderStore';
import { AdminEmptyState, AdminFilters, AdminInput, AdminPageHeader, AdminPanel, AdminSelect, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import { dateMatchesFilter, descendingByDate, formatCurrency, formatDateTime, matchesSearch, numberValue, statusTone, stringValue, useRealtimeCollection } from './adminRealtime';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Order Placed' },
  { value: 'accepted', label: 'Order Accepted' },
  { value: 'assigned', label: 'Assigned to Delivery Partner' },
  { value: 'delivery_accepted', label: 'Accepted by Delivery Partner' },
  { value: 'cancelled_by_partner', label: 'Cancelled by Delivery Partner' },
  { value: 'cancelled_by_customer', label: 'Cancelled by Customer' },
  { value: 'cancelled_by_vendor', label: 'Cancelled by Vendor' },
  { value: 'delivered', label: 'Delivered' },
];

interface AdminOrderRecord {
  id: string;
  orderId: string;
  orderType: string;
  orderStatus: string;
  totalPrice: number;
  customerName: string;
  vendorName: string;
  createdAt: unknown;
}

export const OrderManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const deferredSearch = useDeferredValue(search);
  const navigate = useNavigate();

  const vendorOrders = useMemo(() => [...foodOrderStore.getOrders(), ...groceryOrderStore.getOrders()], []);
  const { items: orders, loading, error } = useRealtimeCollection<AdminOrderRecord>('orders', (raw, id) => ({
    id,
    orderId: stringValue(raw.orderId, id),
    orderType: stringValue(raw.orderType, raw.type, 'general'),
    orderStatus: stringValue(raw.orderStatus, raw.status, 'pending'),
    totalPrice: numberValue(raw.totalPrice, raw.amount, raw.total, raw.grandTotal),
    customerName: stringValue(raw.customerName, raw.customer, raw.userName, raw.userId, 'Customer'),
    vendorName: stringValue(raw.vendorName, raw.storeName, raw.vendorId, 'Vendor'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));

  const getRejectionReason = (orderId: string): string => {
    const vendorOrder = vendorOrders.find((order) => order.id === orderId || order.id === `#${orderId}`);
    return vendorOrder?.status === 'Rejected' ? vendorOrder.rejectionReason ?? '' : '';
  };

  const filteredOrders = useMemo(
    () =>
      descendingByDate(
        orders
        .filter((order) =>
          matchesSearch(
            deferredSearch,
            order.orderId,
            order.customerName,
            order.vendorName,
            order.orderType,
            order.id,
          ),
        )
        .filter((order) => (status ? order.orderStatus === status : true))
        .filter((order) => dateMatchesFilter(order.createdAt, date)),
        (order) => order.createdAt,
      ),
    [date, deferredSearch, orders, status],
  );

  const stats = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => order.orderStatus === 'pending').length,
      activeDelivery: orders.filter((order) => ['assigned', 'delivery_accepted'].includes(order.orderStatus)).length,
      delivered: orders.filter((order) => order.orderStatus === 'delivered').length,
      cancelled: orders.filter((order) => order.orderStatus.includes('cancelled')).length,
    }),
    [orders],
  );

  const rejectedVendorOrders = vendorOrders.filter((order) => order.status === 'Rejected' && order.rejectionReason);

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Realtime Orders Desk"
        title="Order Management"
        description="Live food and grocery order activity with mobile-friendly review cards, vendor rejection visibility, and status-based queue monitoring."
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Subscribing to live orders..." /> : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <AdminStatCard label="Total Orders" value={stats.total.toString()} meta="All synced Firestore orders" accent="orange" />
          <AdminStatCard label="Pending" value={stats.pending.toString()} meta="Placed and waiting for action" accent="amber" />
          <AdminStatCard label="Active Delivery" value={stats.activeDelivery.toString()} meta="Assigned or delivery accepted" accent="blue" />
          <AdminStatCard label="Delivered" value={stats.delivered.toString()} meta="Completed successfully" accent="emerald" />
          <AdminStatCard label="Cancelled" value={stats.cancelled.toString()} meta="Customer, vendor, or partner cancellations" accent="rose" />
        </div>

        {rejectedVendorOrders.length > 0 ? (
          <AdminPanel title="Vendor-Rejected Orders" subtitle="Local vendor store reasons surfaced alongside Firestore order data">
            <div className="space-y-3">
              {rejectedVendorOrders.map((order) => (
                <div key={order.id} className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{order.id}</p>
                    <p className="mt-1 text-sm text-slate-300">{order.customer} - {order.amount}</p>
                    <p className="mt-2 text-sm text-rose-100">Reason: {order.rejectionReason}</p>
                  </div>
                </div>
              ))}
            </div>
          </AdminPanel>
        ) : null}

        <AdminFilters>
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <AdminInput
              className="pl-11"
              placeholder="Search by order ID, customer, vendor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <AdminSelect value={status} onChange={(event) => setStatus(event.target.value)} className="sm:w-[220px]">
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </AdminSelect>
          <AdminInput type="date" value={date} onChange={(event) => setDate(event.target.value)} className="sm:w-[180px]" />
        </AdminFilters>

        {error ? (
          <AdminEmptyState
            title="Orders could not be loaded"
            description="The realtime orders subscription failed. Verify the Firestore connection and order collection permissions."
          />
        ) : filteredOrders.length === 0 && !loading ? (
          <AdminEmptyState
            title="No orders match the current filters"
            description="Try clearing the search text or choosing a broader status/date range."
          />
        ) : (
          <AdminPanel title="Live Orders Queue" subtitle="Desktop table plus touch-friendly cards for phone view">
            <div className="space-y-3 lg:hidden">
              {filteredOrders.map((order) => {
                const rejectionReason = getRejectionReason(order.orderId);
                return (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className={`w-full rounded-3xl border p-4 text-left transition hover:border-orange-400/40 ${rejectionReason ? 'border-rose-400/30 bg-rose-500/10' : 'border-slate-800 bg-slate-950/80'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{order.orderId}</p>
                        <p className="mt-1 text-sm text-slate-400">{order.customerName} - {order.vendorName}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(order.orderStatus)}`}>
                        {statusOptions.find((option) => option.value === order.orderStatus)?.label ?? order.orderStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Type</p>
                        <p className="mt-1 capitalize text-white">{order.orderType}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Amount</p>
                        <p className="mt-1 text-white">{formatCurrency(order.totalPrice)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Created</p>
                        <p className="mt-1 text-white">{formatDateTime(order.createdAt)}</p>
                      </div>
                      {rejectionReason ? (
                        <div className="col-span-2 rounded-2xl bg-rose-500/10 p-3 text-rose-100">
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-200/80">Rejection reason</p>
                          <p className="mt-1 text-sm">{rejectionReason}</p>
                        </div>
                      ) : null}
                    </div>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>

            <AdminTableWrapper>
              <table className="min-w-full overflow-hidden rounded-3xl">
                <AdminTableHead>
                  <tr>
                    <th className="px-4 py-4">Order</th>
                    <th className="px-4 py-4">Customer / Vendor</th>
                    <th className="px-4 py-4">Type</th>
                    <th className="px-4 py-4">Amount</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Rejection Reason</th>
                    <th className="px-4 py-4">Created</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </AdminTableHead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                  {filteredOrders.map((order) => {
                    const rejectionReason = getRejectionReason(order.orderId);
                    return (
                      <tr key={order.id} className="transition hover:bg-slate-900/80">
                        <td className="px-4 py-4 font-semibold text-white">{order.orderId}</td>
                        <td className="px-4 py-4 text-sm text-slate-300">
                          <p>{order.customerName}</p>
                          <p className="mt-1 text-slate-500">{order.vendorName}</p>
                        </td>
                        <td className="px-4 py-4 text-sm capitalize text-slate-200">{order.orderType}</td>
                        <td className="px-4 py-4 text-sm text-slate-200">{formatCurrency(order.totalPrice)}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(order.orderStatus)}`}>
                            {statusOptions.find((option) => option.value === order.orderStatus)?.label ?? order.orderStatus.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-300">{rejectionReason || '-'}</td>
                        <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(order.createdAt)}</td>
                        <td className="px-4 py-4">
                          <button
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-400"
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                          >
                            View
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </AdminTableWrapper>
          </AdminPanel>
        )}
      </div>
    </div>
  );
};
