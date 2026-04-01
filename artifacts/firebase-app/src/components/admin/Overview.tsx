import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { functions } from '../../firebase';
import { httpsCallable } from 'firebase/functions';

export const Overview: React.FC = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeRides: 0,
    activeVendors: 0,
    activeDrivers: 0,
    activeDeliveryPartners: 0,
    pendingServiceBookings: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const getOverviewStats = httpsCallable(functions, 'getOverviewStats');
        const result: any = await getOverviewStats({});
        setStats({
          totalOrders: result.data.orders,
          activeRides: result.data.rides,
          activeVendors: result.data.vendors,
          activeDrivers: result.data.drivers,
          activeDeliveryPartners: result.data.deliveryPartners,
          pendingServiceBookings: result.data.serviceBookings,
        });
        // Optionally fetch recent orders separately if needed
      } catch (e) {
        // fallback to old logic or show error
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Active Rides" value={stats.activeRides} />
        <StatCard label="Active Vendors" value={stats.activeVendors} />
        <StatCard label="Active Drivers" value={stats.activeDrivers} />
        <StatCard label="Active Delivery Partners" value={stats.activeDeliveryPartners} />
        <StatCard label="Pending Service Bookings" value={stats.pendingServiceBookings} />
      </div>
      {/* Placeholder for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 min-h-[300px] flex items-center justify-center text-gray-400">[Orders per day chart]</div>
        <div className="bg-white rounded-xl shadow p-6 min-h-[300px] flex items-center justify-center text-gray-400">[Revenue chart]</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold mb-4">Recent Orders</h3>
        <table className="min-w-full border rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Vendor</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, idx) => (
              <tr key={idx} className="hover:bg-orange-50">
                <td className="border px-4 py-2">{order.orderId}</td>
                <td className="border px-4 py-2">{order.userId}</td>
                <td className="border px-4 py-2">{order.vendorId}</td>
                <td className="border px-4 py-2">₹{order.totalPrice}</td>
                <td className="border px-4 py-2 capitalize">{order.orderStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
    <div className="text-3xl font-bold text-orange-600 mb-2">{value}</div>
    <div className="text-gray-600 text-sm font-medium text-center">{label}</div>
  </div>
);
