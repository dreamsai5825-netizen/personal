import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Package, Settings, Star,
  DollarSign, Bell, HeadphonesIcon, LogOut, Menu, X,
  ChevronDown, Store, ToggleLeft, ToggleRight
} from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../AuthContext';
import { foodOrderStore } from '../../lib/vendorOrderStore';

const navItems = [
  { to: '/food-vendor/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/food-vendor/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/food-vendor/products', label: 'Menu Items', icon: Package },
  { to: '/food-vendor/store-settings', label: 'Store Settings', icon: Settings },
  { to: '/food-vendor/reviews', label: 'Reviews', icon: Star },
  { to: '/food-vendor/earnings', label: 'Earnings', icon: DollarSign },
  { to: '/food-vendor/notifications', label: 'Notifications', icon: Bell },
  { to: '/food-vendor/support', label: 'Support', icon: HeadphonesIcon },
];

export const FoodVendorLayout: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(true);
  const [newCount, setNewCount] = useState(foodOrderStore.getNewCount());

  useEffect(() => {
    const unsub = foodOrderStore.subscribe(() => setNewCount(foodOrderStore.getNewCount()));
    return unsub;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-emerald-950 font-sans">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-emerald-900 border-r border-emerald-800 flex flex-col min-h-screen flex-shrink-0`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-emerald-800">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Store className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-white font-bold text-sm leading-tight truncate max-w-36">{profile?.name || 'My Store'}</div>
              <div className="text-orange-400 text-xs">Food Store Vendor</div>
            </div>
          )}
        </div>

        {sidebarOpen && (
          <div className="mx-3 my-3 p-3 bg-emerald-800/50 rounded-xl border border-emerald-700">
            <p className="text-emerald-400 text-xs mb-2">Store Status</p>
            <button
              onClick={() => setStoreOpen(v => !v)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all ${storeOpen ? 'bg-orange-500 text-white' : 'bg-red-500/20 text-red-400'}`}
            >
              {storeOpen ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {storeOpen ? 'Open' : 'Closed'}
            </button>
          </div>
        )}

        <nav className="flex-1 py-2 flex flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative ${isActive ? 'bg-orange-500 text-white' : 'text-emerald-300 hover:bg-emerald-800 hover:text-white'}`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium flex-1">{label}</span>}
              {label === 'Notifications' && newCount > 0 && (
                <span className={`bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ${sidebarOpen ? 'w-5 h-5' : 'absolute -top-1 -right-1 w-4 h-4 text-[10px]'}`}>
                  {newCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4 border-t border-emerald-800 pt-4">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-emerald-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-emerald-900 border-b border-emerald-800 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(v => !v)} className="text-emerald-400 hover:text-white transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${storeOpen ? 'bg-orange-400' : 'bg-red-400'}`} />
              <span className="text-emerald-300 text-sm">{storeOpen ? 'Store is Open' : 'Store is Closed'}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <Store className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-orange-300 text-xs font-medium">Food Store Vendor</span>
            </div>
            <div className="relative">
              <button onClick={() => setProfileOpen(v => !v)} className="flex items-center gap-2 hover:bg-emerald-800 px-3 py-1.5 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile?.name?.charAt(0) || 'F'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium leading-tight">{profile?.name || 'Food Vendor'}</p>
                  <p className="text-orange-400 text-xs">Food Store Vendor</p>
                </div>
                <ChevronDown className="w-4 h-4 text-emerald-400 hidden md:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-emerald-800 border border-emerald-700 rounded-xl shadow-2xl z-50 py-2">
                  <button className="w-full text-left px-4 py-2 text-emerald-200 hover:text-white hover:bg-emerald-700 text-sm">Profile</button>
                  <div className="border-t border-emerald-700 my-1" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-emerald-700 text-sm">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 bg-emerald-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
