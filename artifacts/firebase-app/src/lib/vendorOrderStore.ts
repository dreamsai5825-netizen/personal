import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

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

export function createOrderStore(vendorType: 'food' | 'grocery') {
  const listeners = new Set<Listener>();
  let currentOrders: VendorOrder[] = [];
  let unsubscribe: (() => void) | null = null;

  function initFirebaseListener() {
    if (unsubscribe) return;
    const q = query(collection(db, 'orders'), where('orderType', '==', vendorType));
    unsubscribe = onSnapshot(q, (snapshot) => {
      const liveOrders: VendorOrder[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          customer: data.customerName || 'Unknown Customer',
          phone: data.customerPhone || '+91 0000000000',
          items: Array.isArray(data.items) 
            ? data.items.map((i: any) => `${i.quantity}x ${i.productId || 'Item'}`).join(', ') 
            : (data.items || 'Items not specified'),
          amount: `₹${data.totalPrice || 0}`,
          status: (data.orderStatus as VendorOrderStatus) || 'New',
          time: new Date(data.createdAt?.seconds * 1000 || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          address: data.deliveryAddress || 'Unknown Address',
          rejectionReason: data.rejectionReason,
          timestamp: data.createdAt?.seconds * 1000 || Date.now(),
          notified: data.notified ?? false,
        };
      });
      
      currentOrders = liveOrders.sort((a, b) => b.timestamp - a.timestamp);
      listeners.forEach(l => l());
    }, (error) => {
      console.error(`Error fetching ${vendorType} orders:`, error);
    });
  }

  return {
    getOrders: (): VendorOrder[] => currentOrders,

    updateStatus: async (id: string, status: VendorOrderStatus, rejectionReason?: string) => {
      try {
        const orderRef = doc(db, 'orders', id);
        const updateData: any = { orderStatus: status, notified: true };
        if (rejectionReason !== undefined) {
          updateData.rejectionReason = rejectionReason;
        }
        await updateDoc(orderRef, updateData);
      } catch (e) {
        console.error("Failed to update status in Firebase:", e);
        // Optimistic update
        currentOrders = currentOrders.map(o => o.id === id ? { ...o, status, ...(rejectionReason ? { rejectionReason } : {}), notified: true } : o);
        listeners.forEach(l => l());
      }
    },

    markNotified: async (id: string) => {
      try {
        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, { notified: true });
      } catch (e) {
        // Optimistic update
        currentOrders = currentOrders.map(o => o.id === id ? { ...o, notified: true } : o);
        listeners.forEach(l => l());
      }
    },

    subscribe: (fn: Listener) => {
      listeners.add(fn);
      if (listeners.size === 1) {
        initFirebaseListener();
      }
      return () => { 
        listeners.delete(fn); 
        if (listeners.size === 0 && unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      };
    },

    getNewCount: (): number => currentOrders.filter(o => o.status === 'New').length,
    getPendingNotifCount: (): number => currentOrders.filter(o => !o.notified).length,
  };
}

export const foodOrderStore = createOrderStore('food');
export const groceryOrderStore = createOrderStore('grocery');

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
