import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Percent, Settings2, SlidersHorizontal,
  BarChart3, ScrollText, Activity, LogOut, Bell, Search, ChevronDown, Menu, X, Shield
} from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../AuthContext';

const navItems = [
  { to: '/admin/super', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/super/admins', label: 'Admins', icon: Users },
  { to: '/admin/super/commission', label: 'Commission Settings', icon: Percent },
  { to: '/admin/super/services', label: 'Service Configuration', icon: SlidersHorizontal },
  { to: '/admin/super/settings', label: 'Platform Settings', icon: Settings2 },
  { to: '/admin/super/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/super/logs', label: 'Audit Logs', icon: ScrollText },
  { to: '/admin/super/health', label: 'System Health', icon: Activity },
];

export const SuperAdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-950 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm leading-tight">Super Admin</div>
              <div className="text-orange-400 text-xs">OmniServe</div>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-gray-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Nav */}
        <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-gray-800 border border-gray-700 text-gray-200 text-sm pl-9 pr-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative text-gray-400 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 p-4">
                  <p className="text-white font-semibold mb-3">Notifications</p>
                  {[
                    { text: 'New admin account created', time: '2m ago' },
                    { text: 'Commission rate updated for Food', time: '1h ago' },
                    { text: 'System maintenance scheduled', time: '3h ago' },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-700 last:border-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-200 text-sm">{n.text}</p>
                        <p className="text-gray-500 text-xs">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-2 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile?.name?.charAt(0) || 'S'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium leading-tight">{profile?.name || 'Super Admin'}</p>
                  <p className="text-orange-400 text-xs capitalize">{(profile?.role || 'super_admin').replace('_', ' ')}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 py-2">
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 text-sm transition-colors">Profile</button>
                  <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 text-sm transition-colors">Account Settings</button>
                  <div className="border-t border-gray-700 my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 text-sm transition-colors">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
