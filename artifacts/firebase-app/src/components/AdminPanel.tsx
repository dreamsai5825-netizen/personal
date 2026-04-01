import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Link, Routes, Route, useNavigate, Outlet, NavLink } from 'react-router-dom';
import { OrderManagement } from './admin/OrderManagement';
import { RideManagement } from './admin/RideManagement';
import { VendorManagement } from './admin/VendorManagement';
import { ServiceBookingMonitoring } from './admin/ServiceBookingMonitoring';
import { DeliveryPartnerManagement } from './admin/DeliveryPartnerManagement';
import { DriverManagement } from './admin/DriverManagement';

const adminLinks = [
  { to: 'orders', label: 'Order Management' },
  { to: 'rides', label: 'Ride Management' },
  { to: 'vendors', label: 'Vendor Management' },
  { to: 'services', label: 'Service Booking Monitoring' },
  { to: 'delivery-partners', label: 'Delivery Partner Management' },
  { to: 'drivers', label: 'Driver Management' },
];

export const AdminPanel: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return <div className="p-8">Access denied.</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r p-6 flex flex-col gap-2">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        {adminLinks.map(link => (
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
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
