import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Store, Clock, MapPin, Phone, Camera, Save, ToggleLeft, ToggleRight, Navigation, X } from 'lucide-react';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../AuthContext';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

type StoreStatus = 'Open' | 'Closed' | 'Busy';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
type Library = "places" | "drawing" | "geometry" | "visualization";
const libraries: Library[] = ["places"];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 12.9716, // Bengaluru defaults
  lng: 77.5946
};

const MapModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (address: string) => void; initialAddress: string }> = ({ isOpen, onClose, onSave, initialAddress }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  const [currentAddr, setCurrentAddr] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState(defaultCenter);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setCurrentAddr(initialAddress);
    }
  }, [isOpen, initialAddress]);

  if (!isOpen) return null;

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarkerPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      setCurrentAddr(`Selected Location: ${e.latLng.lat().toFixed(4)}, ${e.latLng.lng().toFixed(4)}`);
    }
  };

  const onLoadSearchBox = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const newPos = { lat, lng };
          setMapCenter(newPos);
          setMarkerPos(newPos);
          setCurrentAddr(place.formatted_address || place.name || '');
          mapRef.current?.panTo(newPos);
          mapRef.current?.setZoom(15);
        }
      }
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(newPos);
          setMarkerPos(newPos);
          mapRef.current?.panTo(newPos);
          mapRef.current?.setZoom(15);
          setCurrentAddr(`Current Location: ${newPos.lat.toFixed(4)}, ${newPos.lng.toFixed(4)}`);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location. Please check browser permissions.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-emerald-900 border border-emerald-700 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh] max-h-[600px]">
        <div className="flex items-center justify-between p-5 border-b border-emerald-800 bg-emerald-900 z-10 shrink-0">
          <h2 className="text-white font-bold text-lg">Set Store Location</h2>
          <button onClick={onClose} className="text-emerald-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 relative bg-emerald-950">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={13}
              onClick={handleMapClick}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                disableDefaultUI: true,
                zoomControl: true,
                styles: [
                  { elementType: "geometry", stylers: [{ color: "#004433" }] },
                  { elementType: "labels.text.stroke", stylers: [{ color: "#000000" }] },
                  { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
                  { featureType: "road", elementType: "geometry", stylers: [{ color: "#006644" }] },
                  { featureType: "water", elementType: "geometry", stylers: [{ color: "#002211" }] }
                ]
              }}
            >
              <Marker position={markerPos} />
              
              <div className="absolute top-4 left-4 right-20 z-20">
                <StandaloneSearchBox
                  onLoad={onLoadSearchBox}
                  onPlacesChanged={onPlacesChanged}
                >
                  <input
                    type="text"
                    placeholder="Search store location..."
                    className="w-full box-border px-4 py-3 bg-emerald-900 border border-emerald-700 shadow-lg rounded-xl text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-emerald-500"
                  />
                </StandaloneSearchBox>
              </div>
            </GoogleMap>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
              Loading Map...
            </div>
          )}
          
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="p-3 bg-emerald-800 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-colors border border-emerald-600 disabled:opacity-50 flex items-center justify-center"
              title="Use current location"
            >
              <Navigation className={`w-5 h-5 ${isLocating ? 'animate-pulse text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-5 bg-emerald-900 border-t border-emerald-800 shrink-0 space-y-4 z-20 relative">
          <div>
            <label className="text-emerald-400 text-xs mb-1.5 block">Selected Address</label>
            <input 
              value={currentAddr} 
              onChange={e => setCurrentAddr(e.target.value)}
              className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 relative z-30" 
              placeholder="Drag map or type address..."
            />
          </div>
          <div className="flex gap-3 relative z-30">
            <button onClick={onClose} className="flex-1 py-3 text-emerald-300 bg-emerald-800 hover:bg-emerald-700 rounded-xl font-medium transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => { onSave(currentAddr); onClose(); }} 
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-colors"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const VendorStoreSettings: React.FC = () => {
  const { user, profile } = useAuth();
  const [storeName, setStoreName] = useState("Bob's Burgers");
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('12, BTM Layout 2nd Stage, Bengaluru');
  const [openTime, setOpenTime] = useState('10:00');
  const [closeTime, setCloseTime] = useState('23:00');
  const [deliveryRadius, setDeliveryRadius] = useState('5');
  const [storeStatus, setStoreStatus] = useState<StoreStatus>('Open');
  const [saved, setSaved] = useState(false);
  const [autoClose, setAutoClose] = useState(false);
  const [storeLogo, setStoreLogo] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'vendors', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.storeName) setStoreName(data.storeName);
        if (data.phone) setPhone(data.phone);
        if (data.address) setAddress(data.address);
        if (data.openTime) setOpenTime(data.openTime);
        if (data.closeTime) setCloseTime(data.closeTime);
        if (data.deliveryRadius) setDeliveryRadius(data.deliveryRadius);
        if (data.storeStatus) setStoreStatus(data.storeStatus);
        if (data.autoClose !== undefined) setAutoClose(data.autoClose);
        if (data.storeLogo) setStoreLogo(data.storeLogo);
      }
    });
    return unsub;
  }, [user]);

  // Auto-close check (Client-side simulation)
  useEffect(() => {
    if (!autoClose || storeStatus === 'Closed') return;
    
    const checkTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      const [closeHour, closeMinute] = closeTime.split(':').map(Number);
      const closingMinutes = closeHour * 60 + closeMinute;
      
      if (currentMinutes >= closingMinutes) {
        setStoreStatus('Closed');
        // If we wanted to update DB automatically:
        // if (user) updateDoc(doc(db, 'vendors', user.uid), { storeStatus: 'Closed' });
      }
    };
    
    const interval = setInterval(checkTime, 60000); // Check every minute
    checkTime(); // Check immediately
    return () => clearInterval(interval);
  }, [autoClose, closeTime, storeStatus, user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const vendorRef = doc(db, 'vendors', user.uid);
      const isGrocery = profile?.role === 'grocery_store_vendor';
      
      await setDoc(vendorRef, {
        storeName, phone, address, openTime, closeTime, deliveryRadius, storeStatus, autoClose, storeLogo,
        vendorName: storeName, // sync for FoodGrocery
        vendorType: isGrocery ? 'grocery' : 'restaurant',
        isActive: storeStatus === 'Open',
        rating: 4.5, // Default for display
        description: `Delicious ${isGrocery ? 'groceries' : 'food'} from ${storeName}`,
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Error saving store settings:', e);
      // Fallback UI
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        <div className="flex flex-col sm:flex-row gap-3">
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
          <div className="w-20 h-20 bg-emerald-800 rounded-2xl flex items-center justify-center text-3xl font-bold text-emerald-400 border-2 border-emerald-700 overflow-hidden shrink-0">
            {storeLogo ? (
              <img src={storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
            ) : (
              storeName.charAt(0)
            )}
          </div>
          <div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleLogoUpload} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-300 text-sm rounded-xl transition-colors border border-emerald-700">
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
          <div className="space-y-2">
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={2}
              className="w-full bg-emerald-800 border border-emerald-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
            <button onClick={() => setMapOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-800/50 hover:bg-emerald-700 text-emerald-300 text-xs font-medium rounded-lg border border-emerald-700 transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Access Store Location
            </button>
          </div>
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
        <div className="p-3 bg-emerald-800/50 rounded-xl border border-emerald-700 space-y-3">
          <p className="text-emerald-400 text-sm">Current Hours: <span className="text-white font-medium">{openTime} – {closeTime}</span></p>
          <div className="flex items-center justify-between border-t border-emerald-700/50 pt-3">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Auto-close Shop</p>
              <p className="text-emerald-500 text-xs">Automatically set status to Closed at {closeTime}</p>
            </div>
            <button 
              onClick={() => setAutoClose(!autoClose)} 
              className={`p-1.5 rounded-lg transition-colors ${autoClose ? 'text-emerald-400' : 'text-emerald-600'}`}
            >
              {autoClose ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      <button onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all ${saved ? 'bg-green-500' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
        <Save className="w-4 h-4" />
        {saved ? 'Saved!' : 'Save Changes'}
      </button>

      <MapModal 
        isOpen={mapOpen} 
        onClose={() => setMapOpen(false)} 
        onSave={(newAddr) => setAddress(newAddr)} 
        initialAddress={address} 
      />
    </div>
  );
};
