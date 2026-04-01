import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, ChevronDown, X, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  status: 'Available' | 'Out of Stock' | 'Disabled';
  description: string;
}

const initialProducts: Product[] = [
  { id: 'G001', name: 'Amul Milk', category: 'Dairy & Eggs', price: 62, stock: 80, unit: '1L Packet', status: 'Available', description: 'Full cream toned milk' },
  { id: 'G002', name: 'Basmati Rice', category: 'Grains & Pulses', price: 320, stock: 25, unit: '5kg Bag', status: 'Available', description: 'Premium aged basmati rice' },
  { id: 'G003', name: 'Fresh Tomatoes', category: 'Fruits & Vegetables', price: 45, stock: 30, unit: '1kg', status: 'Available', description: 'Farm-fresh ripe tomatoes' },
  { id: 'G004', name: 'Amul Butter', category: 'Dairy & Eggs', price: 245, stock: 20, unit: '500g', status: 'Available', description: 'Pasteurised table butter' },
  { id: 'G005', name: 'Brown Bread', category: 'Bakery', price: 55, stock: 0, unit: 'Loaf', status: 'Out of Stock', description: 'Whole wheat brown bread' },
  { id: 'G006', name: 'Toor Dal', category: 'Grains & Pulses', price: 175, stock: 40, unit: '1kg', status: 'Available', description: 'Premium yellow pigeon peas' },
  { id: 'G007', name: 'Eggs (Farm Fresh)', category: 'Dairy & Eggs', price: 99, stock: 60, unit: '12 pack', status: 'Available', description: 'Farm-fresh eggs' },
  { id: 'G008', name: 'Colgate Toothpaste', category: 'Personal Care', price: 80, stock: 0, unit: '150g', status: 'Disabled', description: 'Strong teeth formula' },
];

const categories = ['All', 'Fruits & Vegetables', 'Dairy & Eggs', 'Grains & Pulses', 'Bakery', 'Beverages', 'Snacks', 'Personal Care', 'Meat & Fish'];

const statusBadge: Record<string, string> = {
  Available: 'bg-green-500/20 text-green-400',
  'Out of Stock': 'bg-red-500/20 text-red-400',
  Disabled: 'bg-slate-500/20 text-slate-400',
};

const ProductModal: React.FC<{ product: Product | null; onClose: () => void; onSave: (p: Product) => void }> = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState<Product>(product || { id: `G${Date.now()}`, name: '', category: 'Fruits & Vegetables', price: 0, stock: 0, unit: '1kg', status: 'Available', description: '' });
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-blue-900 border border-blue-700 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-blue-800">
          <h2 className="text-white font-bold text-lg">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="text-blue-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Product Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Amul Milk" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-blue-400 text-xs mb-1 block">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-blue-400 text-xs mb-1 block">Unit</label>
              <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 1kg, 500ml" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-blue-400 text-xs mb-1 block">Price (₹)</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-blue-400 text-xs mb-1 block">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))}
                className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Available</option><option>Out of Stock</option><option>Disabled</option>
            </select>
          </div>
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 bg-blue-800 hover:bg-blue-700 text-blue-300 rounded-xl text-sm">Cancel</button>
            <button onClick={() => { onSave(form); onClose(); }} className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm">
              {product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GroceryVendorProducts: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [modal, setModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null });

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'All' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const saveProduct = (p: Product) => setProducts(prev => prev.find(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [...prev, p]);
  const toggleStatus = (id: string) => setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Available' ? 'Disabled' : 'Available' } : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Products</h1>
          <p className="text-blue-400 text-sm mt-1">Manage your grocery store inventory</p>
        </div>
        <button onClick={() => setModal({ open: true, product: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Products', value: products.length, color: 'text-blue-400' },
          { label: 'Available', value: products.filter(p => p.status === 'Available').length, color: 'text-green-400' },
          { label: 'Out of Stock', value: products.filter(p => p.status === 'Out of Stock').length, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-blue-900 border border-blue-800 rounded-xl p-4">
            <p className="text-blue-500 text-xs">{s.label}</p>
            <p className={`${s.color} text-2xl font-bold mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full bg-blue-900 border border-blue-700 text-blue-100 text-sm pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-blue-600" />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            className="appearance-none bg-blue-900 border border-blue-700 text-blue-100 text-sm pl-3 pr-8 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 text-blue-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div className="bg-blue-900 border border-blue-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-blue-500 text-xs uppercase border-b border-blue-800">
                <th className="text-left px-5 py-3 font-medium">Product</th>
                <th className="text-left px-5 py-3 font-medium">Category</th>
                <th className="text-left px-5 py-3 font-medium">Unit</th>
                <th className="text-left px-5 py-3 font-medium">Price</th>
                <th className="text-left px-5 py-3 font-medium">Stock</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-blue-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-800 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{p.name}</p>
                        <p className="text-blue-500 text-xs truncate max-w-32">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-blue-300">{p.category}</td>
                  <td className="px-5 py-3.5 text-blue-300">{p.unit}</td>
                  <td className="px-5 py-3.5 text-white font-semibold">₹{p.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`font-medium ${p.stock === 0 ? 'text-red-400' : 'text-blue-300'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setModal({ open: true, product: p })} className="p-1.5 bg-blue-700/50 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-all" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toggleStatus(p.id)} className="p-1.5 bg-blue-700/50 hover:bg-blue-600 text-blue-300 hover:text-white rounded-lg transition-all">
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
