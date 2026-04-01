import React, { useState } from 'react';
import { ShoppingBag, Clock, MapPin, Phone, Save, ToggleLeft, ToggleRight } from 'lucide-react';

type StoreStatus = 'Open' | 'Closed' | 'Busy';

export const GroceryVendorStoreSettings: React.FC = () => {
  const [storeName, setStoreName] = useState("Fresh Mart Grocery");
  const [phone, setPhone] = useState('9900123456');
  const [address, setAddress] = useState('45, Malleswaram 18th Cross, Bengaluru');
  const [openTime, setOpenTime] = useState('07:00');
  const [closeTime, setCloseTime] = useState('22:00');
  const [deliveryRadius, setDeliveryRadius] = useState('8');
  const [minOrder, setMinOrder] = useState('200');
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('Open');
  const [saved, setSaved] = useState(false);

  const statusOptions: StoreStatus[] = ['Open', 'Closed', 'Busy'];
  const statusColor: Record<StoreStatus, string> = {
    Open: 'bg-blue-500 text-white',
    Closed: 'bg-red-500/20 text-red-400',
    Busy: 'bg-amber-500/20 text-amber-400',
  };

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-white text-2xl font-bold">Store Settings</h1>
        <p className="text-blue-400 text-sm mt-1">Manage your grocery store information and preferences</p>
      </div>

      <div className="bg-blue-900 border border-blue-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-semibold">Store Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Store Name</label>
            <input value={storeName} onChange={e => setStoreName(e.target.value)}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Phone Number</label>
            <div className="flex gap-2">
              <span className="bg-blue-800 border border-blue-700 text-blue-300 text-sm px-3 py-2.5 rounded-xl">+91</span>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="flex-1 bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-blue-400 text-xs mb-1 block">Store Address</label>
          <input value={address} onChange={e => setAddress(e.target.value)}
            className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="bg-blue-900 border border-blue-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="text-white font-semibold">Operating Hours</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="text-blue-400 text-xs mb-1 block">Opening Time</label>
            <input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label className="text-blue-400 text-xs mb-1 block">Closing Time</label>
            <input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Delivery Radius (km)</label>
            <input type="number" value={deliveryRadius} onChange={e => setDeliveryRadius(e.target.value)}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="text-blue-400 text-xs mb-1 block">Min. Order (₹)</label>
            <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)}
              className="w-full bg-blue-800 border border-blue-700 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      <div className="bg-blue-900 border border-blue-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Store Status</h3>
        <div className="flex gap-3 flex-wrap">
          {statusOptions.map(s => (
            <button key={s} onClick={() => setStoreStatus(s)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${storeStatus === s ? statusColor[s] : 'bg-blue-800 text-blue-400 border border-blue-700'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>
        <Save className="w-4 h-4" />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  );
};
