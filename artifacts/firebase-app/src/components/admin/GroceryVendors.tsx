import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const vendorStatusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
];

export const GroceryVendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      let q = collection(db, 'vendors');
      let allVendors = (await getDocs(q)).docs.map((doc, idx) => ({ ...doc.data(), id: doc.id, serial: idx + 1 }));
      allVendors = allVendors.filter(v => v.type === 'grocery');
      if (search) allVendors = allVendors.filter(v => (v.vendorId || v.id).toLowerCase().includes(search.toLowerCase()));
      if (status) allVendors = allVendors.filter(v => v.status === status);
      if (date) allVendors = allVendors.filter(v => v.createdAt && v.createdAt.startsWith(date));
      setVendors(allVendors);
      setLoading(false);
    };
    fetchVendors();
  }, [search, status, date]);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Grocery Vendors</h2>
      {/* Filter Card */}
      <div className="flex flex-wrap gap-4 mb-6 items-end bg-gray-50 p-4 rounded-xl shadow-sm">
        <input
          className="border rounded px-3 py-2 w-48"
          placeholder="Search Vendor ID"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="border rounded px-3 py-2" value={status} onChange={e => setStatus(e.target.value)}>
          {vendorStatusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <input
          type="date"
          className="border rounded px-3 py-2"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
      </div>
      {/* Data Table */}
      {loading ? <div>Loading...</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Vendor ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-green-50 cursor-pointer">
                  <td className="border px-4 py-2">{vendor.vendorId || vendor.id}</td>
                  <td className="border px-4 py-2 capitalize">{vendor.name}</td>
                  <td className="border px-4 py-2 capitalize">{vendorStatusOptions.find(s => s.value === vendor.status)?.label || vendor.status}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-xs" onClick={() => navigate(`/admin/vendors/${vendor.id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
