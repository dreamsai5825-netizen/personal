import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { db, app } from '../../firebase';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { Plus, Edit2, Trash2, Ban, Search, X, ChevronDown } from 'lucide-react';

type AdminRole = 'super admin' | 'admin' | 'customerCare';
type AdminStatus = 'active' | 'disabled';

interface AdminRecord {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  createdAt: string;
}

const ROLES: AdminRole[] = ['super admin', 'admin', 'customerCare'];

const roleLabel = (r: AdminRole) => {
  if (r === 'admin') return 'Operational Admin';
  if (r === 'super admin') return 'Super Admin';
  if (r === 'customerCare') return 'Customer Care';
  return r;
};

const roleBadge = (role: AdminRole) => {
  const map: Record<AdminRole, string> = {
    'super admin': 'bg-red-500/20 text-red-400',
    'admin': 'bg-blue-500/20 text-blue-400',
    'customerCare': 'bg-cyan-500/20 text-cyan-400',
  };
  return map[role] || 'bg-gray-500/20 text-gray-400';
};

const emptyForm = { name: '', email: '', password: '', role: 'admin' as AdminRole, status: 'active' as AdminStatus };

export const AdminManagement: React.FC = () => {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AdminRecord | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', 'in', ROLES));
    const unsubscribe = onSnapshot(q, (snap) => {
      setAdmins(snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminRecord)));
    }, (error) => {
      console.error("Error fetching admins:", error);
    });

    return () => unsubscribe();
  }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setErrorMsg(null);
    setModalOpen(true);
  };

  const openEdit = (admin: AdminRecord) => {
    setEditTarget(admin);
    setForm({ name: admin.name, email: admin.email, password: '', role: admin.role, status: admin.status });
    setErrorMsg(null);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      setErrorMsg("Name and email are required");
      return;
    }
    
    setLoading(true);
    setErrorMsg(null);
    try {
      if (editTarget) {
        await updateDoc(doc(db, 'users', editTarget.id), { 
          name: form.name, 
          email: form.email, 
          role: form.role, 
          status: form.status 
        });
      } else {
        if (!form.password || form.password.length < 6) {
          setErrorMsg("Password is required and must be at least 6 characters for new admins");
          setLoading(false);
          return;
        }

        // Create secondary app to avoid signing out the current user
        const secondaryApp = initializeApp(app.options, 'SecondaryApp');
        const secondaryAuth = getAuth(secondaryApp);
        
        try {
          // Create user in Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, form.email, form.password);
          const uid = userCredential.user.uid;
          
          // Add admin record in Firestore with the auth UID
          const newAdmin = { 
            userId: uid,
            name: form.name,
            email: form.email,
            role: form.role,
            status: form.status,
            createdAt: new Date().toUTCString(),
            walletBalance: "0"
          };
          
          await setDoc(doc(db, 'users', uid), newAdmin);
          
          // Sign out and delete secondary app
          await secondaryAuth.signOut();
        } catch (authError: any) {
          setErrorMsg(authError.message || "Failed to create user in Auth");
          setLoading(false);
          return;
        }
      }
      setModalOpen(false);
    } catch (e: any) {
      console.error("Error saving admin:", e);
      setErrorMsg(e.message || "An error occurred while saving");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async (id: string) => {
    try { await updateDoc(doc(db, 'users', id), { status: 'disabled' }); } catch (e) {}
  };

  const handleDelete = async (id: string) => {
    try { 
      // Note: We can delete the Firestore doc, but deleting from Firebase Auth requires Admin SDK/Backend
      await deleteDoc(doc(db, 'users', id)); 
    } catch (e) {}
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
                  placeholder="admin@omni.com" disabled={!!editTarget} />
              </div>
              {!editTarget && (
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Temporary Password</label>
                  <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter password (min 6 chars)" />
                </div>
              )}
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
            {errorMsg && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {errorMsg}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 text-sm transition-colors" disabled={loading}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : null}
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
