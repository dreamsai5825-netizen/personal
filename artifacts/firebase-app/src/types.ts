export type UserRole = 'customer' | 'vendor' | 'food_store_vendor' | 'grocery_store_vendor' | 'delivery_partner' | 'service_worker' | 'driver' | 'admin' | 'super_admin' | 'system_admin' | 'platform_owner' | 'super admin' | 'system admin' | 'platform owner' | 'customerCare' | 'customer_care' | 'customer care';

export type AdminRole = 'super_admin' | 'system_admin' | 'platform_owner' | 'operations_admin' | 'customer_care_admin' | 'verification_admin' | 'finance_admin';

export const SUPER_ADMIN_ROLES: UserRole[] = ['super_admin', 'system_admin', 'platform_owner', 'super admin', 'system admin', 'platform owner'];

export const CUSTOMER_CARE_ROLES: UserRole[] = ['customerCare', 'customer_care', 'customer care'];

export type ServiceWorkerCategory =
  | 'plumber'
  | 'electrician'
  | 'ac_repair'
  | 'car_wash'
  | 'mechanic_bike'
  | 'mechanic_car'
  | 'cleaning';

export const SERVICE_WORKER_CATEGORY_LABELS: Record<ServiceWorkerCategory, string> = {
  plumber: 'Plumber',
  electrician: 'Electrician',
  ac_repair: 'AC Repair Technician',
  car_wash: 'Car Wash Specialist',
  mechanic_bike: 'Bike Mechanic',
  mechanic_car: 'Car Mechanic',
  cleaning: 'Cleaning Specialist',
};

export interface ServiceWorkerProfile {
  category: ServiceWorkerCategory;
  experience?: number;
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
  bio?: string;
}

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  createdAt: string;
  status: 'active' | 'pending_verification' | 'pending_phone_verification' | 'suspended';
  walletBalance: number;
  serviceWorkerProfile?: ServiceWorkerProfile;
  driverProfile?: DriverProfile;
}

export interface Address {
  addressId: string;
  userId: string;
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
  label: string;
}

export interface Vendor {
  vendorId: string;
  ownerId: string;
  vendorName: string;
  vendorType: 'restaurant' | 'grocery' | 'service';
  description: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  isActive: boolean;
}

export interface Product {
  productId: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageURL: string;
  stock: number;
  isAvailable: boolean;
}

export interface Order {
  orderId: string;
  userId: string;
  vendorId: string;
  orderType: 'food' | 'grocery' | 'service';
  items: OrderItem[];
  totalPrice: number;
  deliveryFee: number;
  paymentStatus: string;
  orderStatus: 'pending' | 'accepted' | 'preparing' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryPartnerId?: string;
  addressId: string;
  createdAt: string;
}

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
}

export interface Ride {
  rideId: string;
  userId: string;
  driverId?: string;
  vehicleType: 'bike' | 'auto';
  pickupLatitude: number;
  pickupLongitude: number;
  dropLatitude: number;
  dropLongitude: number;
  distance: number;
  fare: number;
  status: 'requested' | 'accepted' | 'driver_arriving' | 'on_trip' | 'completed' | 'cancelled';
  paymentStatus: string;
  createdAt: string;
}

export interface TrackingData {
  trackingId: string;
  rideId?: string;
  orderId?: string;
  id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface Service {
  serviceId: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface Worker {
  workerId: string;
  userId: string;
  vendorId: string;
  serviceType: string;
  experience: number;
  rating: number;
  isAvailable: boolean;
  currentLatitude: number;
  currentLongitude: number;
}

export interface DriverProfile {
  firstName: string;
  lastName: string;
  experience: number;
  vehicleType: 'bike' | 'auto' | 'car';
  vehicleNumber: string;
  licenseUrl?: string;
  rcCardUrl?: string;
  vehiclePhotoUrl?: string;
  rating: number;
  totalRides: number;
  isAvailable: boolean;
}

export interface RideRequest {
  requestId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  pickupLat?: number;
  pickupLng?: number;
  dropAddress: string;
  dropLat?: number;
  dropLng?: number;
  fare: number;
  distance: number;
  vehicleType: 'bike' | 'auto' | 'car';
  status: 'broadcasting' | 'driver_assigned' | 'driver_arrived' | 'on_trip' | 'completed' | 'cancelled';
  assignedDriverId?: string;
  assignedDriverName?: string;
  assignedDriverPhone?: string;
  otp: string;
  rejectedDriverIds: string[];
  createdAt: string;
  notes?: string;
}

export interface DriverTransaction {
  txId: string;
  driverId: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  rideId?: string;
  createdAt: string;
}

export interface ServiceBookingRequest {
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  category: ServiceWorkerCategory;
  serviceName: string;
  serviceId: string;
  totalPrice: number;
  address: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'broadcasting' | 'worker_assigned' | 'in_progress' | 'completed' | 'cancelled' | 'no_worker_found';
  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedWorkerPhone?: string;
  assignedWorkerRating?: number;
  rejectedWorkerIds: string[];
  createdAt: string;
  notes?: string;
}
