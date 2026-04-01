import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { getFunctions, httpsCallable } from 'firebase/functions';

import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Messaging might not be supported in all environments (like iframes)
export const getSafeMessaging = async () => {
  try {
    const { isSupported } = await import('firebase/messaging');
    if (await isSupported()) {
      return getMessaging(app);
    }
  } catch (e) {
    console.warn('Messaging not supported', e);
  }
  return null;
};

export const functions = getFunctions(app);
