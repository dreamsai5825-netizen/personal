import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { ShoppingBag, Clock, DollarSign, Star, TrendingUp, Package } from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { foodOrderStore, groceryOrderStore, VendorOrder, statusBadge } from '../../lib/vendorOrderStore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';

export const VendorOverview: React.FC = () => {
  const { profile } = useAuth();
  const isGrocery = profile?.role === 'grocery_store_vendor';
  const activeStore = isGrocery ? groceryOrderStore : foodOrderStore;
  const [orders, setOrders] = useState<VendorOrder[]>(activeStore.getOrders());
  const [productsCount, setProductsCount] = useState(0);

  useEffect(() => {
    setOrders(activeStore.getOrders());
    const unsub = activeStore.subscribe(() => setOrders(activeStore.getOrders()));
    return unsub;
  }, [activeStore]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      setProductsCount(snap.size);
    });
    return unsub;
  }, []);

  const pendingCount = orders.filter(o => o.status === 'New' || o.status === 'Accepted' || o.status === 'Preparing').length;
  const todayRevenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + parseFloat(o.amount.replace(/[^0-9.]/g, '') || '0'), 0);

  const stats = [
    { label: "Today's Orders", value: orders.length.toString(), sub: 'Active sync', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Pending Orders', value: pendingCount.toString(), sub: 'Needs attention', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: "Today's Revenue", value: `₹${todayRevenue}`, sub: 'Completed orders', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Average Rating', value: '0.0', sub: 'No reviews yet', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Active Products', value: productsCount.toString(), sub: 'Live menu items', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'This Month', value: `₹${todayRevenue}`, sub: 'Month to date', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-2xl font-bold">Vendor Dashboard</h1>
        <p className="text-emerald-400 text-sm mt-1">Welcome back! Here's how your store is performing today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-emerald-400 text-xs font-medium">{label}</p>
              <p className="text-white text-2xl font-bold leading-tight">{value}</p>
              <p className="text-emerald-500 text-xs mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-emerald-900 border border-emerald-800 rounded-xl p-5 flex items-center justify-center min-h-[250px]">
           <p className="text-emerald-500">Not enough historical data to generate chart.</p>
        </div>

        <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-2">Order Status</h3>
          <div className="space-y-3 mt-4">
            {[
              { label: 'New', count: orders.filter(o => o.status === 'New').length, color: 'bg-blue-500', total: orders.length || 1 },
              { label: 'Preparing', count: orders.filter(o => o.status === 'Preparing').length, color: 'bg-amber-500', total: orders.length || 1 },
              { label: 'Ready', count: orders.filter(o => o.status === 'Ready for Pickup').length, color: 'bg-emerald-500', total: orders.length || 1 },
              { label: 'Completed', count: orders.filter(o => o.status === 'Completed').length, color: 'bg-slate-500', total: orders.length || 1 },
            ].map(({ label, count, color, total }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-emerald-300">{label}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
                <div className="h-2 bg-emerald-800 rounded-full">
                  <div className={`h-2 ${color} rounded-full`} style={{ width: `${(count / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-emerald-500 text-xs uppercase border-b border-emerald-800">
                <th className="text-left pb-3 font-medium">Order</th>
                <th className="text-left pb-3 font-medium">Customer</th>
                <th className="text-left pb-3 font-medium">Items</th>
                <th className="text-left pb-3 font-medium">Amount</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-left pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800">
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="hover:bg-emerald-800/40 transition-colors">
                  <td className="py-3 text-emerald-400 font-mono font-medium">{o.id}</td>
                  <td className="py-3 text-white">{o.customer}</td>
                  <td className="py-3 text-emerald-300 text-xs">{o.items}</td>
                  <td className="py-3 text-white font-semibold">{o.amount}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="py-3 text-emerald-500 text-xs">{o.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-8 text-center text-emerald-500 text-sm">No orders today</div>
          )}
        </div>
      </div>
    </div>
  );
};
