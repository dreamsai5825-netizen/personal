import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Plus, Edit2, Trash2, Ban, Search, X, ChevronDown } from 'lucide-react';

type AdminRole = 'super_admin' | 'system_admin' | 'platform_owner' | 'operations_admin' | 'customer_care_admin' | 'verification_admin' | 'finance_admin';
type AdminStatus = 'active' | 'disabled';

interface AdminRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
}

const ROLES: AdminRole[] = ['super_admin', 'system_admin', 'platform_owner', 'operations_admin', 'customer_care_admin', 'verification_admin', 'finance_admin'];

const roleLabel = (r: AdminRole) => r.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const roleBadge = (role: AdminRole) => {
  const map: Record<AdminRole, string> = {
    super_admin: 'bg-red-500/20 text-red-400',
    system_admin: 'bg-orange-500/20 text-orange-400',
    platform_owner: 'bg-purple-500/20 text-purple-400',
    operations_admin: 'bg-blue-500/20 text-blue-400',
    customer_care_admin: 'bg-cyan-500/20 text-cyan-400',
    verification_admin: 'bg-yellow-500/20 text-yellow-400',
    finance_admin: 'bg-green-500/20 text-green-400',
  };
  return map[role] || 'bg-gray-500/20 text-gray-400';
};

const DEMO_ADMINS: AdminRecord[] = [
  { id: '1', name: 'Rahul Sharma', email: 'rahul@omni.com', role: 'super_admin', status: 'active', createdAt: '2024-01-10' },
  { id: '2', name: 'Priya Singh', email: 'priya@omni.com', role: 'operations_admin', status: 'active', createdAt: '2024-02-15' },
  { id: '3', name: 'Amit Kumar', email: 'amit@omni.com', role: 'finance_admin', status: 'active', createdAt: '2024-03-20' },
  { id: '4', name: 'Sneha Patel', email: 'sneha@omni.com', role: 'customer_care_admin', status: 'disabled', createdAt: '2024-04-05' },
  { id: '5', name: 'Vikram Nair', email: 'vikram@omni.com', role: 'verification_admin', status: 'active', createdAt: '2024-05-12' },
];

const emptyForm = { name: '', email: '', role: 'operations_admin' as AdminRole, status: 'active' as AdminStatus };

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminRecord[]>(DEMO_ADMINS);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const snap = await getDocs(collection(db, 'admins'));
        if (snap.size > 0) {
          setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminRecord)));
        }
      } catch (e) {}
    };
    fetchAdmins();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (admin: AdminRecord) => {
    setEditTarget(admin);
    setForm({ name: admin.name, email: admin.email, role: admin.role, status: admin.status });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    try {
      if (editTarget) {
        await updateDoc(doc(db, 'admins', editTarget.id), { ...form });
        setAdmins(prev => prev.map(a => a.id === editTarget.id ? { ...a, ...form } : a));
      } else {
        const newAdmin = { ...form, createdAt: new Date().toISOString().split('T')[0] };
        const ref = await addDoc(collection(db, 'admins'), newAdmin);
        setAdmins(prev => [...prev, { id: ref.id, ...newAdmin }]);
      }
    } catch (e) {
      if (editTarget) {
        setAdmins(prev => prev.map(a => a.id === editTarget.id ? { ...a, ...form } : a));
      } else {
        setAdmins(prev => [...prev, { id: Date.now().toString(), ...form, createdAt: new Date().toISOString().split('T')[0] }]);
      }
    }
    setModalOpen(false);
  };

  const handleDisable = async (id: string) => {
    try { await updateDoc(doc(db, 'admins', id), { status: 'disabled' }); } catch (e) {}
    setAdmins(prev => prev.map(a => a.id === id ? { ...a, status: 'disabled' } : a));
  };

  const handleDelete = async (id: string) => {
    try { await deleteDoc(doc(db, 'admins', id)); } catch (e) {}
    setAdmins(prev => prev.filter(a => a.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.role.includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Admin Management</h1>
          <p className="text-gray-400 text-sm mt-1">Manage platform administrators and their roles</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Admin
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search admins by name, email or role..."
          className="w-full bg-gray-900 border border-gray-700 text-gray-200 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-800/50">
              {['Admin ID', 'Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(admin => (
              <tr key={admin.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                <td className="px-5 py-3 text-gray-500 text-sm font-mono">#{admin.id.slice(0, 6)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center text-orange-400 font-semibold text-sm">
                      {admin.name.charAt(0)}
                    </div>
                    <span className="text-white text-sm font-medium">{admin.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-300 text-sm">{admin.email}</td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleBadge(admin.role)}`}>
                    {roleLabel(admin.role)}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${admin.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-400 text-sm">{admin.createdAt}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(admin)} className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {admin.status === 'active' && (
                      <button onClick={() => handleDisable(admin.id)} className="p-1.5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-lg transition-colors">
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setDeleteConfirm(admin.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center text-gray-500 py-12">No admins found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">{editTarget ? 'Edit Admin' : 'Create Admin'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="admin@omni.com" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Role</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as AdminRole }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {ROLES.map(r => <option key={r} value={r}>{roleLabel(r)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as AdminStatus }))}
                  className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors">
                {editTarget ? 'Save Changes' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-bold mb-2">Delete Admin?</h3>
            <p className="text-gray-400 text-sm mb-6">This action cannot be undone. The admin will lose all access.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
