import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Ticket, ShoppingBag, Car, RefreshCw,
  MessageSquare, AlertTriangle, BarChart2, LogOut,
  Bell, Search, ChevronDown, Menu, X, Headphones
} from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../AuthContext';

const navItems = [
  { to: '/admin/support', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/support/tickets', label: 'Support Tickets', icon: Ticket },
  { to: '/admin/support/order-issues', label: 'Order Issues', icon: ShoppingBag },
  { to: '/admin/support/ride-issues', label: 'Ride Issues', icon: Car },
  { to: '/admin/support/refunds', label: 'Refund Requests', icon: RefreshCw },
  { to: '/admin/support/chat', label: 'Customer Chat', icon: MessageSquare },
  { to: '/admin/support/escalations', label: 'Escalations', icon: AlertTriangle },
  { to: '/admin/support/reports', label: 'Reports', icon: BarChart2 },
];

const notifications = [
  { text: 'New high priority ticket #1208 opened', time: '2m ago' },
  { text: 'Refund #5007 awaiting approval', time: '15m ago' },
  { text: 'Customer chat escalated by agent', time: '1h ago' },
];

export const CustomerCareLayout: React.FC = () => {
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
    <div className="flex min-h-screen bg-slate-950 font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen flex-shrink-0`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm leading-tight">Customer Care</div>
              <div className="text-blue-400 text-xs">OmniServe</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-slate-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(v => !v)} className="text-slate-400 hover:text-white transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tickets, customers..."
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm pl-9 pr-4 py-2 rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setNotifOpen(v => !v)} className="relative text-slate-400 hover:text-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-4">
                  <p className="text-white font-semibold mb-3">Notifications</p>
                  {notifications.map((n, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-700 last:border-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-200 text-sm">{n.text}</p>
                        <p className="text-slate-500 text-xs">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setProfileOpen(v => !v)} className="flex items-center gap-2 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile?.name?.charAt(0) || 'C'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium leading-tight">{profile?.name || 'Support Agent'}</p>
                  <p className="text-blue-400 text-xs">Customer Care</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 py-2">
                  <button className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors">Profile</button>
                  <div className="border-t border-slate-700 my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700 text-sm transition-colors">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
