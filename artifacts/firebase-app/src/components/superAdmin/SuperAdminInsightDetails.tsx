import React, { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bike, Car, DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import {
  FirestoreRecord,
  adminRoleLabel,
  asDate,
  countBy,
  getNumeric,
  getRecordEmail,
  getRecordName,
  getRecordPhone,
  isSameDay,
  normalizeRoleKey,
  roleLabel,
  startOfDay,
  statusLabel,
  useSuperAdminLiveData,
} from './superAdminLiveData';

type InsightSection =
  | 'users'
  | 'vendors'
  | 'orders'
  | 'rides'
  | 'revenue'
  | 'drivers'
  | 'delivery-partners'
  | 'revenue-today';

interface SummaryCard {
  label: string;
  value: string;
  tone?: string;
}

interface TableRow {
  id: string;
  name: string;
  meta: string;
  status: string;
  extra: string;
}

const SECTIONS: InsightSection[] = [
  'users',
  'vendors',
  'orders',
  'rides',
  'revenue',
  'drivers',
  'delivery-partners',
  'revenue-today',
];

const sectionMeta: Record<InsightSection, { title: string; description: string; icon: React.FC<{ className?: string }> }> = {
  users: {
    title: 'Total Users',
    description: 'Live breakdown of platform users and admin role distribution.',
    icon: Users,
  },
  vendors: {
    title: 'Total Vendors',
    description: 'Live vendor type, activity, and registry details from Firestore.',
    icon: Package,
  },
  orders: {
    title: 'Total Orders',
    description: 'Live order status breakdown with current Firestore records.',
    icon: ShoppingBag,
  },
  rides: {
    title: 'Total Rides',
    description: 'Live ride status and vehicle distribution from Firestore.',
    icon: Car,
  },
  revenue: {
    title: 'Total Revenue',
    description: 'Combined live revenue from orders and rides.',
    icon: DollarSign,
  },
  drivers: {
    title: 'Active Drivers',
    description: 'Current driver activity and availability from users and drivers collections.',
    icon: Car,
  },
  'delivery-partners': {
    title: 'Delivery Partners',
    description: 'Live delivery-partner counts and account status.',
    icon: Bike,
  },
  'revenue-today': {
    title: 'Revenue Today',
    description: 'Today-only live revenue across orders and rides.',
    icon: TrendingUp,
  },
};

const formatRupees = (value: number) => `Rs ${Math.round(value).toLocaleString('en-IN')}`;

const summaryCardClass = 'bg-gray-900 border border-gray-800 rounded-xl p-4';
const tableCellClass = 'px-5 py-3 text-sm';

const getRoleCounts = (records: FirestoreRecord[]) => countBy(records.map((record) => roleLabel(record.role)));
const getAdminRoleCounts = (records: FirestoreRecord[]) => countBy(records.map((record) => adminRoleLabel(record.role)));

const makeRows = (records: FirestoreRecord[], mapper: (record: FirestoreRecord) => TableRow) => records.map(mapper);

export const SuperAdminInsightDetails: React.FC = () => {
  const { section } = useParams<{ section: InsightSection }>();
  const snapshots = useSuperAdminLiveData();

  if (!section || !SECTIONS.includes(section)) {
    return <Navigate to="/admin/super" replace />;
  }

  const today = startOfDay(new Date());

  const view = useMemo(() => {
    switch (section) {
      case 'users': {
        const userRoleCounts = getRoleCounts(snapshots.users);
        const adminRoleCounts = getAdminRoleCounts(snapshots.admins);
        const summaryCards: SummaryCard[] = [
          { label: 'Users Collection', value: snapshots.users.length.toLocaleString('en-IN'), tone: 'text-blue-400' },
          { label: 'Admins Registry', value: snapshots.admins.length.toLocaleString('en-IN'), tone: 'text-orange-400' },
          { label: 'Customers', value: (userRoleCounts.Customers ?? 0).toLocaleString('en-IN'), tone: 'text-emerald-400' },
          { label: 'Drivers', value: (userRoleCounts.Drivers ?? 0).toLocaleString('en-IN'), tone: 'text-yellow-400' },
        ];

        const roleCards = [
          ...Object.entries(userRoleCounts).map(([label, count]) => ({ label, count })),
          ...Object.entries(adminRoleCounts).map(([label, count]) => ({ label: `${label} (Admin Registry)`, count })),
        ].sort((left, right) => right.count - left.count);

        const rows = makeRows(snapshots.users, (record) => ({
          id: record.id,
          name: getRecordName(record),
          meta: getRecordEmail(record),
          status: statusLabel(record.status),
          extra: roleLabel(record.role),
        }));

        return {
          summaryCards,
          roleCards,
          rows,
          columns: ['User', 'Email', 'Status', 'Role'],
        };
      }
      case 'vendors': {
        const typeCounts = countBy(
          snapshots.vendors.map((vendor) => String(vendor.vendorType ?? 'unknown').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()))
        );
        const foodVendors = (typeCounts.Restaurant ?? 0) + (typeCounts['Food Store Vendor'] ?? 0) + (typeCounts.Vendor ?? 0);
        const groceryVendors = (typeCounts.Grocery ?? 0) + (typeCounts['Grocery Store Vendor'] ?? 0);
        const activeCount = snapshots.vendors.filter((vendor) => Boolean(vendor.isActive)).length;
        const rows = makeRows(snapshots.vendors, (record) => ({
          id: record.id,
          name: getRecordName(record),
          meta: getRecordEmail(record),
          status: Boolean(record.isActive) ? 'Active' : 'Inactive',
          extra: String(record.vendorType ?? 'Unknown').replace(/_/g, ' '),
        }));

        return {
          summaryCards: [
            { label: 'Total Vendors', value: snapshots.vendors.length.toLocaleString('en-IN'), tone: 'text-purple-400' },
            { label: 'Active Vendors', value: activeCount.toLocaleString('en-IN'), tone: 'text-green-400' },
            { label: 'Food Vendors', value: foodVendors.toLocaleString('en-IN'), tone: 'text-orange-400' },
            { label: 'Grocery Vendors', value: groceryVendors.toLocaleString('en-IN'), tone: 'text-cyan-400' },
          ],
          roleCards: Object.entries(typeCounts).map(([label, count]) => ({ label, count })).sort((left, right) => right.count - left.count),
          rows,
          columns: ['Vendor', 'Email', 'Status', 'Type'],
        };
      }
      case 'orders': {
        const statusCounts = countBy(snapshots.orders.map((order) => statusLabel(order.orderStatus ?? order.status)));
        const rows = makeRows(snapshots.orders, (record) => ({
          id: record.id,
          name: String(record.orderId ?? record.id),
          meta: String(record.vendorId ?? 'No vendor'),
          status: statusLabel(record.orderStatus ?? record.status),
          extra: formatRupees(getNumeric(record.totalPrice) + getNumeric(record.deliveryFee)),
        }));

        return {
          summaryCards: [
            { label: 'Total Orders', value: snapshots.orders.length.toLocaleString('en-IN'), tone: 'text-orange-400' },
            { label: 'Delivered', value: ((statusCounts.Delivered ?? 0) + (statusCounts.Completed ?? 0)).toLocaleString('en-IN'), tone: 'text-green-400' },
            { label: 'Pending', value: ((statusCounts.Pending ?? 0) + (statusCounts.Accepted ?? 0) + (statusCounts.Preparing ?? 0)).toLocaleString('en-IN'), tone: 'text-yellow-400' },
            { label: 'Cancelled', value: (statusCounts.Cancelled ?? 0).toLocaleString('en-IN'), tone: 'text-red-400' },
          ],
          roleCards: Object.entries(statusCounts).map(([label, count]) => ({ label, count })).sort((left, right) => right.count - left.count),
          rows,
          columns: ['Order', 'Vendor', 'Status', 'Amount'],
        };
      }
      case 'rides': {
        const statusCounts = countBy(snapshots.rides.map((ride) => statusLabel(ride.status)));
        const vehicleCounts = countBy(
          snapshots.rides.map((ride) => String(ride.vehicleType ?? 'unknown').replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()))
        );
        const rows = makeRows(snapshots.rides, (record) => ({
          id: record.id,
          name: String(record.rideId ?? record.id),
          meta: String(record.driverId ?? 'Unassigned'),
          status: statusLabel(record.status),
          extra: `${String(record.vehicleType ?? 'Unknown')} | ${formatRupees(getNumeric(record.fare))}`,
        }));

        return {
          summaryCards: [
            { label: 'Total Rides', value: snapshots.rides.length.toLocaleString('en-IN'), tone: 'text-cyan-400' },
            { label: 'Completed', value: (statusCounts.Completed ?? 0).toLocaleString('en-IN'), tone: 'text-green-400' },
            { label: 'On Trip', value: (statusCounts['On Trip'] ?? 0).toLocaleString('en-IN'), tone: 'text-yellow-400' },
            { label: 'Cancelled', value: (statusCounts.Cancelled ?? 0).toLocaleString('en-IN'), tone: 'text-red-400' },
          ],
          roleCards: [
            ...Object.entries(statusCounts).map(([label, count]) => ({ label, count })),
            ...Object.entries(vehicleCounts).map(([label, count]) => ({ label: `${label} Vehicles`, count })),
          ].sort((left, right) => right.count - left.count),
          rows,
          columns: ['Ride', 'Driver', 'Status', 'Vehicle / Fare'],
        };
      }
      case 'revenue': {
        const orderRevenue = snapshots.orders.reduce((sum, order) => sum + getNumeric(order.totalPrice) + getNumeric(order.deliveryFee), 0);
        const rideRevenue = snapshots.rides.reduce((sum, ride) => sum + getNumeric(ride.fare), 0);
        const deliveredOrders = snapshots.orders.filter((order) => ['delivered', 'completed'].includes(normalizeRoleKey(order.orderStatus ?? order.status)));
        const completedRides = snapshots.rides.filter((ride) => normalizeRoleKey(ride.status) === 'completed');
        const rows: TableRow[] = [
          {
            id: 'orders',
            name: 'Order Revenue',
            meta: `${snapshots.orders.length.toLocaleString('en-IN')} orders`,
            status: formatRupees(orderRevenue),
            extra: `${deliveredOrders.length.toLocaleString('en-IN')} fulfilled`,
          },
          {
            id: 'rides',
            name: 'Ride Revenue',
            meta: `${snapshots.rides.length.toLocaleString('en-IN')} rides`,
            status: formatRupees(rideRevenue),
            extra: `${completedRides.length.toLocaleString('en-IN')} completed`,
          },
        ];

        return {
          summaryCards: [
            { label: 'Total Revenue', value: formatRupees(orderRevenue + rideRevenue), tone: 'text-green-400' },
            { label: 'Order Revenue', value: formatRupees(orderRevenue), tone: 'text-orange-400' },
            { label: 'Ride Revenue', value: formatRupees(rideRevenue), tone: 'text-cyan-400' },
            { label: 'Revenue Streams', value: '2', tone: 'text-purple-400' },
          ],
          roleCards: [
            { label: 'Orders', count: Math.round(orderRevenue) },
            { label: 'Rides', count: Math.round(rideRevenue) },
          ],
          rows,
          columns: ['Stream', 'Records', 'Revenue', 'Delivery'],
        };
      }
      case 'drivers': {
        const activeFromDrivers = snapshots.drivers.filter((driver) => normalizeRoleKey(driver.status) === 'active').length;
        const availableFromUsers = snapshots.users.filter((user) => normalizeRoleKey(user.role) === 'driver' && Boolean((user.driverProfile as { isAvailable?: boolean } | undefined)?.isAvailable)).length;
        const totalDrivers = snapshots.users.filter((user) => normalizeRoleKey(user.role) === 'driver').length;
        const rows = makeRows(
          snapshots.users.filter((user) => normalizeRoleKey(user.role) === 'driver'),
          (record) => ({
            id: record.id,
            name: getRecordName(record),
            meta: getRecordPhone(record),
            status: Boolean((record.driverProfile as { isAvailable?: boolean } | undefined)?.isAvailable) ? 'Available' : 'Offline',
            extra: String((record.driverProfile as { vehicleType?: string } | undefined)?.vehicleType ?? 'Unknown vehicle'),
          }),
        );

        return {
          summaryCards: [
            { label: 'Driver Users', value: totalDrivers.toLocaleString('en-IN'), tone: 'text-yellow-400' },
            { label: 'Available Now', value: availableFromUsers.toLocaleString('en-IN'), tone: 'text-green-400' },
            { label: 'Drivers Collection Active', value: activeFromDrivers.toLocaleString('en-IN'), tone: 'text-blue-400' },
            { label: 'Offline', value: Math.max(totalDrivers - availableFromUsers, 0).toLocaleString('en-IN'), tone: 'text-slate-400' },
          ],
          roleCards: [
            { label: 'Available', count: availableFromUsers },
            { label: 'Offline', count: Math.max(totalDrivers - availableFromUsers, 0) },
          ],
          rows,
          columns: ['Driver', 'Phone', 'Availability', 'Vehicle'],
        };
      }
      case 'delivery-partners': {
        const userPartners = snapshots.users.filter((user) => normalizeRoleKey(user.role) === 'delivery_partner');
        const activePartners = snapshots.deliveryPartners.filter((partner) => normalizeRoleKey(partner.status) === 'active').length;
        const statusCounts = countBy(snapshots.deliveryPartners.map((partner) => statusLabel(partner.status)));
        const rows = makeRows(
          userPartners.length > 0 ? userPartners : snapshots.deliveryPartners,
          (record) => ({
            id: record.id,
            name: getRecordName(record),
            meta: getRecordPhone(record),
            status: statusLabel(record.status ?? (userPartners.length > 0 ? 'active' : 'unknown')),
            extra: getRecordEmail(record),
          }),
        );

        return {
          summaryCards: [
            { label: 'Partner Users', value: userPartners.length.toLocaleString('en-IN'), tone: 'text-pink-400' },
            { label: 'Registry Records', value: snapshots.deliveryPartners.length.toLocaleString('en-IN'), tone: 'text-blue-400' },
            { label: 'Active Registry', value: activePartners.toLocaleString('en-IN'), tone: 'text-green-400' },
            { label: 'Other Status', value: Math.max(snapshots.deliveryPartners.length - activePartners, 0).toLocaleString('en-IN'), tone: 'text-slate-400' },
          ],
          roleCards: Object.entries(statusCounts).map(([label, count]) => ({ label, count })).sort((left, right) => right.count - left.count),
          rows,
          columns: ['Partner', 'Phone', 'Status', 'Email'],
        };
      }
      case 'revenue-today': {
        const todayOrders = snapshots.orders.filter((order) => {
          const createdAt = asDate(order.createdAt);
          return createdAt ? isSameDay(createdAt, today) : false;
        });
        const todayRides = snapshots.rides.filter((ride) => {
          const createdAt = asDate(ride.createdAt);
          return createdAt ? isSameDay(createdAt, today) : false;
        });
        const orderRevenue = todayOrders.reduce((sum, order) => sum + getNumeric(order.totalPrice) + getNumeric(order.deliveryFee), 0);
        const rideRevenue = todayRides.reduce((sum, ride) => sum + getNumeric(ride.fare), 0);
        const rows: TableRow[] = [
          {
            id: 'today-orders',
            name: 'Today Orders',
            meta: `${todayOrders.length.toLocaleString('en-IN')} records`,
            status: formatRupees(orderRevenue),
            extra: 'Order stream',
          },
          {
            id: 'today-rides',
            name: 'Today Rides',
            meta: `${todayRides.length.toLocaleString('en-IN')} records`,
            status: formatRupees(rideRevenue),
            extra: 'Ride stream',
          },
        ];

        return {
          summaryCards: [
            { label: 'Revenue Today', value: formatRupees(orderRevenue + rideRevenue), tone: 'text-emerald-400' },
            { label: 'Orders Today', value: todayOrders.length.toLocaleString('en-IN'), tone: 'text-orange-400' },
            { label: 'Rides Today', value: todayRides.length.toLocaleString('en-IN'), tone: 'text-cyan-400' },
            { label: 'Order Revenue Today', value: formatRupees(orderRevenue), tone: 'text-green-400' },
          ],
          roleCards: [
            { label: 'Orders Revenue', count: Math.round(orderRevenue) },
            { label: 'Rides Revenue', count: Math.round(rideRevenue) },
          ],
          rows,
          columns: ['Source', 'Records', 'Revenue', 'Type'],
        };
      }
      default:
        return null;
    }
  }, [section, snapshots, today]);

  if (!view) {
    return <Navigate to="/admin/super" replace />;
  }

  const meta = sectionMeta[section];
  const Icon = meta.icon;

  return (
    <div>
      <Link to="/admin/super" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <div className="flex items-start gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">{meta.title}</h1>
          <p className="text-gray-400 text-sm mt-1">{meta.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {view.summaryCards.map((card) => (
          <div key={card.label} className={summaryCardClass}>
            <p className="text-gray-400 text-xs uppercase tracking-wide">{card.label}</p>
            <p className={`text-2xl font-bold mt-2 ${card.tone ?? 'text-white'}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-white font-semibold mb-4">Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {view.roleCards.map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-800 bg-gray-950 p-4">
              <p className="text-gray-400 text-xs">{card.label}</p>
              <p className="text-white text-2xl font-bold mt-1">{card.count.toLocaleString('en-IN')}</p>
            </div>
          ))}
          {view.roleCards.length === 0 && (
            <div className="text-gray-500 text-sm">No live breakdown records found yet.</div>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">Live Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {view.columns.map((heading) => (
                  <th key={heading} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {view.rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className={`${tableCellClass} text-white font-medium`}>{row.name}</td>
                  <td className={`${tableCellClass} text-gray-300`}>{row.meta}</td>
                  <td className={`${tableCellClass} text-gray-300`}>{row.status}</td>
                  <td className={`${tableCellClass} text-gray-400`}>{row.extra}</td>
                </tr>
              ))}
              {view.rows.length === 0 && (
                <tr>
                  <td colSpan={view.columns.length} className="px-5 py-12 text-center text-gray-500 text-sm">
                    No live records found for this section yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
