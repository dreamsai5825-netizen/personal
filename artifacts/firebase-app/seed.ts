import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  const vendorsSnap = await getDocs(query(collection(db, 'vendors'), limit(1)));
  if (!vendorsSnap.empty) {
    console.log('Database already seeded');
    return;
  }

  console.log('Seeding database...');

  // Add Vendors
  const vendors = [
    {
      vendorName: 'Pizza Palace',
      vendorType: 'restaurant',
      description: 'Best Italian pizzas in town',
      rating: 4.5,
      isActive: true,
      latitude: 12.9716,
      longitude: 77.5946,
      ownerId: 'system',
    },
    {
      vendorName: 'Fresh Mart',
      vendorType: 'grocery',
      description: 'Daily fresh vegetables and fruits',
      rating: 4.2,
      isActive: true,
      latitude: 12.9716,
      longitude: 77.5946,
      ownerId: 'system',
    },
  ];

  for (const v of vendors) {
    const docRef = await addDoc(collection(db, 'vendors'), v);
    
    // Add Products for each vendor
    if (v.vendorType === 'restaurant') {
      await addDoc(collection(db, 'products'), {
        vendorId: docRef.id,
        name: 'Margherita Pizza',
        description: 'Classic cheese and tomato',
        price: 299,
        category: 'Pizza',
        isAvailable: true,
        imageURL: 'https://images.unsplash.com/photo-1574071318508-1cdbcd80ad51?auto=format&fit=crop&w=200&q=80'
      });
    } else {
      await addDoc(collection(db, 'products'), {
        vendorId: docRef.id,
        name: 'Organic Apples',
        description: '1kg fresh apples',
        price: 150,
        category: 'Fruits',
        isAvailable: true,
        imageURL: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&w=200&q=80'
      });
    }
  }

  // Add Services
  const services = [
    {
      serviceName: 'Emergency Plumbing',
      category: 'plumber',
      description: 'Fix leaks and blocks instantly',
      basePrice: 499,
      durationMinutes: 60,
      isActive: true,
      vendorId: 'system'
    },
    {
      serviceName: 'Full House Cleaning',
      category: 'carpenter',
      description: 'Deep cleaning for your home',
      basePrice: 1999,
      durationMinutes: 240,
      isActive: true,
      vendorId: 'system'
    }
  ];

  for (const s of services) {
    await addDoc(collection(db, 'services'), s);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(console.error);
