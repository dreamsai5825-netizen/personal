import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { MapPin, CreditCard, Banknote, CheckCircle2, ChevronRight, Utensils, Loader2, Navigation, X } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { useSuccess } from './SuccessModal';
import { openRazorpayPayment } from '../lib/razorpay';
import { GoogleMap, useJsApiLoader, Marker, StandaloneSearchBox } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
type Library = "places" | "drawing" | "geometry" | "visualization";
const libraries: Library[] = ["places"];

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 12.9716,
  lng: 77.5946
};

const CheckoutMapModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (address: string, coords: {lat: number, lng: number}) => void; initialAddress: string }> = ({ isOpen, onClose, onSave, initialAddress }) => {
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
          setCurrentAddr(data.results[0].formatted_address);
        }
      } else {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (data.display_name) {
          setCurrentAddr(data.display_name);
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
          setCurrentAddr(place.formatted_address || place.name || '');
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
          <h2 className="text-gray-900 font-bold text-lg">Pin Exact Location</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="flex-1 relative bg-gray-100">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={mapCenter}
              zoom={15}
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
                    className="w-full box-border px-4 py-3 bg-white border border-gray-200 shadow-lg rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <label className="text-gray-500 text-xs font-medium mb-1.5 block uppercase tracking-wider">Delivery Address</label>
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
              onClick={() => { onSave(currentAddr, markerPos); onClose(); }} 
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

export const CheckoutPage = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useSuccess();
  
  const [cartData, setCartData] = useState<any>(location.state?.cartData || null);
  const [step, setStep] = useState<1 | 2>(1); // 1: Address, 2: Payment
  const [address, setAddress] = useState((profile as any)?.address || '');
  const [coords, setCoords] = useState<{lat: number, lng: number} | null>(null);
  const [orderFor, setOrderFor] = useState<'self' | 'others'>('self');
  const [otherPhone, setOtherPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [restaurantRequest, setRestaurantRequest] = useState('');
  const [deliveryRequest, setDeliveryRequest] = useState('');
  const [paymentMode, setPaymentMode] = useState<'online' | 'cod'>('online');
  const [loading, setLoading] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    if (!cartData) {
      const type = location.state?.type || 'food';
      const saved = localStorage.getItem(`cart_${type}`);
      if (saved) {
        setCartData({ cart: JSON.parse(saved), type, vendor: location.state?.vendor });
      } else {
        navigate('/'); // no cart
      }
    }
  }, [cartData, navigate, location]);

  if (!cartData) return <div className="p-20 text-center">Loading Checkout...</div>;

  const { cart, type, vendor } = cartData;
  const cartItems = Object.values(cart) as any[];
  const itemTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 40;
  const total = itemTotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!user || !vendor) return;
    setLoading(true);

    const processOrder = async (transactionId: string | null = null) => {
      try {
        const orderData = {
          userId: user.uid,
          customerName: profile?.name || 'Customer',
          customerPhone: profile?.phone || '',
          orderFor,
          recipientPhone: orderFor === 'self' ? altPhone : otherPhone,
          restaurantRequest,
          deliveryRequest,
          vendorId: vendor.vendorId,
          orderType: type,
          items: cartItems.map((item: any) => `${item.quantity}x ${item.product.name}`).join(', '),
          totalPrice: total,
          deliveryFee,
          paymentStatus: paymentMode === 'online' ? 'paid' : 'pending',
          paymentMethod: paymentMode,
          transactionId,
          orderStatus: 'New',
          createdAt: Timestamp.now(),
          deliveryAddress: address || 'Default Address',
          deliveryCoords: coords
        };

        await addDoc(collection(db, 'orders'), orderData);
        
        // Update user's default address for future if not already set
        if (address && (!profile || (profile as any).address !== address)) {
          await updateDoc(doc(db, 'users', user.uid), { address });
        }

        localStorage.removeItem(`cart_${type}`);
        showSuccess(
          'Order Placed Successfully!', 
          `Your order from ${vendor.vendorName} is being prepared.`,
          'Track Order',
          '/orders'
        );
      } catch (error) {
        console.error("Order error", error);
        alert('Failed to place order.');
      } finally {
        setLoading(false);
      }
    };

    if (paymentMode === 'online') {
      openRazorpayPayment(
        total,
        { name: profile?.name || 'Customer', email: user.email || '', phone: profile?.phone || '' },
        (response) => {
          // Success callback
          processOrder(response.razorpay_payment_id || 'test_txn_id');
        },
        (error) => {
          // Failure callback
          setLoading(false);
          alert('Payment failed or cancelled.');
        }
      );
    } else {
      processOrder();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 min-h-screen bg-gray-50 flex flex-col lg:flex-row gap-8">
      {/* Left side: Steps */}
      <div className="flex-1 space-y-6">
        {/* Step 1: Account (Pre-filled if logged in) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-xl font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Logged in</h2>
              <p className="text-gray-500">{user?.email} | {profile?.phone}</p>
            </div>
          </div>
        </div>

        {/* Step 2: Delivery Address */}
        <div className={`bg-white rounded-2xl p-6 border transition-all ${step === 1 ? 'border-gray-900 shadow-lg' : 'border-gray-100 shadow-sm opacity-75'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold ${step === 1 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
              2
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
          </div>
          
          {step >= 1 && (
            <div className="space-y-4 pl-14">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-4 cursor-pointer hover:bg-orange-100 transition-colors">
                <MapPin className="text-orange-500 mt-1 shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-orange-900 mb-1">Add new address</h3>
                  <textarea 
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Enter complete delivery address..."
                    className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 mb-2"
                    rows={3}
                  />
                  <button 
                    onClick={() => setMapOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-orange-100 hover:bg-orange-200 text-orange-600 text-xs font-bold rounded-lg transition-colors border border-orange-200"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Choose on Map
                  </button>
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-4 pt-2">
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <label className="text-gray-700 text-sm font-bold mb-3 block">Order For</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 cursor-pointer transition-colors ${orderFor === 'self' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        <input type="radio" checked={orderFor === 'self'} onChange={() => setOrderFor('self')} className="hidden" />
                        Self
                      </label>
                      <label className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 cursor-pointer transition-colors ${orderFor === 'others' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        <input type="radio" checked={orderFor === 'others'} onChange={() => setOrderFor('others')} className="hidden" />
                        Friends and Family
                      </label>
                    </div>

                    <div className="mt-4">
                      {orderFor === 'self' ? (
                        <div>
                          <label className="text-gray-600 text-xs font-bold mb-1.5 block uppercase tracking-wider">Alternate Number (Optional)</label>
                          <input 
                            type="tel" 
                            placeholder="+91 XXXXX XXXXX" 
                            value={altPhone}
                            onChange={(e) => setAltPhone(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-gray-600 text-xs font-bold mb-1.5 block uppercase tracking-wider">Their Phone Number (Required)</label>
                          <input 
                            type="tel" 
                            placeholder="+91 XXXXX XXXXX" 
                            value={otherPhone}
                            onChange={(e) => setOtherPhone(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-orange-500"
                            required
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <label className="text-gray-700 text-sm font-bold mb-2 block">Restaurant Instructions</label>
                      <textarea 
                        value={restaurantRequest}
                        onChange={(e) => setRestaurantRequest(e.target.value)}
                        placeholder="e.g. Please make it spicy, add extra cheese..."
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 resize-none h-20"
                      />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <label className="text-gray-700 text-sm font-bold mb-2 block">Delivery Instructions</label>
                      <textarea 
                        value={deliveryRequest}
                        onChange={(e) => setDeliveryRequest(e.target.value)}
                        placeholder="e.g. Don't ring the bell, call me when you arrive..."
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 resize-none h-20"
                      />
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { 
                      if (!address.trim()) { alert('Please provide a delivery address.'); return; }
                      if (orderFor === 'others' && !otherPhone.trim()) { alert('Please provide a phone number for the recipient.'); return; }
                      setStep(2); 
                    }}
                    className="w-full mt-4 bg-orange-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-md shadow-orange-200 text-lg"
                  >
                    Done & Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Payment */}
        <div className={`bg-white rounded-2xl p-6 border transition-all ${step === 2 ? 'border-gray-900 shadow-lg' : 'border-gray-100 shadow-sm opacity-50'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold ${step === 2 ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'}`}>
              3
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment</h2>
          </div>

          {step === 2 && (
            <div className="pl-14 space-y-3">
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" checked={paymentMode === 'online'} onChange={() => setPaymentMode('online')} className="hidden" />
                <CreditCard className={`w-6 h-6 ${paymentMode === 'online' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className={`font-bold ${paymentMode === 'online' ? 'text-orange-900' : 'text-gray-700'}`}>Pay Online</p>
                  <p className="text-xs text-gray-500">Credit, Debit, Wallets, UPI</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'online' ? 'border-orange-500' : 'border-gray-300'}`}>
                  {paymentMode === 'online' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMode === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <input type="radio" name="payment" checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} className="hidden" />
                <Banknote className={`w-6 h-6 ${paymentMode === 'cod' ? 'text-orange-500' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className={`font-bold ${paymentMode === 'cod' ? 'text-orange-900' : 'text-gray-700'}`}>Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when order arrives</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'cod' ? 'border-orange-500' : 'border-gray-300'}`}>
                  {paymentMode === 'cod' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Cart Summary */}
      <div className="w-full lg:w-96">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
               <Utensils className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{vendor?.vendorName}</h3>
              <p className="text-sm text-gray-500">{vendor?.address || 'Restaurant'}</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-4 pr-2">
            {cartItems.map((item: any) => (
              <div key={item.product.productId} className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <p className="text-sm text-gray-900">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-dashed border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Item Total</span>
              <span>{formatCurrency(itemTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
              <span>To Pay</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {step === 2 && (
            <button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-6 bg-green-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg shadow-green-200 flex justify-between items-center px-6 disabled:opacity-70"
            >
              <span>{formatCurrency(total)}</span>
              <span>Place Order <ChevronRight className="inline w-5 h-5 ml-1" /></span>
            </button>
          )}
        </div>
      </div>

      <CheckoutMapModal
        isOpen={mapOpen}
        onClose={() => setMapOpen(false)}
        initialAddress={address}
        onSave={(newAddr, newCoords) => {
          setAddress(newAddr);
          setCoords(newCoords);
        }}
      />
    </div>
  );
};
