export type VendorOrderStatus = 'New' | 'Accepted' | 'Preparing' | 'Ready for Pickup' | 'Picked Up' | 'Completed' | 'Rejected';

export interface VendorOrder {
  id: string;
  customer: string;
  phone: string;
  items: string;
  amount: string;
  status: VendorOrderStatus;
  time: string;
  address: string;
  rejectionReason?: string;
  timestamp: number;
  notified?: boolean;
}

type Listener = () => void;

export function createOrderStore(storageKey: string, defaultOrders: VendorOrder[]) {
  const listeners = new Set<Listener>();

  function load(): VendorOrder[] {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : defaultOrders;
    } catch {
      return defaultOrders;
    }
  }

  function save(orders: VendorOrder[]) {
    localStorage.setItem(storageKey, JSON.stringify(orders));
    listeners.forEach(l => l());
  }

  return {
    getOrders: (): VendorOrder[] => load(),

    updateStatus: (id: string, status: VendorOrderStatus, rejectionReason?: string) => {
      const orders = load().map(o =>
        o.id === id
          ? { ...o, status, ...(rejectionReason !== undefined ? { rejectionReason } : {}), notified: true }
          : o
      );
      save(orders);
    },

    markNotified: (id: string) => {
      const orders = load().map(o => o.id === id ? { ...o, notified: true } : o);
      save(orders);
    },

    subscribe: (fn: Listener) => {
      listeners.add(fn);
      return () => { listeners.delete(fn); };
    },

    getNewCount: (): number => load().filter(o => o.status === 'New').length,
    getPendingNotifCount: (): number => load().filter(o => !o.notified).length,
  };
}

const foodDefaults: VendorOrder[] = [
  { id: '#1031', customer: 'Rahul Sharma', phone: '+91 9876543210', items: 'Chicken Burger x2, Fries x1', amount: '₹548', status: 'New', time: '12:45 PM', address: 'HSR Layout, Bengaluru', timestamp: Date.now() - 60000, notified: false },
  { id: '#1030', customer: 'Priya Patel', phone: '+91 9123456780', items: 'Margherita Pizza x1, Coke x2', amount: '₹420', status: 'Preparing', time: '12:30 PM', address: 'Koramangala, Bengaluru', timestamp: Date.now() - 900000, notified: true },
  { id: '#1029', customer: 'Amit Kumar', phone: '+91 9988776655', items: 'Chicken Biryani x2', amount: '₹598', status: 'Ready for Pickup', time: '12:10 PM', address: 'Indiranagar, Bengaluru', timestamp: Date.now() - 2100000, notified: true },
  { id: '#1028', customer: 'Sneha Reddy', phone: '+91 9871234560', items: 'Caesar Salad x1, OJ x1', amount: '₹280', status: 'Picked Up', time: '11:55 AM', address: 'BTM Layout, Bengaluru', timestamp: Date.now() - 3000000, notified: true },
  { id: '#1027', customer: 'Kiran Mehta', phone: '+91 9765432108', items: 'Paneer Wrap x2, Lassi x2', amount: '₹460', status: 'Completed', time: '11:30 AM', address: 'Whitefield, Bengaluru', timestamp: Date.now() - 4500000, notified: true },
  { id: '#1026', customer: 'Rohan Singh', phone: '+91 9543210987', items: 'Veg Burger x1', amount: '₹180', status: 'Rejected', time: '11:10 AM', address: 'JP Nagar, Bengaluru', timestamp: Date.now() - 5400000, notified: true, rejectionReason: 'Item currently unavailable' },
];

const groceryDefaults: VendorOrder[] = [
  { id: '#G204', customer: 'Meena Iyer', phone: '+91 9812345670', items: 'Amul Milk 1L x2, Brown Bread x1', amount: '₹185', status: 'New', time: '12:50 PM', address: 'Jayanagar, Bengaluru', timestamp: Date.now() - 30000, notified: false },
  { id: '#G203', customer: 'Suresh Nair', phone: '+91 9900123456', items: 'Basmati Rice 5kg x1, Toor Dal 1kg x1', amount: '₹640', status: 'Accepted', time: '12:20 PM', address: 'Malleswaram, Bengaluru', timestamp: Date.now() - 1800000, notified: true },
  { id: '#G202', customer: 'Anita Rao', phone: '+91 9845612340', items: 'Fresh Tomatoes 1kg x2, Onions 2kg x1', amount: '₹210', status: 'Preparing', time: '12:00 PM', address: 'Yelahanka, Bengaluru', timestamp: Date.now() - 2700000, notified: true },
  { id: '#G201', customer: 'Deepak Verma', phone: '+91 9711234560', items: 'Amul Butter 500g x1, Eggs 12pk x1', amount: '₹320', status: 'Completed', time: '11:00 AM', address: 'Rajajinagar, Bengaluru', timestamp: Date.now() - 6300000, notified: true },
  { id: '#G200', customer: 'Latha Krishnan', phone: '+91 9632145780', items: 'Organic Spinach x2, Carrots 1kg x1', amount: '₹150', status: 'Rejected', time: '10:30 AM', address: 'Hebbal, Bengaluru', timestamp: Date.now() - 8100000, notified: true, rejectionReason: 'Out of stock today' },
];

export const foodOrderStore = createOrderStore('omni_food_orders_v1', foodDefaults);
export const groceryOrderStore = createOrderStore('omni_grocery_orders_v1', groceryDefaults);

export const nextStatus: Partial<Record<VendorOrderStatus, VendorOrderStatus>> = {
  New: 'Accepted',
  Accepted: 'Preparing',
  Preparing: 'Ready for Pickup',
  'Ready for Pickup': 'Picked Up',
  'Picked Up': 'Completed',
};

export const statusBadge: Record<VendorOrderStatus, string> = {
  New: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Accepted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Preparing: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Ready for Pickup': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Picked Up': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

// Legacy export for backward compat (maps to foodOrderStore)
export const orderStore = foodOrderStore;
