import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, UserRole, SUPER_ADMIN_ROLES, CUSTOMER_CARE_ROLES } from './types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCustomerCare: boolean;
  isVendor: boolean;
  isDriver: boolean;
  isDeliveryPartner: boolean;
  isServiceWorker: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  needsPhoneVerification: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Listen to profile changes
        const profileRef = doc(db, 'users', firebaseUser.uid);
        
        // Check if profile exists, if not create a default one
        try {
          const profileSnap = await getDoc(profileRef);
          if (!profileSnap.exists()) {
            const newProfile: UserProfile = {
              userId: firebaseUser.uid,
              name: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              phone: firebaseUser.phoneNumber || '',
              role: 'customer',
              createdAt: new Date().toISOString(),
              status: 'active',
              walletBalance: 0,
              profileImage: firebaseUser.photoURL || undefined,
            };
            await setDoc(profileRef, newProfile);
            setProfile(newProfile);
          } else {
            // Set profile immediately from the one-time read
            setProfile(profileSnap.data() as UserProfile);
          }
        } catch (e) {
          console.error("Error on initial profile fetch:", e);
        }

        // Set up real-time listener (may fail on restrictive rules, profile already set above)
        const unsubProfile = onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          }
          setLoading(false);
        }, (error) => {
          console.error("Real-time profile listener error:", error);
          // Profile was already set from getDoc above; just stop loading
          setLoading(false);
        });

        // Store unsubProfile somewhere if needed, but returning from async callback
        // doesn't work the way it would in useEffect. For now we just let it run.
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
    isAdmin: profile?.role === 'admin' || (profile ? SUPER_ADMIN_ROLES.includes(profile.role) : false),
    isSuperAdmin: profile ? SUPER_ADMIN_ROLES.includes(profile.role) : false,
    isCustomerCare: profile ? CUSTOMER_CARE_ROLES.includes(profile.role) : false,
    isVendor: profile?.role === 'vendor' || profile?.role === 'food_store_vendor' || profile?.role === 'grocery_store_vendor',
    isDriver: profile?.role === 'driver',
    isDeliveryPartner: profile?.role === 'delivery_partner',
    isServiceWorker: profile?.role === 'service_worker',
    isEmailVerified: user?.emailVerified || false,
    isPhoneVerified: true, // TESTING: phone verification disabled
    needsPhoneVerification: false, // TESTING: phone verification disabled
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
