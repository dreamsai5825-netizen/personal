import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowRight, Bike, Car, DollarSign, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import {
  FirestoreRecord,
  asDate,
  getNumeric,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  useSuperAdminLiveData,
} from './superAdminLiveData';

interface ChartDay {
  day: string;
  orders: number;
  rides: number;
}

interface ChartMonth {
  month: string;
  revenue: number;
}

interface UserGrowthMonth {
  month: string;
  users: number;
}

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  bg: string;
  to: string;
}

const DAY_LABEL = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const MONTH_LABEL = new Intl.DateTimeFormat('en-US', { month: 'short' });

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon: Icon, color, bg, to }) => (
  <Link
    to={to}
    className="group bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4 transition-all hover:border-orange-500/40 hover:bg-gray-900/90 hover:-translate-y-0.5"
  >
    <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-gray-400 text-xs font-medium">{label}</p>
      <p className="text-white text-2xl font-bold leading-tight">{value}</p>
      {sub && <p className="text-green-400 text-xs mt-0.5">{sub}</p>}
    </div>
    <ArrowRight className="w-4 h-4 text-gray-500 transition-colors group-hover:text-orange-400" />
  </Link>
);

const sumRevenue = (records: FirestoreRecord[], priceKey: string, feeKey?: string) =>
  records.reduce((total, record) => {
    const amount = getNumeric(record[priceKey]);
    const fee = feeKey ? getNumeric(record[feeKey]) : 0;
    return total + amount + fee;
  }, 0);

const formatDelta = (current: number, previous: number, suffix: string) => {
  if (current === 0 && previous === 0) return `0% ${suffix}`;
  if (previous === 0) return `+100% ${suffix}`;
  const delta = ((current - previous) / previous) * 100;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta.toFixed(0)}% ${suffix}`;
};

const formatCompactRupees = (value: number) => {
  if (value >= 100000) return `Rs ${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `Rs ${(value / 1000).toFixed(1)}K`;
  return `Rs ${value.toLocaleString('en-IN')}`;
};

export const SuperAdminOverview: React.FC = () => {
  const snapshots = useSuperAdminLiveData();

  const analytics = useMemo(() => {
    const now = new Date();
    const today = startOfDay(now);
    const yesterday = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
    const thisWeekStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
    const previousWeekStart = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13));
    const thisMonth = startOfMonth(now);
    const previousMonth = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    const orderRecords = snapshots.orders.map((record) => ({
      record,
      createdAtDate: asDate(record.createdAt),
    }));
    const rideRecords = snapshots.rides.map((record) => ({
      record,
      createdAtDate: asDate(record.createdAt),
    }));
    const userRecords = snapshots.users.map((record) => ({
      record,
      createdAtDate: asDate(record.createdAt),
    }));
    const vendorRecords = snapshots.vendors.map((record) => ({
      record,
      createdAtDate: asDate(record.createdAt),
    }));

    const ordersToday = orderRecords.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, today));
    const ordersYesterday = orderRecords.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, yesterday));
    const ridesThisWeek = rideRecords.filter((record) => record.createdAtDate && record.createdAtDate >= thisWeekStart);
    const ridesLastWeek = rideRecords.filter((record) => record.createdAtDate && record.createdAtDate >= previousWeekStart && record.createdAtDate < thisWeekStart);
    const usersThisMonth = userRecords.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, thisMonth));
    const usersLastMonth = userRecords.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, previousMonth));
    const vendorsThisMonth = vendorRecords.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, thisMonth));
    const vendorsLastMonth = vendorRecords.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, previousMonth));

    const revenueToday = sumRevenue(ordersToday.map((item) => item.record), 'totalPrice', 'deliveryFee');
    const revenueYesterday = sumRevenue(ordersYesterday.map((item) => item.record), 'totalPrice', 'deliveryFee');
    const totalRevenue =
      sumRevenue(snapshots.orders, 'totalPrice', 'deliveryFee') +
      sumRevenue(snapshots.rides, 'fare');

    const activeDriversFromUsers = snapshots.users.filter((user) => {
      const role = String(user.role ?? '');
      const isDriver = role === 'driver';
      const isAvailable = Boolean((user.driverProfile as { isAvailable?: boolean } | undefined)?.isAvailable);
      return isDriver && isAvailable;
    }).length;

    const activeDrivers = snapshots.drivers.length > 0
      ? snapshots.drivers.filter((driver) => String(driver.status ?? '').toLowerCase() === 'active').length
      : activeDriversFromUsers;

    const activeDeliveryPartnersFromUsers = snapshots.users.filter((user) => String(user.role ?? '') === 'delivery_partner').length;
    const activeDeliveryPartners = snapshots.deliveryPartners.length > 0
      ? snapshots.deliveryPartners.filter((partner) => String(partner.status ?? '').toLowerCase() === 'active').length
      : activeDeliveryPartnersFromUsers;

    const dailyOrders: ChartDay[] = Array.from({ length: 7 }, (_, index) => {
      const date = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - index)));
      return {
        day: DAY_LABEL.format(date),
        orders: orderRecords.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, date)).length,
        rides: rideRecords.filter((record) => record.createdAtDate && isSameDay(record.createdAtDate, date)).length,
      };
    });

    const revenueData: ChartMonth[] = Array.from({ length: 7 }, (_, index) => {
      const date = startOfMonth(new Date(now.getFullYear(), now.getMonth() - (6 - index), 1));
      const monthlyOrders = orderRecords.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, date)).map((record) => record.record);
      const monthlyRides = rideRecords.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, date)).map((record) => record.record);
      return {
        month: MONTH_LABEL.format(date),
        revenue: sumRevenue(monthlyOrders, 'totalPrice', 'deliveryFee') + sumRevenue(monthlyRides, 'fare'),
      };
    });

    let cumulativeUsers = 0;
    const userGrowth: UserGrowthMonth[] = Array.from({ length: 7 }, (_, index) => {
      const date = startOfMonth(new Date(now.getFullYear(), now.getMonth() - (6 - index), 1));
      cumulativeUsers += userRecords.filter((record) => record.createdAtDate && isSameMonth(record.createdAtDate, date)).length;
      return {
        month: MONTH_LABEL.format(date),
        users: cumulativeUsers,
      };
    });

    return {
      stats: {
        totalUsers: snapshots.users.length,
        totalVendors: snapshots.vendors.length,
        totalOrders: snapshots.orders.length,
        totalRides: snapshots.rides.length,
        totalRevenue,
        activeDrivers,
        activeDeliveryPartners,
        ordersToday: ordersToday.length,
        revenueToday,
      },
      dailyOrders,
      revenueData,
      userGrowth,
      cardSubs: {
        users: formatDelta(usersThisMonth.length, usersLastMonth.length, 'this month'),
        vendors: formatDelta(vendorsThisMonth.length, vendorsLastMonth.length, 'this month'),
        rides: formatDelta(ridesThisWeek.length, ridesLastWeek.length, 'this week'),
        revenue: formatDelta(revenueToday, revenueYesterday, 'vs yesterday'),
      },
    };
  }, [snapshots]);

  const cards: StatCardProps[] = [
    {
      label: 'Total Users',
      value: analytics.stats.totalUsers.toLocaleString('en-IN'),
      sub: analytics.cardSubs.users,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      to: '/admin/super/insights/users',
    },
    {
      label: 'Total Vendors',
      value: analytics.stats.totalVendors.toLocaleString('en-IN'),
      sub: analytics.cardSubs.vendors,
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      to: '/admin/super/insights/vendors',
    },
    {
      label: 'Total Orders',
      value: analytics.stats.totalOrders.toLocaleString('en-IN'),
      sub: `Today: ${analytics.stats.ordersToday.toLocaleString('en-IN')}`,
      icon: ShoppingBag,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      to: '/admin/super/insights/orders',
    },
    {
      label: 'Total Rides',
      value: analytics.stats.totalRides.toLocaleString('en-IN'),
      sub: analytics.cardSubs.rides,
      icon: Car,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      to: '/admin/super/insights/rides',
    },
    {
      label: 'Total Revenue',
      value: formatCompactRupees(analytics.stats.totalRevenue),
      sub: `Today: ${formatCompactRupees(analytics.stats.revenueToday)}`,
      icon: DollarSign,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      to: '/admin/super/insights/revenue',
    },
    {
      label: 'Active Drivers',
      value: analytics.stats.activeDrivers.toLocaleString('en-IN'),
      sub: 'Currently online',
      icon: Car,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      to: '/admin/super/insights/drivers',
    },
    {
      label: 'Delivery Partners',
      value: analytics.stats.activeDeliveryPartners.toLocaleString('en-IN'),
      sub: 'Currently active',
      icon: Bike,
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      to: '/admin/super/insights/delivery-partners',
    },
    {
      label: 'Revenue Today',
      value: formatCompactRupees(analytics.stats.revenueToday),
      sub: analytics.cardSubs.revenue,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      to: '/admin/super/insights/revenue-today',
    },
  ];

  const tooltipStyle = {
    backgroundColor: '#1f2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#f9fafb',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-white text-2xl font-bold">Platform Overview</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time system-wide metrics and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => <StatCard key={card.label} {...card} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Daily Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.dailyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="orders" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Ride Requests</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.dailyOrders}>
              <defs>
                <linearGradient id="rideGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rides" stroke="#06b6d4" fill="url(#rideGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Monthly Revenue (Rs)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`Rs ${value.toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} allowDecimals={false} tickFormatter={(value) => `${(Number(value) / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [value.toLocaleString('en-IN'), 'Users']} />
              <Line type="monotone" dataKey="users" stroke="#a855f7" strokeWidth={2} dot={{ fill: '#a855f7', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
