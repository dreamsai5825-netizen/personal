import React, { useMemo } from 'react';
import { ArrowRight, BriefcaseBusiness, ClipboardList, PackageSearch, Truck, UserRound, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminEmptyState, AdminPageHeader, AdminPanel, AdminStatCard, AdminTableHead, AdminTableWrapper, LoadingPulse, pageShellClassName } from './adminUi';
import {
  descendingByDate,
  formatCurrency,
  formatDateTime,
  numberValue,
  sameDay,
  startsInPastDays,
  statusTone,
  stringValue,
  useLastSevenDays,
  useRealtimeCollection,
} from './adminRealtime';

interface OverviewOrder {
  id: string;
  orderId: string;
  customerName: string;
  vendorName: string;
  amount: number;
  status: string;
  createdAt: unknown;
}

interface OverviewRide {
  id: string;
  rideId: string;
  customerName: string;
  driverName: string;
  fare: number;
  status: string;
  createdAt: unknown;
}

interface OverviewVendor {
  id: string;
  name: string;
  type: string;
  status: string;
  createdAt: unknown;
}

interface OverviewServiceBooking {
  id: string;
  bookingId: string;
  serviceType: string;
  customerName: string;
  status: string;
  createdAt: unknown;
}

interface OverviewPartner {
  id: string;
  name: string;
  status: string;
  createdAt: unknown;
}

export const Overview: React.FC = () => {
  const navigate = useNavigate();

  const { items: orders, loading: loadingOrders, error: ordersError } = useRealtimeCollection<OverviewOrder>('orders', (raw, id) => ({
    id,
    orderId: stringValue(raw.orderId, id),
    customerName: stringValue(raw.customerName, raw.customer, raw.userName, raw.userId, 'Customer'),
    vendorName: stringValue(raw.vendorName, raw.storeName, raw.vendorId, 'Vendor'),
    amount: numberValue(raw.totalPrice, raw.amount, raw.total, raw.grandTotal),
    status: stringValue(raw.orderStatus, raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));
  const { items: rides, loading: loadingRides } = useRealtimeCollection<OverviewRide>('rides', (raw, id) => ({
    id,
    rideId: stringValue(raw.rideId, id),
    customerName: stringValue(raw.customerName, raw.userName, raw.userId, 'Rider'),
    driverName: stringValue(raw.driverName, raw.driverId, 'Driver pending'),
    fare: numberValue(raw.fare, raw.amount, raw.totalFare),
    status: stringValue(raw.status, 'requested'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));
  const { items: vendors, loading: loadingVendors } = useRealtimeCollection<OverviewVendor>('vendors', (raw, id) => ({
    id,
    name: stringValue(raw.businessName, raw.storeName, raw.name, raw.ownerName, 'Vendor'),
    type: stringValue(raw.vendorType, raw.type, raw.category, 'general'),
    status: stringValue(raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));
  const { items: serviceBookings, loading: loadingBookings } = useRealtimeCollection<OverviewServiceBooking>('serviceBookings', (raw, id) => ({
    id,
    bookingId: stringValue(raw.bookingId, id),
    serviceType: stringValue(raw.serviceType, raw.category, 'Service'),
    customerName: stringValue(raw.customerName, raw.userName, raw.userId, 'Customer'),
    status: stringValue(raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.scheduledDate ?? raw.updatedAt ?? null,
  }));
  const { items: deliveryPartners, loading: loadingPartners } = useRealtimeCollection<OverviewPartner>('deliveryPartners', (raw, id) => ({
    id,
    name: stringValue(raw.name, raw.fullName, raw.partnerName, 'Delivery partner'),
    status: stringValue(raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));
  const { items: drivers, loading: loadingDrivers } = useRealtimeCollection<OverviewPartner>('drivers', (raw, id) => ({
    id,
    name: stringValue(raw.name, raw.fullName, raw.driverName, 'Driver'),
    status: stringValue(raw.status, 'pending'),
    createdAt: raw.createdAt ?? raw.updatedAt ?? null,
  }));

  const loading = loadingOrders || loadingRides || loadingVendors || loadingBookings || loadingPartners || loadingDrivers;

  const stats = useMemo(() => {
    const today = new Date();
    return {
      totalOrders: orders.length,
      liveRides: rides.filter((ride) => ['requested', 'accepted', 'driver_arriving', 'on_trip'].includes(ride.status.toLowerCase())).length,
      activeVendors: vendors.filter((vendor) => vendor.status.toLowerCase() === 'active').length,
      activeDrivers: drivers.filter((driver) => driver.status.toLowerCase() === 'active').length,
      activeDeliveryPartners: deliveryPartners.filter((partner) => partner.status.toLowerCase() === 'active').length,
      pendingServiceBookings: serviceBookings.filter((booking) => booking.status.toLowerCase() === 'pending').length,
      revenueToday: orders.filter((order) => sameDay(order.createdAt, today)).reduce((sum, order) => sum + order.amount, 0),
      ordersLastSevenDays: orders.filter((order) => startsInPastDays(order.createdAt, 7)).length,
    };
  }, [deliveryPartners, drivers, orders, rides, serviceBookings, vendors]);

  const recentActivity = useMemo(() => {
    const activity = [
      ...orders.map((order) => ({
        id: `order-${order.id}`,
        title: order.orderId,
        subtitle: `${order.customerName} with ${order.vendorName}`,
        amountLabel: formatCurrency(order.amount),
        status: order.status,
        createdAt: order.createdAt,
        route: `/admin/orders/${order.id}`,
      })),
      ...rides.map((ride) => ({
        id: `ride-${ride.id}`,
        title: ride.rideId,
        subtitle: `${ride.customerName} · ${ride.driverName}`,
        amountLabel: ride.fare ? formatCurrency(ride.fare) : 'Fare pending',
        status: ride.status,
        createdAt: ride.createdAt,
        route: `/admin/rides/${ride.id}`,
      })),
      ...serviceBookings.map((booking) => ({
        id: `service-${booking.id}`,
        title: booking.bookingId,
        subtitle: `${booking.serviceType} · ${booking.customerName}`,
        amountLabel: 'Service booking',
        status: booking.status,
        createdAt: booking.createdAt,
        route: `/admin/service-bookings/${booking.id}`,
      })),
    ];

    return descendingByDate(activity, (item) => item.createdAt).slice(0, 6);
  }, [orders, rides, serviceBookings]);

  const orderSeries = useLastSevenDays(orders, (order) => order.createdAt);
  const maxSeriesValue = Math.max(...orderSeries.map((day) => day.value), 1);

  return (
    <div className={pageShellClassName}>
      <AdminPageHeader
        eyebrow="Realtime Command Center"
        title="Operations Overview"
        description="Live snapshots from orders, rides, vendor supply, bookings, and logistics so the operations team can react without refreshing."
        action={
          <button
            type="button"
            onClick={() => navigate('/admin/orders')}
            className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(249,115,22,0.35)] transition hover:bg-orange-400"
          >
            Review live orders
            <ArrowRight className="h-4 w-4" />
          </button>
        }
      />

      <div className="space-y-6 p-4 sm:p-6">
        {loading ? <LoadingPulse label="Syncing overview metrics from Firestore..." /> : null}
        {ordersError ? (
          <AdminEmptyState
            title="Overview data could not be loaded"
            description="The live connection to one or more overview collections failed. Check Firestore rules, collection names, and network access."
          />
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <button type="button" onClick={() => navigate('/admin/orders')} className="text-left">
            <AdminStatCard label="Total Orders" value={stats.totalOrders.toString()} meta={`${stats.ordersLastSevenDays} created in the last 7 days`} accent="orange" />
          </button>
          <button type="button" onClick={() => navigate('/admin/rides')} className="text-left">
            <AdminStatCard label="Live Rides" value={stats.liveRides.toString()} meta="Requested, accepted, arriving, or on trip" accent="blue" />
          </button>
          <button type="button" onClick={() => navigate('/admin/vendors')} className="text-left">
            <AdminStatCard label="Active Vendors" value={stats.activeVendors.toString()} meta={`${vendors.length} vendors synced with admin view`} accent="violet" />
          </button>
          <button type="button" onClick={() => navigate('/admin/drivers')} className="text-left">
            <AdminStatCard label="Active Drivers" value={stats.activeDrivers.toString()} meta={`${drivers.length} drivers in the live roster`} accent="emerald" />
          </button>
          <button type="button" onClick={() => navigate('/admin/delivery-partners')} className="text-left">
            <AdminStatCard label="Delivery Partners" value={stats.activeDeliveryPartners.toString()} meta={`${deliveryPartners.length} delivery profiles available`} accent="amber" />
          </button>
          <button type="button" onClick={() => navigate('/admin/service-bookings')} className="text-left">
            <AdminStatCard label="Pending Services" value={stats.pendingServiceBookings.toString()} meta={`Revenue today ${formatCurrency(stats.revenueToday)}`} accent="rose" />
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <AdminPanel title="Orders in the Last 7 Days" subtitle="Realtime order creation trend from Firestore">
            <div className="grid grid-cols-7 gap-2 sm:gap-3">
              {orderSeries.map((day) => (
                <div key={day.key} className="flex flex-col items-center gap-3">
                  <div className="flex h-40 w-full items-end rounded-2xl bg-slate-950/80 p-2">
                    <div
                      className="w-full rounded-xl bg-gradient-to-t from-orange-500 to-orange-300 transition-all"
                      style={{ height: `${Math.max((day.value / maxSeriesValue) * 100, day.value > 0 ? 14 : 6)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-white">{day.value}</p>
                    <p className="text-xs text-slate-400">{day.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Realtime Supply Mix" subtitle="What the operations floor needs to watch right now">
            <div className="space-y-4">
              {[
                { icon: PackageSearch, label: 'Orders', value: orders.length, meta: `${orders.filter((order) => order.status.toLowerCase() === 'pending').length} pending` },
                { icon: Waves, label: 'Rides', value: rides.length, meta: `${rides.filter((ride) => ride.status.toLowerCase() === 'on_trip').length} currently on trip` },
                { icon: BriefcaseBusiness, label: 'Vendors', value: vendors.length, meta: `${vendors.filter((vendor) => vendor.type.toLowerCase().includes('food')).length} food-linked` },
                { icon: ClipboardList, label: 'Service bookings', value: serviceBookings.length, meta: `${serviceBookings.filter((booking) => booking.status.toLowerCase() === 'assigned').length} assigned` },
                { icon: Truck, label: 'Delivery partners', value: deliveryPartners.length, meta: `${deliveryPartners.filter((partner) => partner.status.toLowerCase() === 'pending').length} awaiting activation` },
                { icon: UserRound, label: 'Drivers', value: drivers.length, meta: `${drivers.filter((driver) => driver.status.toLowerCase() === 'pending').length} in onboarding` },
              ].map(({ icon: Icon, label, value, meta }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-200 ring-1 ring-orange-400/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-white">{label}</p>
                      <p className="text-lg font-bold text-white">{value}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>

        <AdminPanel title="Recent Cross-Platform Activity" subtitle="Latest orders, rides, and service requests hitting the admin desk">
          {recentActivity.length === 0 && !loading ? (
            <AdminEmptyState
              title="No realtime activity yet"
              description="As orders, rides, and service bookings appear in Firestore they will be listed here automatically."
            />
          ) : (
            <>
              <div className="space-y-3 lg:hidden">
                {recentActivity.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.route)}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 p-4 text-left transition hover:border-orange-400/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(item.status)}`}>{item.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="text-slate-300">{item.amountLabel}</span>
                      <span className="text-slate-500">{formatDateTime(item.createdAt)}</span>
                    </div>
                  </button>
                ))}
              </div>

              <AdminTableWrapper>
                <table className="min-w-full overflow-hidden rounded-3xl">
                  <AdminTableHead>
                    <tr>
                      <th className="px-4 py-4">Reference</th>
                      <th className="px-4 py-4">Summary</th>
                      <th className="px-4 py-4">Value</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Time</th>
                    </tr>
                  </AdminTableHead>
                  <tbody className="divide-y divide-slate-800 bg-slate-950/40">
                    {recentActivity.map((item) => (
                      <tr key={item.id} onClick={() => navigate(item.route)} className="cursor-pointer transition hover:bg-slate-900/80">
                        <td className="px-4 py-4 font-semibold text-white">{item.title}</td>
                        <td className="px-4 py-4 text-sm text-slate-300">{item.subtitle}</td>
                        <td className="px-4 py-4 text-sm text-slate-200">{item.amountLabel}</td>
                        <td className="px-4 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusTone(item.status)}`}>{item.status.replace(/_/g, ' ')}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-400">{formatDateTime(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AdminTableWrapper>
            </>
          )}
        </AdminPanel>
      </div>
    </div>
  );
};
