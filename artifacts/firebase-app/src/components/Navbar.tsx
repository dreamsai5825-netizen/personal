import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  MapPin, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  History,
  HelpCircle,
  Wallet
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Food', path: '/food' },
    { label: 'Grocery', path: '/grocery' },
    { label: 'Services', path: '/services' },
    { label: 'Rides', path: '/rides' },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                O
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">OmniServe</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-orange-500",
                    location.pathname === item.path ? "text-orange-500" : "text-gray-600"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-600 border border-gray-100">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Indiranagar, Bangalore</span>
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/cart" className="p-2 text-gray-600 hover:bg-gray-50 rounded-full relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full">2</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      {profile?.profileImage ? (
                        <img src={profile.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{profile?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/wallet" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <Wallet className="w-4 h-4" /> Wallet (₹{profile?.walletBalance || 0})
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <History className="w-4 h-4" /> Order History
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-50 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                Login
              </Link>
            )}

            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};
