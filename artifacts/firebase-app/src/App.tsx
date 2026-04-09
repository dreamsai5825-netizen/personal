import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { SuccessProvider } from './components/SuccessModal';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SiteFooter } from './components/SiteFooter';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { FoodGrocery } from './components/FoodGrocery';
import { RideHailing } from './components/RideHailing';
import { HomeServices } from './components/HomeServices';
import { ServiceWorkerDashboard } from './components/ServiceWorkerDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { Profile } from './components/Profile';
import { OrderManagement } from "./components/admin/OrderManagement";
import { RideManagement } from "./components/admin/RideManagement";
import { VendorManagement } from "./components/admin/VendorManagement";
import { ServiceBookingMonitoring } from "./components/admin/ServiceBookingMonitoring";
import { DeliveryPartnerManagement } from "./components/admin/DeliveryPartnerManagement";
import { DriverManagement } from "./components/admin/DriverManagement";
import { OrderDetails } from "./components/admin/OrderDetails";
import { RideDetails } from "./components/admin/RideDetails";
import { DashboardLayout } from "./components/admin/DashboardLayout";
import { Overview } from "./components/admin/Overview";
import { DriverDetails } from "./components/admin/DriverDetails";
import { DeliveryPartnerDetails } from "./components/admin/DeliveryPartnerDetails";
import { ServiceBookingDetails } from "./components/admin/ServiceBookingDetails";
import { FoodVendors } from "./components/admin/FoodVendors";
import { GroceryVendors } from "./components/admin/GroceryVendors";
import { VendorDetails } from "./components/admin/VendorDetails";
import { FoodVendorLayout } from "./components/foodVendor/FoodVendorLayout";
import { VendorOverview } from "./components/vendor/VendorOverview";
import { VendorOrders } from "./components/vendor/VendorOrders";
import { VendorProducts } from "./components/vendor/VendorProducts";
import { VendorStoreSettings } from "./components/vendor/VendorStoreSettings";
import { VendorReviews } from "./components/vendor/VendorReviews";
import { VendorEarnings } from "./components/vendor/VendorEarnings";
import { VendorNotifications } from "./components/vendor/VendorNotifications";
import { VendorSupport } from "./components/vendor/VendorSupport";
import { VendorProfile } from "./components/vendor/VendorProfile";
import { GroceryVendorLayout } from "./components/groceryVendor/GroceryVendorLayout";
import { GroceryVendorOverview } from "./components/groceryVendor/GroceryVendorOverview";
import { GroceryVendorOrders } from "./components/groceryVendor/GroceryVendorOrders";
import { GroceryVendorProducts } from "./components/groceryVendor/GroceryVendorProducts";
import { GroceryVendorStoreSettings } from "./components/groceryVendor/GroceryVendorStoreSettings";
import { GroceryVendorReviews } from "./components/groceryVendor/GroceryVendorReviews";
import { GroceryVendorEarnings } from "./components/groceryVendor/GroceryVendorEarnings";
import { GroceryVendorNotifications } from "./components/groceryVendor/GroceryVendorNotifications";
import { CustomerCareLayout } from "./components/customerCare/CustomerCareLayout";
import { CustomerCareOverview } from "./components/customerCare/CustomerCareOverview";
import { TicketManagement } from "./components/customerCare/TicketManagement";
import { OrderIssues } from "./components/customerCare/OrderIssues";
import { RideIssues } from "./components/customerCare/RideIssues";
import { RefundManagement } from "./components/customerCare/RefundManagement";
import { CustomerChat } from "./components/customerCare/CustomerChat";
import { Escalations } from "./components/customerCare/Escalations";
import { SupportReports } from "./components/customerCare/SupportReports";
import { SuperAdminLayout } from "./components/superAdmin/SuperAdminLayout";
import { SuperAdminOverview } from "./components/superAdmin/SuperAdminOverview";
import { AdminManagement } from "./components/superAdmin/AdminManagement";
import { CommissionSettings } from "./components/superAdmin/CommissionSettings";
import { ServiceConfiguration } from "./components/superAdmin/ServiceConfiguration";
import { PlatformSettings } from "./components/superAdmin/PlatformSettings";
import { Analytics } from "./components/superAdmin/Analytics";
import { AuditLogs } from "./components/superAdmin/AuditLogs";
import { SystemHealth } from "./components/superAdmin/SystemHealth";
import { SuperAdminInsightDetails } from "./components/superAdmin/SuperAdminInsightDetails";
import { PlatformContentProvider } from './platformContent';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, needsPhoneVerification, isPhoneVerified } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (needsPhoneVerification || !isPhoneVerified) return <Navigate to="/login" />;
  return <>{children}</>;
};

const FoodVendorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, profile, isSuperAdmin } = useAuth();
  if (loading) return <div className="min-h-screen bg-emerald-950 flex items-center justify-center"><div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  const isFoodVendor = profile?.role === 'vendor' || profile?.role === 'food_store_vendor';
  if (!isFoodVendor && !isSuperAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

const GroceryVendorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, profile, isSuperAdmin } = useAuth();
  if (loading) return <div className="min-h-screen bg-blue-950 flex items-center justify-center"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  const isGroceryVendor = profile?.role === 'grocery_store_vendor';
  if (!isGroceryVendor && !isSuperAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

const CustomerCareRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isCustomerCare, isSuperAdmin } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (!isCustomerCare && !isSuperAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, isSuperAdmin } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" />;
  if (!isSuperAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const CustomerOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const ords = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
      setOrders(ords.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)));
    });
    return unsub;
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 min-h-[70vh]">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-400">No orders yet</h2>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold uppercase tracking-wider">{o.orderType}</span>
                  <span className="text-gray-400 text-sm font-medium">#{o.id.slice(-6)}</span>
                </div>
                <p className="text-gray-900 font-bold text-lg mb-1">
                  {typeof o.items === 'string' ? o.items : 
                   Array.isArray(o.items) ? o.items.map((i: any) => `${i.quantity}x ${i.productId || 'Item'}`).join(', ') 
                   : 'Items'}
                </p>
                <p className="text-gray-500 text-sm">{o.deliveryAddress}</p>
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                <p className="text-2xl font-black text-gray-900">₹{o.totalPrice}</p>
                <div className={`px-4 py-1.5 rounded-xl text-sm font-bold capitalize ${o.orderStatus === 'Completed' || o.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : o.orderStatus === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {o.orderStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const { loading, profile, isAdmin, isCustomerCare, isSuperAdmin } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (isSuperAdmin) return <Navigate to="/admin/super" replace />;
  if (isCustomerCare) return <Navigate to="/admin/support/order-issues" replace />;
  if (isAdmin) return <Navigate to="/admin/orders" replace />;

  switch (profile?.role) {
    case 'driver':
      return <Navigate to="/driver/dashboard?tab=orders" replace />;
    case 'service_worker':
      return <Navigate to="/worker/dashboard?tab=incoming" replace />;
    case 'grocery_store_vendor':
      return <Navigate to="/grocery-vendor/orders" replace />;
    case 'vendor':
    case 'food_store_vendor':
      return <Navigate to="/food-vendor/orders" replace />;
    default:
      return <CustomerOrders />;
  }
};

const AdminRedirects: React.FC = () => {
  const { isSuperAdmin, isCustomerCare, isAdmin, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (loading) return;
    if (location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/admin') return;
    
    if (isSuperAdmin) navigate('/admin/super', { replace: true });
    else if (isCustomerCare) navigate('/admin/support', { replace: true });
    else if (isAdmin) navigate('/admin/overview', { replace: true });
    else if (profile?.role === 'grocery_store_vendor') navigate('/grocery-vendor/dashboard', { replace: true });
    else if (profile?.role === 'vendor' || profile?.role === 'food_store_vendor') navigate('/food-vendor/orders', { replace: true });
  }, [isSuperAdmin, isCustomerCare, isAdmin, profile, loading, navigate, location.pathname]);
  return null;
};


import { CheckoutPage } from "./components/CheckoutPage";

const MainLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-100 selection:text-orange-900 pb-20 md:pb-0">
    <AdminRedirects />
    <Navbar />
    <main><Outlet /></main>
    <BottomNav />
    <SiteFooter />
  </div>
);

export default function App() {
  return (
    <Router>
      <PlatformContentProvider>
        <AuthProvider>
          <SuccessProvider>
            <Routes>
              <Route path="/food-vendor" element={<FoodVendorRoute><FoodVendorLayout /></FoodVendorRoute>}>
                <Route path="orders" element={<VendorOrders />} />
                <Route path="products" element={<VendorProducts />} />
                <Route path="store-settings" element={<VendorStoreSettings />} />
                <Route path="profile" element={<VendorProfile />} />
                <Route path="notifications" element={<VendorNotifications />} />
                <Route index element={<Navigate to="/food-vendor/orders" />} />
                <Route path="*" element={<Navigate to="/food-vendor/orders" />} />
              </Route>

              <Route path="/vendor" element={<Navigate to="/food-vendor/orders" replace />} />
              <Route path="/vendor/*" element={<Navigate to="/food-vendor/orders" replace />} />

              <Route path="/grocery-vendor" element={<GroceryVendorRoute><GroceryVendorLayout /></GroceryVendorRoute>}>
                <Route path="dashboard" element={<GroceryVendorOverview />} />
                <Route path="orders" element={<GroceryVendorOrders />} />
                <Route path="products" element={<GroceryVendorProducts />} />
                <Route path="store-settings" element={<GroceryVendorStoreSettings />} />
                <Route path="reviews" element={<GroceryVendorReviews />} />
                <Route path="earnings" element={<GroceryVendorEarnings />} />
                <Route path="notifications" element={<GroceryVendorNotifications />} />
                <Route path="support" element={<VendorSupport />} />
                <Route index element={<Navigate to="/grocery-vendor/dashboard" />} />
                <Route path="*" element={<Navigate to="/grocery-vendor/dashboard" />} />
              </Route>

              <Route path="/admin/support" element={<CustomerCareRoute><CustomerCareLayout /></CustomerCareRoute>}>
                <Route index element={<CustomerCareOverview />} />
                <Route path="tickets" element={<TicketManagement />} />
                <Route path="order-issues" element={<OrderIssues />} />
                <Route path="ride-issues" element={<RideIssues />} />
                <Route path="refunds" element={<RefundManagement />} />
                <Route path="chat" element={<CustomerChat />} />
                <Route path="escalations" element={<Escalations />} />
                <Route path="reports" element={<SupportReports />} />
                <Route path="*" element={<Navigate to="/admin/support" />} />
              </Route>

              <Route path="/admin/super" element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
                <Route index element={<SuperAdminOverview />} />
                <Route path="insights/:section" element={<SuperAdminInsightDetails />} />
                <Route path="admins" element={<AdminManagement />} />
                <Route path="commission" element={<CommissionSettings />} />
                <Route path="services" element={<ServiceConfiguration />} />
                <Route path="settings" element={<PlatformSettings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="logs" element={<AuditLogs />} />
                <Route path="health" element={<SystemHealth />} />
                <Route path="*" element={<Navigate to="/admin/super" />} />
              </Route>

              <Route path="/worker/dashboard" element={<ProtectedRoute><ServiceWorkerDashboard /></ProtectedRoute>} />
              <Route path="/driver/dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />

              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/food" element={<FoodGrocery type="food" />} />
                <Route path="/grocery" element={<FoodGrocery type="grocery" />} />
                <Route path="/rides" element={<RideHailing />} />
                <Route path="/services" element={<HomeServices />} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Wallet Coming Soon</h1></div></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

                <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                  <Route path="overview" element={<Overview />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="orders/:orderId" element={<OrderDetails />} />
                  <Route path="rides" element={<RideManagement />} />
                  <Route path="rides/:rideId" element={<ProtectedRoute><RideDetails /></ProtectedRoute>} />
                  <Route path="vendors" element={<VendorManagement />} />
                  <Route path="vendors/food" element={<FoodVendors />} />
                  <Route path="vendors/grocery" element={<GroceryVendors />} />
                  <Route path="vendors/:vendorId" element={<ProtectedRoute><VendorDetails /></ProtectedRoute>} />
                  <Route path="service-bookings" element={<ServiceBookingMonitoring />} />
                  <Route path="service-bookings/:bookingId" element={<ProtectedRoute><ServiceBookingDetails /></ProtectedRoute>} />
                  <Route path="delivery-partners" element={<DeliveryPartnerManagement />} />
                  <Route path="delivery-partners/:partnerId" element={<ProtectedRoute><DeliveryPartnerDetails /></ProtectedRoute>} />
                  <Route path="drivers" element={<DriverManagement />} />
                  <Route path="drivers/:driverId" element={<ProtectedRoute><DriverDetails /></ProtectedRoute>} />
                  <Route path="*" element={<div>Select a section from the sidebar.</div>} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
              </Route>
            </Routes>
          </SuccessProvider>
        </AuthProvider>
      </PlatformContentProvider>
    </Router>
  );
}
