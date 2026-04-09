import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface PlatformLink {
  label: string;
  path: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatarUrl: string;
}

export interface HeroAdvertisement {
  enabled: boolean;
  badge: string;
  vendorName: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryCtaPath: string;
  secondaryCtaLabel: string;
  secondaryCtaPath: string;
  slotLabel: string;
  status: 'draft' | 'scheduled' | 'live';
}

export interface PlatformContent {
  branding: {
    appName: string;
    logoUrl: string;
    locationLabel: string;
  };
  hero: {
    headline: string;
    highlight: string;
    subheadline: string;
    primaryCtaLabel: string;
    primaryCtaPath: string;
    secondaryCtaLabel: string;
    secondaryCtaPath: string;
    trustText: string;
    featuredTitle: string;
    featuredSubtitle: string;
    imageUrl: string;
    averageDeliveryText: string;
    averageDeliveryValue: string;
  };
  advertisement: HeroAdvertisement;
  testimonials: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: TestimonialItem[];
  };
  footer: {
    description: string;
    companyLinks: PlatformLink[];
    supportLinks: PlatformLink[];
    copyrightText: string;
  };
  support: {
    email: string;
    phone: string;
  };
  operations: {
    maintenanceMode: boolean;
    defaultCurrency: string;
    timezone: string;
    maxDeliveryRadius: number;
    platformVersion: string;
  };
}

const DEFAULT_PLATFORM_CONTENT: PlatformContent = {
  branding: {
    appName: 'OmniServe',
    logoUrl: '',
    locationLabel: 'Indiranagar, Bangalore',
  },
  hero: {
    headline: 'Everything you need,',
    highlight: 'delivered fast.',
    subheadline: 'From hot meals and fresh groceries to home repairs and quick rides. One app for all your daily needs.',
    primaryCtaLabel: 'Order Now',
    primaryCtaPath: '/food',
    secondaryCtaLabel: 'Book a Ride',
    secondaryCtaPath: '/rides',
    trustText: 'Trusted by 1M+ users',
    featuredTitle: 'Margherita Pizza',
    featuredSubtitle: 'Arriving in 12 mins',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1000&q=80',
    averageDeliveryText: 'Delivery Time',
    averageDeliveryValue: 'Avg. 24 mins',
  },
  advertisement: {
    enabled: false,
    badge: 'Sponsored Hero Banner',
    vendorName: '',
    title: 'Feature your brand on the OmniServe home page',
    subtitle: 'Approved promotions can go live here with a single publish action.',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
    primaryCtaLabel: 'Explore Offer',
    primaryCtaPath: '/food',
    secondaryCtaLabel: 'Learn More',
    secondaryCtaPath: '/services',
    slotLabel: 'Prime Home Hero | 7 days',
    status: 'draft',
  },
  testimonials: {
    sectionTitle: 'What customers love about us',
    sectionSubtitle: 'Real stories from people using the platform every day.',
    items: [
      {
        id: 't1',
        name: 'Priya Sharma',
        role: 'Daily Food Customer',
        quote: 'Meals arrive fast, the app feels simple, and support has always been responsive whenever I needed help.',
        rating: 5,
        avatarUrl: 'https://i.pravatar.cc/100?u=testimonial-1',
      },
      {
        id: 't2',
        name: 'Rahul Mehta',
        role: 'Ride + Grocery User',
        quote: 'I use it for rides in the morning and groceries at night. Having everything in one place saves me a lot of time.',
        rating: 5,
        avatarUrl: 'https://i.pravatar.cc/100?u=testimonial-2',
      },
      {
        id: 't3',
        name: 'Anita Nair',
        role: 'Home Services User',
        quote: 'Booking electricians and cleaners has been smooth, and I like seeing updates in real time instead of guessing.',
        rating: 4,
        avatarUrl: 'https://i.pravatar.cc/100?u=testimonial-3',
      },
    ],
  },
  footer: {
    description: 'The ultimate super app for all your daily needs. Food, groceries, rides, and home services - all in one place.',
    companyLinks: [
      { label: 'About Us', path: '#' },
      { label: 'Careers', path: '#' },
      { label: 'Partner with us', path: '#' },
      { label: 'Terms of Service', path: '#' },
    ],
    supportLinks: [
      { label: 'Help Center', path: '#' },
      { label: 'Contact Us', path: '#' },
      { label: 'Privacy Policy', path: '#' },
      { label: 'Refund Policy', path: '#' },
    ],
    copyrightText: '© 2026 OmniServe Technologies Pvt Ltd. All rights reserved.',
  },
  support: {
    email: 'support@omniserve.in',
    phone: '+91 80 1234 5678',
  },
  operations: {
    maintenanceMode: false,
    defaultCurrency: 'INR',
    timezone: 'Asia/Kolkata',
    maxDeliveryRadius: 15,
    platformVersion: '2.4.1',
  },
};

interface PlatformContentContextValue {
  content: PlatformContent;
  loading: boolean;
}

const PlatformContentContext = createContext<PlatformContentContextValue>({
  content: DEFAULT_PLATFORM_CONTENT,
  loading: true,
});

const mergePlatformContent = (incoming?: Partial<PlatformContent> | null): PlatformContent => ({
  branding: {
    ...DEFAULT_PLATFORM_CONTENT.branding,
    ...(incoming?.branding ?? {}),
  },
  hero: {
    ...DEFAULT_PLATFORM_CONTENT.hero,
    ...(incoming?.hero ?? {}),
  },
  advertisement: {
    ...DEFAULT_PLATFORM_CONTENT.advertisement,
    ...(incoming?.advertisement ?? {}),
  },
  testimonials: {
    ...DEFAULT_PLATFORM_CONTENT.testimonials,
    ...(incoming?.testimonials ?? {}),
    items:
      incoming?.testimonials?.items && incoming.testimonials.items.length > 0
        ? incoming.testimonials.items
        : DEFAULT_PLATFORM_CONTENT.testimonials.items,
  },
  footer: {
    ...DEFAULT_PLATFORM_CONTENT.footer,
    ...(incoming?.footer ?? {}),
    companyLinks:
      incoming?.footer?.companyLinks && incoming.footer.companyLinks.length > 0
        ? incoming.footer.companyLinks
        : DEFAULT_PLATFORM_CONTENT.footer.companyLinks,
    supportLinks:
      incoming?.footer?.supportLinks && incoming.footer.supportLinks.length > 0
        ? incoming.footer.supportLinks
        : DEFAULT_PLATFORM_CONTENT.footer.supportLinks,
  },
  support: {
    ...DEFAULT_PLATFORM_CONTENT.support,
    ...(incoming?.support ?? {}),
  },
  operations: {
    ...DEFAULT_PLATFORM_CONTENT.operations,
    ...(incoming?.operations ?? {}),
  },
});

export const platformContentDocRef = doc(db, 'platformContent', 'site');
export const defaultPlatformContent = DEFAULT_PLATFORM_CONTENT;

export const PlatformContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<PlatformContent>(DEFAULT_PLATFORM_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;

    const setupListener = async () => {
      try {
        const snapshot = await getDoc(platformContentDocRef);
        if (!snapshot.exists()) {
          await setDoc(platformContentDocRef, DEFAULT_PLATFORM_CONTENT);
        }

        if (cancelled) return;

        unsubscribe = onSnapshot(
          platformContentDocRef,
          (liveSnapshot) => {
            const nextContent = mergePlatformContent(liveSnapshot.exists() ? (liveSnapshot.data() as Partial<PlatformContent>) : null);
            setContent(nextContent);
            setLoading(false);
          },
          (error) => {
            console.error('Platform content realtime listener failed:', error);
            setContent(DEFAULT_PLATFORM_CONTENT);
            setLoading(false);
          },
        );
      } catch (error) {
        console.error('Platform content initialization failed:', error);
        setContent(DEFAULT_PLATFORM_CONTENT);
        setLoading(false);
      }
    };

    void setupListener();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return (
    <PlatformContentContext.Provider value={{ content, loading }}>
      {children}
    </PlatformContentContext.Provider>
  );
};

export const usePlatformContent = () => useContext(PlatformContentContext);
