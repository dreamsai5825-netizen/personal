import React, { useEffect, useState } from 'react';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Percent, ChevronRight, Store, MapPin } from 'lucide-react';

interface CommissionRate {
  id: string;
  service_type: string;
  label: string;
  percentage: number;
  icon: string;
}

const DEFAULT_COMMISSIONS: CommissionRate[] = [
  { id: 'food', service_type: 'food', label: 'Food Order Commission', percentage: 20, icon: '🍕' },
  { id: 'grocery', service_type: 'grocery', label: 'Grocery Order Commission', percentage: 15, icon: '🛒' },
  { id: 'ride', service_type: 'ride', label: 'Ride Commission', percentage: 18, icon: '🚗' },
  { id: 'service', service_type: 'service', label: 'Home Service Commission', percentage: 25, icon: '🔧' },
];

const vendorCommissions = [
  { vendorId: 'V001', name: "Raj's Kitchen", type: 'Food', customRate: 18 },
  { vendorId: 'V002', name: 'Fresh Farms', type: 'Grocery', customRate: 12 },
  { vendorId: 'V003', name: 'SpeedyBike', type: 'Ride', customRate: 15 },
];

const cityCommissions = [
  { city: 'Bangalore', food: 20, grocery: 15, ride: 18 },
  { city: 'Mumbai', food: 22, grocery: 17, ride: 20 },
  { city: 'Delhi', food: 19, grocery: 14, ride: 17 },
  { city: 'Chennai', food: 21, grocery: 16, ride: 19 },
];

export const CommissionSettings: React.FC = () => {
  const [commissions, setCommissions] = useState<CommissionRate[]>(DEFAULT_COMMISSIONS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'global' | 'vendor' | 'city'>('global');

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, 'commissions'));
        if (snap.size > 0) {
          const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as CommissionRate));
          setCommissions(data);
        }
      } catch (e) {}
    };
    fetch();
  }, []);

  const handleChange = (id: string, value: number) => {
    setCommissions(prev => prev.map(c => c.id === id ? { ...c, percentage: value } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(commissions.map(c => setDoc(doc(db, 'commissions', c.id), { service_type: c.service_type, percentage: c.percentage, updated_at: new Date().toISOString() })));
    } catch (e) {}
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-bold">Commission Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Configure platform commission rates per service type</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1 mb-6 w-fit">
        {([['global', 'Global Rates'], ['vendor', 'By Vendor'], ['city', 'By City']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'global' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {commissions.map(c => (
              <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{c.label}</p>
                      <p className="text-gray-500 text-xs capitalize">{c.service_type} service</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-orange-400 font-bold text-2xl">
                    {c.percentage}<Percent className="w-5 h-5" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span><span>50%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    value={c.percentage}
                    onChange={e => handleChange(c.id, Number(e.target.value))}
                    className="w-full accent-orange-500"
                  />
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={c.percentage}
                      onChange={e => handleChange(c.id, Number(e.target.value))}
                      className="w-20 bg-gray-800 border border-gray-700 text-white px-3 py-1.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center"
                    />
                    <span className="text-gray-400 text-sm">% commission</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Commission Rates'}
          </button>
        </>
      )}

      {activeTab === 'vendor' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
            <Store className="w-4 h-4 text-orange-400" />
            <span className="text-white font-medium text-sm">Vendor-Specific Commissions</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {['Vendor ID', 'Vendor Name', 'Service Type', 'Custom Rate', 'Actions'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendorCommissions.map(v => (
                <tr key={v.vendorId} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 text-gray-500 text-sm font-mono">{v.vendorId}</td>
                  <td className="px-5 py-3 text-white text-sm">{v.name}</td>
                  <td className="px-5 py-3 text-gray-300 text-sm">{v.type}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <input type="number" defaultValue={v.customRate} className="w-16 bg-gray-800 border border-gray-700 text-white px-2 py-1 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500" />
                      <span className="text-gray-400 text-sm">%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button className="text-orange-400 hover:text-orange-300 text-xs font-medium flex items-center gap-1">
                      Save <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'city' && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span className="text-white font-medium text-sm">City-Based Commissions</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                {['City', 'Food %', 'Grocery %', 'Ride %', 'Actions'].map(h => (
                  <th key={h} className="text-left text-gray-400 text-xs font-semibold uppercase tracking-wide px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cityCommissions.map(c => (
                <tr key={c.city} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="px-5 py-3 text-white text-sm font-medium">{c.city}</td>
                  {['food', 'grocery', 'ride'].map(t => (
                    <td key={t} className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <input type="number" defaultValue={(c as any)[t]} className="w-14 bg-gray-800 border border-gray-700 text-white px-2 py-1 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        <span className="text-gray-400 text-sm">%</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-5 py-3">
                    <button className="text-orange-400 hover:text-orange-300 text-xs font-medium flex items-center gap-1">
                      Save <ChevronRight className="w-3 h-3" />
                    </button>
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
