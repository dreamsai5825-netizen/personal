import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, ChevronDown, X, Package, Upload } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../AuthContext';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Available' | 'Out of Stock' | 'Disabled';
  description: string;
  image?: string;
  vendorId?: string;
}

const initialProducts: Product[] = [];

const categories = ['All', 'Fast Food', 'Pizza', 'Rice', 'Salads', 'Wraps', 'Beverages'];

const statusBadge: Record<string, string> = {
  Available: 'bg-emerald-500/20 text-emerald-400',
  'Out of Stock': 'bg-red-500/20 text-red-400',
  Disabled: 'bg-slate-500/20 text-slate-400',
};

const ProductModal: React.FC<{ product: Product | null; onClose: () => void; onSave: (p: Product) => void }> = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState<Product>(product || { id: `P${Date.now()}`, name: '', category: 'Fast Food', price: 0, stock: 0, status: 'Available', description: '', image: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(f => ({ ...f, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isFormValid = form.name && form.price > 0 && form.image;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-emerald-900 border border-emerald-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-emerald-800 sticky top-0 bg-emerald-900 z-10">
          <h2 className="text-white font-bold text-lg">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-emerald-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          
          <div className="flex flex-col items-center justify-center mb-4">
            <div 
              className="w-24 h-24 rounded-xl border-2 border-dashed border-emerald-600 bg-emerald-800/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
              onClick={() => fileInputRef.current?.click()}
            >
              {form.image ? (
                <img src={form.image} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="w-6 h-6 text-emerald-400 mb-1" />
                  <span className="text-emerald-500 text-[10px] font-medium uppercase tracking-wider">Upload</span>
                </>
              )}
            </div>
            {!form.image && <p className="text-red-400 text-xs mt-2">* Product image is required</p>}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>

          <div>
            <label className="text-emerald-400 text-xs mb-1 block">Product Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Chicken Burger" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-emerald-400 text-xs mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-emerald-400 text-xs mb-1 block">Price (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-emerald-400 text-xs mb-1 block">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-emerald-400 text-xs mb-1 block">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Available</option><option>Out of Stock</option><option>Disabled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-emerald-400 text-xs mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Brief product description" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 rounded-xl text-sm transition-colors">Cancel</button>
            <button 
              onClick={() => { onSave(form); onClose(); }} 
              disabled={!isFormValid}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors"
            >
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VendorProducts: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'products'), where('vendorId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const liveProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(liveProducts);
    });
    return unsub;
  }, [user]);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const saveProduct = async (p: Product) => {
    if (!user) return;
    try {
      const prodToSave = { ...p, vendorId: user.uid };
      await setDoc(doc(db, 'products', p.id), prodToSave);
    } catch (e) {
      console.error(e);
      // Fallback optimistic update
      const prodToSave = { ...p, vendorId: user.uid };
      setProducts(prev => prev.find(x => x.id === p.id) ? prev.map(x => x.id === p.id ? prodToSave : x) : [...prev, prodToSave]);
    }
  };

  const toggleStatus = async (id: string) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const newStatus = p.status === 'Available' ? 'Disabled' : 'Available';
    try {
      await updateDoc(doc(db, 'products', id), { status: newStatus });
    } catch (e) {
      console.error(e);
      setProducts(prev => prev.map(x => x.id === id ? { ...x, status: newStatus } : x));
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error(e);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Products / Menu</h1>
          <p className="text-emerald-400 text-sm mt-1">Manage your store's products and menu items</p>
        </div>
        <button onClick={() => setModal({ open: true, product: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Products', value: products.length, color: 'text-emerald-400' },
          { label: 'Available', value: products.filter(p => p.status === 'Available').length, color: 'text-green-400' },
          { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-emerald-900 border border-emerald-800 rounded-xl p-4">
            <p className="text-emerald-500 text-xs">{s.label}</p>
            <p className={`${s.color} text-2xl font-bold mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full bg-emerald-900 border border-emerald-700 text-emerald-100 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-emerald-600" />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="appearance-none bg-emerald-900 border border-emerald-700 text-emerald-100 text-sm pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-emerald-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="bg-emerald-900 border border-emerald-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-emerald-500 text-xs uppercase border-b border-emerald-800">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-emerald-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-800 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-emerald-500 text-xs truncate max-w-32">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-emerald-300">{p.category}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">₹{p.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-400' : 'text-emerald-300'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setModal({ open: true, product: p })} className="p-1.5 bg-emerald-700/50 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-all" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleStatus(p.id)} className="p-1.5 bg-emerald-700/50 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded-lg transition-all" title="Toggle">
                        {p.status === 'Available' ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-all" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal.open && <ProductModal product={modal.product} onClose={() => setModal({ open: false, product: null })} onSave={saveProduct} />}
    </div>
  );
};
