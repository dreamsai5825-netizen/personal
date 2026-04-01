import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Bell, UserCircle } from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/overview', label: 'Overview' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/rides', label: 'Rides' },
  { to: '/admin/vendors', label: 'Vendors' },
  { to: '/admin/service-bookings', label: 'Service Bookings' },
  { to: '/admin/delivery-partners', label: 'Delivery Partners' },
  { to: '/admin/drivers', label: 'Drivers' },
];

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-8">Admin Dashboard</h2>
        {sidebarLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded font-medium mb-2 transition-colors ${isActive ? 'bg-orange-500 text-white' : 'text-gray-700 hover:bg-orange-100'}`
            }
            end
          >
            {link.label}
          </NavLink>
        ))}
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="flex items-center justify-between bg-white border-b px-8 py-4">
          <div className="flex-1 max-w-lg">
            <input
              className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Search..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-500" />
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1">3</span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <UserCircle className="w-8 h-8 text-gray-400" />
              <span className="font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
