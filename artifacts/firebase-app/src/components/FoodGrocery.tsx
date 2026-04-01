import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { Vendor, Product, Order } from '../types';
import { useAuth } from '../AuthContext';
import { useSuccess } from './SuccessModal';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  ShoppingCart,
  ChevronRight,
  Utensils,
  ShoppingBag,
  Mic,
  Settings2,
  Percent,
  Train,
  Layers,
  Gift,
  ChevronDown
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';

const TOP_CATEGORIES = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=200&q=80' },
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?auto=format&fit=crop&w=200&q=80' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80' },
  { name: 'Chicken', image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=200&q=80' },
  { name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80' },
  { name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=200&q=80' },
];

const FILTERS = [
  { name: 'Filters', icon: Settings2 },
  { name: 'Under ₹150', icon: null },
  { name: 'Schedule', icon: ChevronDown },
  { name: 'Great off', icon: null },
];

const EXPLORE_MORE = [
  { name: 'Offers', icon: Percent, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Food on train', icon: Train, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { name: 'Collections', icon: Layers, color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Gift cards', icon: Gift, color: 'text-pink-600', bg: 'bg-pink-50' },
];

export const FoodGrocery: React.FC<{ type: 'food' | 'grocery' }> = ({ type }) => {
  const { user } = useAuth();
  const { showSuccess } = useSuccess();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<{ [key: string]: { product: Product, quantity: number } }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'vendors'), 
      where('vendorType', '==', type === 'food' ? 'restaurant' : 'grocery'),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vendorList: Vendor[] = [];
      snapshot.forEach((doc) => {
        vendorList.push({ vendorId: doc.id, ...doc.data() } as Vendor);
      });
      setVendors(vendorList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [type]);

  useEffect(() => {
    if (selectedVendor) {
      const q = query(
        collection(db, 'products'),
        where('vendorId', '==', selectedVendor.vendorId),
        where('isAvailable', '==', true)
      );

      getDocs(q).then(async (snapshot) => {
        const productList: Product[] = [];
        snapshot.forEach((doc) => {
          productList.push({ productId: doc.id, ...doc.data() } as Product);
        });
        
        // If it's a grocery store and has no products, add some example ones
        if (productList.length === 0 && type === 'grocery') {
          const mockProducts = [
            { name: 'Fresh Apples', category: 'Fruits', price: 120, description: 'Crispy and sweet red apples, 1kg', imageURL: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&w=400&q=80' },
            { name: 'Bananas', category: 'Fruits', price: 60, description: 'Ripe yellow bananas, pack of 6', imageURL: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80' },
            { name: 'Strawberries', category: 'Fruits', price: 250, description: 'Fresh farm-picked strawberries, 250g', imageURL: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80' },
            { name: 'Grapes', category: 'Fruits', price: 180, description: 'Sweet green seedless grapes, 500g', imageURL: 'https://images.unsplash.com/photo-1537640538966-79f369b41e8f?auto=format&fit=crop&w=400&q=80' },
            { name: 'Mangoes', category: 'Fruits', price: 300, description: 'Sweet Alphonso mangoes, pack of 2', imageURL: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80' },
            { name: 'Pineapple', category: 'Fruits', price: 150, description: 'Fresh sweet pineapple, 1 unit', imageURL: 'https://images.unsplash.com/photo-1550258114-b834e70e9be1?auto=format&fit=crop&w=400&q=80' },
            { name: 'Blueberries', category: 'Fruits', price: 450, description: 'Fresh organic blueberries, 125g', imageURL: 'https://images.unsplash.com/photo-1497534446932-c946e7316a33?auto=format&fit=crop&w=400&q=80' },
            { name: 'Watermelon', category: 'Fruits', price: 120, description: 'Sweet seedless watermelon, 1 unit', imageURL: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80' },
            { name: 'Kiwi', category: 'Fruits', price: 200, description: 'Zesty green kiwis, pack of 3', imageURL: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=400&q=80' },
            { name: 'Oranges', category: 'Fruits', price: 140, description: 'Juicy Nagpur oranges, 1kg', imageURL: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400&q=80' },
            { name: 'Carrots', category: 'Vegetables', price: 40, description: 'Fresh organic carrots, 500g', imageURL: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=80' },
            { name: 'Broccoli', category: 'Vegetables', price: 80, description: 'Green broccoli florets, 250g', imageURL: 'https://images.unsplash.com/photo-1452948491233-ad8a1ed01085?auto=format&fit=crop&w=400&q=80' },
            { name: 'Spinach', category: 'Vegetables', price: 30, description: 'Fresh green spinach leaves, bunch', imageURL: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80' },
            { name: 'Bell Peppers', category: 'Vegetables', price: 120, description: 'Mixed color bell peppers, pack of 3', imageURL: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&w=400&q=80' },
            { name: 'Milk', category: 'Dairy', price: 55, description: 'Fresh whole milk, 1L', imageURL: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&w=400&q=80' },
            { name: 'Cheddar Cheese', category: 'Dairy', price: 320, description: 'Aged cheddar cheese, 200g', imageURL: 'https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=400&q=80' },
            { name: 'Greek Yogurt', category: 'Dairy', price: 150, description: 'Plain greek yogurt, 400g', imageURL: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80' },
            { name: 'Whole Wheat Bread', category: 'Bakery', price: 45, description: 'Freshly baked whole wheat bread', imageURL: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
            { name: 'Chocolate Croissant', category: 'Bakery', price: 90, description: 'Buttery croissant with dark chocolate', imageURL: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=400&q=80' },
            { name: 'Orange Juice', category: 'Beverages', price: 180, description: '100% pure orange juice, 1L', imageURL: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80' },
            { name: 'Sparkling Water', category: 'Beverages', price: 60, description: 'Natural sparkling water, 500ml', imageURL: 'https://images.unsplash.com/photo-1551731589-22244e847a1e?auto=format&fit=crop&w=400&q=80' },
          ];

          for (const p of mockProducts) {
            const docRef = await addDoc(collection(db, 'products'), {
              ...p,
              vendorId: selectedVendor.vendorId,
              isAvailable: true,
              stock: 100
            });
            productList.push({ productId: docRef.id, ...p, vendorId: selectedVendor.vendorId, isAvailable: true, stock: 100 } as Product);
          }
        }
        
        setProducts(productList);
      });
    }
  }, [selectedVendor, type]);

  const addToCart = (product: Product) => {
    setCart(prev => ({
      ...prev,
      [product.productId]: {
        product,
        quantity: (prev[product.productId]?.quantity || 0) + 1
      }
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId].quantity > 1) {
        newCart[productId].quantity -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartTotal = Object.values(cart).reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);

  const groupedProducts = products.reduce((acc: { [key: string]: Product[] }, product) => {
    const category = product.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {} as { [key: string]: Product[] });

  const handleCheckout = async () => {
    if (!user || !selectedVendor) return;

    try {
      const orderData = {
        userId: user.uid,
        vendorId: selectedVendor.vendorId,
        orderType: type,
        items: Object.values(cart).map((item: any) => ({
          productId: item.product.productId,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalPrice: cartTotal,
        deliveryFee: 40,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        createdAt: new Date().toISOString(),
        addressId: 'default_address' // In real app, user selects address
      };

      await addDoc(collection(db, 'orders'), orderData);
      setCart({});
      setSelectedVendor(null);
      showSuccess(
        'Order Placed!', 
        `Your ${type} order from ${selectedVendor.vendorName} has been successfully placed.`,
        'Track Order',
        '/orders'
      );
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-[#FCFCFC] min-h-screen">
      {/* Search Bar Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
          <input 
            type="text" 
            placeholder={`Search "burger"`}
            className="w-full pl-12 pr-12 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-red-500 outline-none transition-all text-gray-700 font-medium"
          />
          <Mic className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500 cursor-pointer" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
          </div>
        </div>
      </div>

      {!selectedVendor ? (
        <div className="space-y-10">
          {/* Top Categories Horizontal Scroll */}
          <div className="flex overflow-x-auto gap-8 pb-4 no-scrollbar -mx-4 px-4">
            {TOP_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
                <div className={cn(
                  "w-20 h-20 rounded-full overflow-hidden border-2 transition-all",
                  idx === 0 ? "border-red-500" : "border-transparent group-hover:border-gray-200"
                )}>
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <span className={cn(
                  "text-sm font-bold transition-colors",
                  idx === 0 ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                )}>{cat.name}</span>
                {idx === 0 && <div className="h-1 w-12 bg-red-500 rounded-full -mt-1" />}
              </div>
            ))}
          </div>

          {/* Filter Chips Horizontal Scroll */}
          <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar -mx-4 px-4">
            {FILTERS.map((filter, idx) => (
              <button 
                key={idx} 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 whitespace-nowrap hover:bg-gray-50 transition-all shadow-sm"
              >
                {filter.name}
                {filter.icon && <filter.icon className="w-4 h-4" />}
              </button>
            ))}
          </div>

          {/* Recommended Section */}
          <div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Recommended with deals</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {vendors.map((vendor) => (
                <motion.div
                  key={vendor.vendorId}
                  whileHover={{ scale: 0.98 }}
                  onClick={() => setSelectedVendor(vendor)}
                  className="bg-white rounded-3xl overflow-hidden cursor-pointer group"
                >
                  <div className="relative h-48 rounded-[2rem] overflow-hidden mb-3">
                    <img 
                      src={type === 'food' ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80' : 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'} 
                      alt={vendor.vendorName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Discount Badge */}
                    <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/40 to-transparent">
                      <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md tracking-wider">
                        ₹40 OFF above ₹249
                      </span>
                    </div>
                    {/* Rating Badge */}
                    <div className="absolute bottom-3 left-3 bg-green-700 text-white px-2 py-0.5 rounded-lg flex items-center gap-1 text-xs font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {vendor.rating}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 line-clamp-1">{vendor.vendorName}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      <span>25-30 mins</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Explore More Section */}
          <div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Explore More</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {EXPLORE_MORE.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-[2rem] border border-gray-100 flex flex-col items-center gap-4 hover:shadow-lg transition-all cursor-pointer group">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", item.bg)}>
                    <item.icon className={cn("w-8 h-8", item.color)} />
                  </div>
                  <span className="text-sm font-bold text-gray-800 text-center">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-10 pb-20">
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center">
              {vendors.length} {type === 'food' ? 'restaurants' : 'stores'} delivering to you
            </h2>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <button 
              onClick={() => setSelectedVendor(null)}
              className="flex items-center gap-2 text-gray-600 font-bold hover:text-orange-500 transition-colors"
            >
              <ChevronRight className="w-5 h-5 rotate-180" /> Back to Vendors
            </button>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0">
                <img src={type === 'food' ? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80" : "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80"} alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedVendor.vendorName}</h2>
                <p className="text-gray-500 mb-4">{selectedVendor.description}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {selectedVendor.rating} (500+ ratings)
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold">
                    <Clock className="w-4 h-4 text-orange-500" />
                    30 mins
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="text-2xl font-bold text-gray-900">Menu Items</h3>
              
              {Object.entries(groupedProducts).length === 0 ? (
                <div className="p-10 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                  <p className="text-gray-400">No items available at the moment.</p>
                </div>
              ) : (
                (Object.entries(groupedProducts) as [string, Product[]][]).map(([category, categoryProducts]) => (
                  <div key={category} className="space-y-4">
                    <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <div className={cn("w-1 h-6 rounded-full", type === 'food' ? "bg-orange-500" : "bg-green-500")} />
                      {category}
                    </h4>
                    
                    <div className="flex overflow-x-auto pb-6 gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar scroll-smooth">
                      {categoryProducts.map((product) => (
                        <div key={product.productId} className="flex-shrink-0 w-72 bg-white p-6 rounded-3xl border border-gray-100 flex flex-col justify-between gap-4 hover:shadow-xl transition-all group">
                          <div className="relative h-40 -mx-2 -mt-2 mb-2">
                            <img 
                              src={product.imageURL || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80'} 
                              alt={product.name} 
                              className="w-full h-full object-cover rounded-2xl"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 right-2">
                              {cart[product.productId] ? (
                                <div className="bg-white border border-orange-500 rounded-lg flex items-center shadow-lg overflow-hidden">
                                  <button onClick={() => removeFromCart(product.productId)} className="px-2 py-1 text-orange-500 hover:bg-orange-50"><Minus className="w-3 h-3" /></button>
                                  <span className="px-2 py-1 text-sm font-bold text-orange-500 min-w-[24px] text-center">{cart[product.productId].quantity}</span>
                                  <button onClick={() => addToCart(product)} className="px-2 py-1 text-orange-500 hover:bg-orange-50"><Plus className="w-3 h-3" /></button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => addToCart(product)}
                                  className="bg-white border border-gray-200 text-orange-500 font-bold px-4 py-1 rounded-lg shadow-lg hover:bg-orange-50 transition-all text-sm"
                                >
                                  ADD
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h4>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2 h-8">{product.description}</p>
                            <p className="font-bold text-lg text-gray-900">{formatCurrency(product.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-orange-500" /> Cart
              </h3>
              
              {Object.keys(cart).length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2">
                    {Object.values(cart).map((item: any) => (
                      <div key={item.product.productId} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm">{item.product.name}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(item.product.price)} x {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-orange-50 rounded-lg px-2 py-1">
                          <button onClick={() => removeFromCart(item.product.productId)} className="text-orange-500"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-bold text-orange-500 w-4 text-center">{item.quantity}</span>
                          <button onClick={() => addToCart(item.product)} className="text-orange-500"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-50 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Item Total</span>
                      <span className="font-medium">{formatCurrency(Number(cartTotal))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Delivery Fee</span>
                      <span className="font-medium">₹40.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-50">
                      <span>Total</span>
                      <span className="text-orange-500">{formatCurrency(Number(cartTotal) + 40)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-200"
                  >
                    Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
