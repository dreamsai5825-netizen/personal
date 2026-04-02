import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { SuccessProvider } from './components/SuccessModal';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { FoodGrocery } from './components/FoodGrocery';
import { RideHailing } from './components/RideHailing';
import { HomeServices } from './components/HomeServices';
import { ServiceWorkerDashboard } from './components/ServiceWorkerDashboard';
import { DriverDashboard } from './components/DriverDashboard';
import { Profile } from './components/Profile';
import { AdminPanel } from './components/AdminPanel';
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

// Food Store Vendor Portal
import { FoodVendorLayout } from "./components/foodVendor/FoodVendorLayout";
import { VendorOverview } from "./components/vendor/VendorOverview";
import { VendorOrders } from "./components/vendor/VendorOrders";
import { VendorProducts } from "./components/vendor/VendorProducts";
import { VendorStoreSettings } from "./components/vendor/VendorStoreSettings";
import { VendorReviews } from "./components/vendor/VendorReviews";
import { VendorEarnings } from "./components/vendor/VendorEarnings";
import { VendorNotifications } from "./components/vendor/VendorNotifications";

// Grocery Store Vendor Portal
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

const AdminRedirects: React.FC = () => {
  const { isSuperAdmin, isCustomerCare, isAdmin, profile, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (isSuperAdmin) navigate('/admin/super', { replace: true });
    else if (isCustomerCare) navigate('/admin/support', { replace: true });
    else if (isAdmin) navigate('/admin/overview', { replace: true });
    else if (profile?.role === 'grocery_store_vendor') navigate('/grocery-vendor/dashboard', { replace: true });
    else if (profile?.role === 'vendor' || profile?.role === 'food_store_vendor') navigate('/food-vendor/dashboard', { replace: true });
  }, [isSuperAdmin, isCustomerCare, isAdmin, profile, loading]);
  return null;
};

const MainLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-50 font-sans selection:bg-orange-100 selection:text-orange-900 pb-20 md:pb-0">
    <AdminRedirects />
    <Navbar />
    <main><Outlet /></main>
    <BottomNav />
    <footer className="bg-white border-t border-gray-100 py-12 mt-20 hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">O</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">OmniServe</span>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed">The ultimate super app for all your daily needs. Food, groceries, rides, and home services - all in one place.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-orange-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Partner with us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-50 mt-12 pt-8">
          <p className="text-sm text-gray-400">© 2026 OmniServe Technologies Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SuccessProvider>
          <Routes>
            {/* ── Food Store Vendor Portal ── emerald theme, /food-vendor/* */}
            <Route path="/food-vendor" element={<FoodVendorRoute><FoodVendorLayout /></FoodVendorRoute>}>
              <Route path="dashboard" element={<VendorOverview />} />
              <Route path="orders" element={<VendorOrders />} />
              <Route path="products" element={<VendorProducts />} />
              <Route path="store-settings" element={<VendorStoreSettings />} />
              <Route path="reviews" element={<VendorReviews />} />
              <Route path="earnings" element={<VendorEarnings />} />
              <Route path="notifications" element={<VendorNotifications />} />
              <Route path="support" element={<div className="text-white p-6"><h1 className="text-2xl font-bold">Support</h1><p className="text-emerald-400 mt-2">Contact support at support@omniserve.in</p></div>} />
              <Route index element={<Navigate to="/food-vendor/dashboard" />} />
              <Route path="*" element={<Navigate to="/food-vendor/dashboard" />} />
            </Route>

            {/* ── Legacy /vendor/* redirect → /food-vendor/* ── */}
            <Route path="/vendor" element={<Navigate to="/food-vendor/dashboard" replace />} />
            <Route path="/vendor/*" element={<Navigate to="/food-vendor/dashboard" replace />} />

            {/* ── Grocery Store Vendor Portal ── blue theme, /grocery-vendor/* */}
            <Route path="/grocery-vendor" element={<GroceryVendorRoute><GroceryVendorLayout /></GroceryVendorRoute>}>
              <Route path="dashboard" element={<GroceryVendorOverview />} />
              <Route path="orders" element={<GroceryVendorOrders />} />
              <Route path="products" element={<GroceryVendorProducts />} />
              <Route path="store-settings" element={<GroceryVendorStoreSettings />} />
              <Route path="reviews" element={<GroceryVendorReviews />} />
              <Route path="earnings" element={<GroceryVendorEarnings />} />
              <Route path="notifications" element={<GroceryVendorNotifications />} />
              <Route path="support" element={<div className="text-white p-6 bg-blue-950 min-h-screen"><h1 className="text-2xl font-bold">Support</h1><p className="text-blue-400 mt-2">Contact support at support@omniserve.in</p></div>} />
              <Route index element={<Navigate to="/grocery-vendor/dashboard" />} />
              <Route path="*" element={<Navigate to="/grocery-vendor/dashboard" />} />
            </Route>

            {/* ── Customer Care ── */}
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

            {/* ── Super Admin ── */}
            <Route path="/admin/super" element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
              <Route index element={<SuperAdminOverview />} />
              <Route path="admins" element={<AdminManagement />} />
              <Route path="commission" element={<CommissionSettings />} />
              <Route path="services" element={<ServiceConfiguration />} />
              <Route path="settings" element={<PlatformSettings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="logs" element={<AuditLogs />} />
              <Route path="health" element={<SystemHealth />} />
              <Route path="*" element={<Navigate to="/admin/super" />} />
            </Route>

            {/* ── Service Worker Dashboard ── */}
            <Route path="/worker/dashboard" element={<ProtectedRoute><ServiceWorkerDashboard /></ProtectedRoute>} />

            {/* ── Driver Dashboard ── */}
            <Route path="/driver/dashboard" element={<ProtectedRoute><DriverDashboard /></ProtectedRoute>} />

            {/* ── Main site ── */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/food" element={<FoodGrocery type="food" />} />
              <Route path="/grocery" element={<FoodGrocery type="grocery" />} />
              <Route path="/rides" element={<RideHailing />} />
              <Route path="/services" element={<HomeServices />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Wallet Coming Soon</h1></div></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold">Orders Coming Soon</h1></div></ProtectedRoute>} />

              {/* Regular Admin */}
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
    </Router>
  );
}
