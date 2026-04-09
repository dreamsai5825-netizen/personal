import React, { useEffect, useMemo, useState } from 'react';
import { collection, DocumentData, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download, TrendingUp, ShoppingBag, Car, Store, User } from 'lucide-react';
import { db } from '../../firebase';

type Filter = 'daily' | 'weekly' | 'monthly';
type ActiveReport = 'revenue' | 'orders' | 'rides' | 'vendor' | 'driver';
type FirestoreRecord = Record<string, unknown> & { id: string };

interface SnapshotState {
  users: FirestoreRecord[];
  vendors: FirestoreRecord[];
  orders: FirestoreRecord[];
  rides: FirestoreRecord[];
  drivers: FirestoreRecord[];
  deliveryPartners: FirestoreRecord[];
}

interface TrendPoint {
  date: string;
  revenue: number;
  orders: number;
  rides: number;
}

interface VendorPerformanceRow {
  id: string;
  name: string;
  orders: number;
  revenue: number;
  rating: number;
}

interface DriverPerformanceRow {
  id: string;
  name: string;
  rides: number;
  earnings: number;
  rating: number;
}

const EMPTY_STATE: SnapshotState = {
  users: [],
  vendors: [],
  orders: [],
  rides: [],
  drivers: [],
  deliveryPartners: [],
};

const tooltipStyle = {
  backgroundColor: '#1f2937',
  border: '1px solid #374151',
  borderRadius: '8px',
  color: '#f9fafb',
};

const toRecords = (snapshot: QuerySnapshot<DocumentData>): FirestoreRecord[] =>
  snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

const asDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'toDate' in value &&
    typeof (value as { toDate: () => Date }).toDate === 'function'
  ) {
    const parsed = (value as { toDate: () => Date }).toDate();
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const startOfDay = (date: Date) => {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
};

const startOfWeek = (date: Date) => {
  const value = startOfDay(date);
  value.setDate(value.getDate() - 6);
  return value;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const isSameDay = (left: Date, right: Date) => startOfDay(left).getTime() === startOfDay(right).getTime();

const isSameMonth = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

const formatRupees = (value: number) => `Rs ${Math.round(value).toLocaleString('en-IN')}`;

const formatShortRupees = (value: number) => {
  if (Math.abs(value) >= 100000) return `Rs ${(value / 100000).toFixed(1)}L`;
  if (Math.abs(value) >= 1000) return `Rs ${(value / 1000).toFixed(1)}K`;
  return formatRupees(value);
};

const formatPercentDelta = (current: number, previous: number) => {
  if (current === 0 && previous === 0) return '0%';
  if (previous === 0) return '+100%';
  const delta = ((current - previous) / previous) * 100;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta.toFixed(0)}%`;
};

const getNumeric = (value: unknown) => {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
};

const getUserDisplayName = (record: FirestoreRecord) => {
  const name = record.name;
  if (typeof name === 'string' && name.trim()) return name;
  const firstName = typeof record.firstName === 'string' ? record.firstName : '';
  const lastName = typeof record.lastName === 'string' ? record.lastName : '';
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || 'Unnamed';
};

const getDriverRating = (record: FirestoreRecord) => {
  const profile = record.driverProfile as { rating?: unknown } | undefined;
  return getNumeric(profile?.rating ?? record.rating ?? 0);
};

const getDriverAvailability = (record: FirestoreRecord) => {
  const profile = record.driverProfile as { isAvailable?: unknown } | undefined;
  return Boolean(profile?.isAvailable ?? record.isAvailable);
};

export const Analytics: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('daily');
  const [activeReport, setActiveReport] = useState<ActiveReport>('revenue');
  const [snapshots, setSnapshots] = useState<SnapshotState>(EMPTY_STATE);

  useEffect(() => {
    const unsubscribers = [
      onSnapshot(collection(db, 'users'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, users: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'vendors'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, vendors: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'orders'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, orders: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'rides'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, rides: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'drivers'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, drivers: toRecords(snapshot) }));
      }),
      onSnapshot(collection(db, 'deliveryPartners'), (snapshot) => {
        setSnapshots((prev) => ({ ...prev, deliveryPartners: toRecords(snapshot) }));
      }),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const analytics = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const currentWeekStart = startOfWeek(now);
    const previousWeekStart = startOfWeek(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7));
    const currentMonthStart = startOfMonth(now);
    const previousMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    const orders = snapshots.orders.map((record) => ({
      record,
      createdAtDate: asDate(record.createdAt),
      totalAmount: getNumeric(record.totalPrice) + getNumeric(record.deliveryFee),
    }));
    const rides = snapshots.rides.map((record) => ({
      record,
      createdAtDate: asDate(record.createdAt),
      fareAmount: getNumeric(record.fare),
    }));
    const users = snapshots.users.map((record) => ({
      record,
      createdAtDate: asDate(record.createdAt),
    }));

    const todayOrders = orders.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, today));
    const yesterdayOrders = orders.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, yesterday));
    const todayRides = rides.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, today));
    const yesterdayRides = rides.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, yesterday));

    const todayRevenue =
      todayOrders.reduce((sum, record) => sum + record.totalAmount, 0) +
      todayRides.reduce((sum, record) => sum + record.fareAmount, 0);
    const yesterdayRevenue =
      yesterdayOrders.reduce((sum, record) => sum + record.totalAmount, 0) +
      yesterdayRides.reduce((sum, record) => sum + record.fareAmount, 0);

    const averageOrderValue = todayOrders.length > 0
      ? todayOrders.reduce((sum, record) => sum + record.totalAmount, 0) / todayOrders.length
      : 0;
    const yesterdayAverageOrderValue = yesterdayOrders.length > 0
      ? yesterdayOrders.reduce((sum, record) => sum + record.totalAmount, 0) / yesterdayOrders.length
      : 0;

    const trendData: Record<Filter, TrendPoint[]> = {
      daily: Array.from({ length: 7 }, (_, index) => {
        const date = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index)));
        const dateLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
        const dayOrders = orders.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, date));
        const dayRides = rides.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, date));
        return {
          date: dateLabel,
          orders: dayOrders.length,
          rides: dayRides.length,
          revenue:
            dayOrders.reduce((sum, record) => sum + record.totalAmount, 0) +
            dayRides.reduce((sum, record) => sum + record.fareAmount, 0),
        };
      }),
      weekly: Array.from({ length: 6 }, (_, index) => {
        const weekStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - ((5 - index) * 7 + 6)));
        const weekEnd = startOfDay(new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6));
        const weekOrders = orders.filter((record) => {
          if (!record.createdAtDate) return false;
          return record.createdAtDate >= weekStart && record.createdAtDate <= weekEnd;
        });
        const weekRides = rides.filter((record) => {
          if (!record.createdAtDate) return false;
          return record.createdAtDate >= weekStart && record.createdAtDate <= weekEnd;
        });
        return {
          date: `Week ${index + 1}`,
          orders: weekOrders.length,
          rides: weekRides.length,
          revenue:
            weekOrders.reduce((sum, record) => sum + record.totalAmount, 0) +
            weekRides.reduce((sum, record) => sum + record.fareAmount, 0),
        };
      }),
      monthly: Array.from({ length: 7 }, (_, index) => {
        const monthDate = startOfMonth(new Date(now.getFullYear(), now.getMonth() - (6 - index), 1));
        const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(monthDate);
        const monthOrders = orders.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, monthDate));
        const monthRides = rides.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, monthDate));
        return {
          date: monthLabel,
          orders: monthOrders.length,
          rides: monthRides.length,
          revenue:
            monthOrders.reduce((sum, record) => sum + record.totalAmount, 0) +
            monthRides.reduce((sum, record) => sum + record.fareAmount, 0),
        };
      }),
    };

    const vendorPerformance: VendorPerformanceRow[] = snapshots.vendors
      .map((vendor) => {
        const vendorId = String(vendor.vendorId ?? vendor.id);
        const vendorName = String(vendor.vendorName ?? vendor.name ?? 'Unnamed vendor');
        const vendorOrders = orders.filter((order) => String(order.record.vendorId ?? '') === vendorId);
        return {
          id: vendorId,
          name: vendorName,
          orders: vendorOrders.length,
          revenue: vendorOrders.reduce((sum, order) => sum + order.totalAmount, 0),
          rating: getNumeric(vendor.rating),
        };
      })
      .sort((left, right) => right.revenue - left.revenue || right.orders - left.orders)
      .slice(0, 5);

    const driversFromDriverCollection = snapshots.drivers.map((driver) => ({
      id: String(driver.userId ?? driver.driverId ?? driver.id),
      name: getUserDisplayName(driver),
      rating: getNumeric(driver.rating),
      isAvailable: Boolean(driver.isAvailable ?? String(driver.status ?? '').toLowerCase() === 'active'),
    }));

    const driversFromUsers = users
      .filter((user) => user.record.role === 'driver')
      .map((user) => ({
        id: String(user.record.userId ?? user.record.id),
        name: getUserDisplayName(user.record),
        rating: getDriverRating(user.record),
        isAvailable: getDriverAvailability(user.record),
      }));

    const driverBase = driversFromDriverCollection.length > 0 ? driversFromDriverCollection : driversFromUsers;
    const driverPerformance: DriverPerformanceRow[] = driverBase
      .map((driver) => {
        const driverId = driver.id;
        const driverRides = rides.filter((ride) => String(ride.record.driverId ?? '') === driverId);
        return {
          id: driverId,
          name: driver.name,
          rides: driverRides.length,
          earnings: driverRides.reduce((sum, ride) => sum + ride.fareAmount, 0),
          rating: driver.rating,
        };
      })
      .sort((left, right) => right.rides - left.rides || right.earnings - left.earnings)
      .slice(0, 5);

    const weeklyUsers = users.filter((record) => record.createdAtDate && record.createdAtDate >= currentWeekStart).length;
    const previousWeeklyUsers = users.filter((record) => {
      if (!record.createdAtDate) return false;
      return record.createdAtDate >= previousWeekStart && record.createdAtDate < currentWeekStart;
    }).length;
    const currentMonthUsers = users.filter((record) => record.createdAtDate && record.createdAtDate >= currentMonthStart).length;
    const previousMonthUsers = users.filter((record) => {
      if (!record.createdAtDate) return false;
      return record.createdAtDate >= previousMonthStart && record.createdAtDate < currentMonthStart;
    }).length;

    return {
      data: trendData[filter],
      summaryCards: [
        {
          label: 'Revenue Today',
          value: formatShortRupees(todayRevenue),
          change: `${formatPercentDelta(todayRevenue, yesterdayRevenue)} vs yesterday`,
          icon: TrendingUp,
          color: 'text-green-400',
          bg: 'bg-green-500/10',
        },
        {
          label: 'Orders Today',
          value: todayOrders.length.toLocaleString('en-IN'),
          change: `${formatPercentDelta(todayOrders.length, yesterdayOrders.length)} vs yesterday`,
          icon: ShoppingBag,
          color: 'text-orange-400',
          bg: 'bg-orange-500/10',
        },
        {
          label: 'Rides Today',
          value: todayRides.length.toLocaleString('en-IN'),
          change: `${formatPercentDelta(todayRides.length, yesterdayRides.length)} vs yesterday`,
          icon: Car,
          color: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
        },
        {
          label: 'Avg Order Value',
          value: formatShortRupees(averageOrderValue),
          change: `${formatPercentDelta(averageOrderValue, yesterdayAverageOrderValue)} vs yesterday`,
          icon: Store,
          color: 'text-purple-400',
          bg: 'bg-purple-500/10',
        },
      ],
      vendorPerformance,
      driverPerformance,
      populationStats: {
        totalUsers: users.length,
        weeklyUsers,
        previousWeeklyUsers,
        currentMonthUsers,
        previousMonthUsers,
      },
    };
  }, [filter, snapshots]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-gray-400 text-sm mt-1">Platform-wide performance insights</p>
        </div>
        <button className="flex items-center gap-2 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 px-4 py-2 rounded-lg text-sm transition-colors">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {analytics.summaryCards.map((card) => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">{card.label}</p>
              <p className="text-white font-bold">{card.value}</p>
              <p className="text-green-400 text-xs">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
          {(['daily', 'weekly', 'monthly'] as Filter[]).map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                filter === value ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 flex-wrap">
          {(['revenue', 'orders', 'rides', 'vendor', 'driver'] as ActiveReport[]).map((report) => (
            <button
              key={report}
              onClick={() => setActiveReport(report)}
              className={`px-3 py-1.5 rounded-md text-sm capitalize transition-colors ${
                activeReport === report ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {report}
            </button>
          ))}
        </div>
      </div>

      {activeReport === 'revenue' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-4">Revenue Report</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={analytics.data}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [formatRupees(value), 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad2)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {(activeReport === 'orders' || activeReport === 'rides') && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6">
          <h3 className="text-white font-semibold mb-4 capitalize">{activeReport} Report</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey={activeReport} fill={activeReport === 'orders' ? '#f97316' : '#06b6d4'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeReport === 'vendor' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Vendor Performance</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {['Vendor', 'Orders', 'Revenue', 'Rating'].map((heading) => (
                  <th key={heading} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.vendorPerformance.map((vendor) => (
                <tr key={vendor.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-white text-sm font-medium">{vendor.name}</td>
                  <td className="px-5 py-3 text-gray-300 text-sm">{vendor.orders.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-green-400 text-sm font-medium">{formatRupees(vendor.revenue)}</td>
                  <td className="px-5 py-3">
                    <span className="text-yellow-400 text-sm">{vendor.rating > 0 ? `* ${vendor.rating.toFixed(1)}` : 'No rating'}</span>
                  </td>
                </tr>
              ))}
              {analytics.vendorPerformance.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500 text-sm">
                    No vendor performance data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeReport === 'driver' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Driver Performance</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {['Driver', 'Rides', 'Earnings', 'Rating'].map((heading) => (
                  <th key={heading} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analytics.driverPerformance.map((driver) => (
                <tr key={driver.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                  <td className="px-5 py-3 text-white text-sm font-medium">{driver.name}</td>
                  <td className="px-5 py-3 text-gray-300 text-sm">{driver.rides.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 text-green-400 text-sm font-medium">{formatRupees(driver.earnings)}</td>
                  <td className="px-5 py-3">
                    <span className="text-yellow-400 text-sm">{driver.rating > 0 ? `* ${driver.rating.toFixed(1)}` : 'No rating'}</span>
                  </td>
                </tr>
              ))}
              {analytics.driverPerformance.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500 text-sm">
                    No driver performance data yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-orange-400" />
            <p className="text-white font-medium text-sm">Total Users</p>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.populationStats.totalUsers.toLocaleString('en-IN')}</p>
          <p className="text-gray-400 text-xs mt-1">
            {formatPercentDelta(analytics.populationStats.weeklyUsers, analytics.populationStats.previousWeeklyUsers)} weekly growth
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-white font-medium text-sm">New Users This Month</p>
          </div>
          <p className="text-2xl font-bold text-white">{analytics.populationStats.currentMonthUsers.toLocaleString('en-IN')}</p>
          <p className="text-gray-400 text-xs mt-1">
            {formatPercentDelta(analytics.populationStats.currentMonthUsers, analytics.populationStats.previousMonthUsers)} vs last month
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <p className="text-white font-medium text-sm">Current Range Revenue</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatShortRupees(analytics.data.reduce((sum, point) => sum + point.revenue, 0))}
          </p>
          <p className="text-gray-400 text-xs mt-1 capitalize">{filter} reporting window</p>
        </div>
      </div>
    </div>
  );
};
