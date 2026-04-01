import React, { useState } from 'react';
import { Store, Clock, MapPin, Phone, Camera, Save, ToggleLeft, ToggleRight } from 'lucide-react';

type StoreStatus = 'Open' | 'Closed' | 'Busy';

export const VendorStoreSettings: React.FC = () => {
  const [storeName, setStoreName] = useState("Bob's Burgers");
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('12, BTM Layout 2nd Stage, Bengaluru');
  const [openTime, setOpenTime] = useState('10:00');
  const [closeTime, setCloseTime] = useState('23:00');
  const [deliveryRadius, setDeliveryRadius] = useState('5');
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('Open');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const statusOptions: StoreStatus[] = ['Open', 'Closed', 'Busy'];
  const statusColor: Record<StoreStatus, string> = {
    Open: 'bg-emerald-500 text-white',
    Closed: 'bg-red-500/20 text-red-400',
    Busy: 'bg-amber-500/20 text-amber-400',
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-white text-2xl font-bold">Store Settings</h1>
        <p className="text-emerald-400 text-sm mt-1">Manage your store profile and availability</p>
      </div>

      {/* Store Availability */}
      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Store Availability</h3>
        <div className="flex gap-3">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setStoreStatus(s)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${storeStatus === s ? statusColor[s] : 'bg-emerald-800 text-emerald-400 hover:bg-emerald-700'}`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="text-emerald-500 text-xs mt-3">Current status: <span className={`font-semibold ${storeStatus === 'Open' ? 'text-emerald-400' : storeStatus === 'Busy' ? 'text-amber-400' : 'text-red-400'}`}>{storeStatus}</span></p>
      </div>

      {/* Store Logo */}
      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Store Logo</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-emerald-800 rounded-2xl flex items-center justify-center text-3xl font-bold text-emerald-400 border-2 border-emerald-700">
            B
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 text-sm rounded-xl transition-colors border border-emerald-700">
              <Camera className="w-4 h-4" /> Upload Logo
            </button>
            <p className="text-emerald-600 text-xs mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>
      </div>

      {/* Store Info */}
      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold">Store Information</h3>

        <div>
          <label className="text-emerald-400 text-xs mb-1.5 flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /> Store Name</label>
          <input value={storeName} onChange={e => setStoreName(e.target.value)}
            className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="text-emerald-400 text-xs mb-1.5 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Phone Number</label>
          <input value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div>
          <label className="text-emerald-400 text-xs mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Address</label>
          <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
            className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
        </div>

        <div>
          <label className="text-emerald-400 text-xs mb-1.5 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Delivery Radius (km)</label>
          <input type="number" value={deliveryRadius} onChange={e => setDeliveryRadius(e.target.value)}
            className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>
      </div>

      {/* Opening Hours */}
      <div className="bg-emerald-900 border border-emerald-800 rounded-xl p-5 space-y-4">
        <h3 className="text-white font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Opening Hours</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-emerald-400 text-xs mb-1.5 block">Opens At</label>
            <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)}
              className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-emerald-400 text-xs mb-1.5 block">Closes At</label>
            <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)}
              className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="p-3 bg-emerald-800/50 rounded-xl border border-emerald-700">
          <p className="text-emerald-400 text-sm">Current Hours: <span className="text-white font-medium">{openTime} – {closeTime}</span></p>
        </div>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all ${saved ? 'bg-green-500' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
        <Save className="w-4 h-4" />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
};
