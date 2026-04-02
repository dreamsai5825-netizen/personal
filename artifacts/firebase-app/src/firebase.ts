import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

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
