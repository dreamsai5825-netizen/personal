import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User as UserIcon, 
  MapPin, 
  Menu, 
  X, 
  LogOut, 
  LayoutDashboard,
  History,
  HelpCircle,
  Wallet,
  Loader2,
  Navigation
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { cn } from '../lib/utils';
import { usePlatformContent } from '../platformContent';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

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

const UserMapModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (address: string) => void; initialAddress: string }> = ({ isOpen, onClose, onSave, initialAddress }) => {
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
    if (isOpen && initialAddress) {
      setCurrentAddr(initialAddress);
    }
  }, [isOpen, initialAddress]);

  if (!isOpen) return null;

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      if (GOOGLE_MAPS_API_KEY) {
        const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const addressComponents = data.results[0].address_components;
          const locality = addressComponents.find((c: any) => c.types.includes('locality'))?.long_name;
          const sublocality = addressComponents.find((c: any) => c.types.includes('sublocality'))?.long_name;
          
          if (sublocality && locality) {
            setCurrentAddr(`${sublocality}, ${locality}`);
          } else if (locality) {
            setCurrentAddr(locality);
          } else {
            const shortAddress = data.results[0].formatted_address.split(',').slice(0, 2).join(',');
            setCurrentAddr(shortAddress);
          }
        }
      } else {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data.address) {
          const area = data.address.suburb || data.address.neighbourhood || data.address.city_district;
          const city = data.address.city || data.address.town;
          if (area && city) setCurrentAddr(`${area}, ${city}`);
          else if (city) setCurrentAddr(city);
        }
      }
    } catch (e) {
      setCurrentAddr(`Selected: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      setCurrentAddr("Fetching address...");
      getAddressFromCoords(lat, lng);
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
          
          if (place.name && place.formatted_address) {
             setCurrentAddr(`${place.name}, ${place.formatted_address.split(',')[0]}`);
          } else {
             setCurrentAddr(place.formatted_address || place.name || '');
          }
          
          mapRef.current?.panTo(newPos);
          mapRef.current?.setZoom(15);
        }
      }
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setCurrentAddr("Locating...");
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
          getAddressFromCoords(newPos.lat, newPos.lng);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get your location. Please check browser permissions.");
          setIsLocating(false);
          setCurrentAddr(initialAddress);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser");
      setIsLocating(false);
      setCurrentAddr(initialAddress);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh] max-h-[600px] shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10 shrink-0">
          <h2 className="text-gray-900 font-bold text-lg">Set Delivery Location</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 relative bg-gray-100">
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
                    placeholder="Search location..."
                    className="w-full box-border px-4 py-3 bg-white border border-gray-200 shadow-lg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </StandaloneSearchBox>
              </div>
            </GoogleMap>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          )}
          
          <div className="absolute top-4 right-4 z-20">
            <button 
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="p-3 bg-white hover:bg-gray-50 text-gray-700 rounded-full shadow-lg transition-colors border border-gray-200 disabled:opacity-50 flex items-center justify-center"
              title="Use current location"
            >
              <Navigation className={`w-5 h-5 ${isLocating ? 'animate-pulse text-orange-500' : ''}`} />
            </button>
          </div>
        </div>

        <div className="p-5 bg-white border-t border-gray-100 shrink-0 space-y-4 z-20 relative">
          <div>
            <label className="text-gray-500 text-xs font-medium mb-1.5 block uppercase tracking-wider">Selected Address</label>
            <input 
              value={currentAddr} 
              onChange={e => setCurrentAddr(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all" 
              placeholder="Drag map or type address..."
            />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition-colors">
              Cancel
            </button>
            <button 
              onClick={() => { onSave(currentAddr); onClose(); }} 
              className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orange-200"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Navbar: React.FC = () => {
  const { user, profile, isAdmin } = useAuth();
  const { content } = usePlatformContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(() => {
    return localStorage.getItem('user_location') || content.branding.locationLabel || 'Select Location';
  });

  const handleLocationSave = (addr: string) => {
    setCurrentLocation(addr);
    localStorage.setItem('user_location', addr);
  };
  const [mapOpen, setMapOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logoLabel = content.branding.appName.charAt(0).toUpperCase() || 'O';

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Food', path: '/food' },
    { label: 'Grocery', path: '/grocery' },
    { label: 'Services', path: '/services' },
    { label: 'Rides', path: '/rides' },
  ];

  return (
    <>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                {content.branding.logoUrl ? (
                  <img src={content.branding.logoUrl} alt={content.branding.appName} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                ) : (
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {logoLabel}
                  </div>
                )}
                <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">{content.branding.appName}</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-orange-500",
                      location.pathname === item.path ? "text-orange-500" : "text-gray-600"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setMapOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-xs font-medium text-gray-600 border border-gray-100 transition-colors max-w-[200px]"
                title="Choose location on map"
              >
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">{currentLocation}</span>
              </button>

              {user ? (
                <div className="flex items-center gap-3">
                <Link to="/cart" className="p-2 text-gray-600 hover:bg-gray-50 rounded-full relative">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full">2</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-colors">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                      {profile?.profileImage ? (
                        <img src={profile.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <UserIcon className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 py-2">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{profile?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                      <Link to="/wallet" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <Wallet className="w-4 h-4" /> Wallet (₹{profile?.walletBalance || 0})
                      </Link>
                      <Link to="/orders" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        <History className="w-4 h-4" /> Order History
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </Link>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-50 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-orange-500 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                Login
              </Link>
            )}

            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
    <UserMapModal 
      isOpen={mapOpen} 
      onClose={() => setMapOpen(false)} 
      onSave={handleLocationSave} 
      initialAddress={currentLocation} 
    />
    </>
  );
};
