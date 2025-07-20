// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD8Rt9WXQnd8EMlDZ1op-dhH5wl1Cximj0',
  // authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'expensr-2fa4d',
  // storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: '111740839007',
  appId: '1:111740839007:android:829446202f52f3532067ea',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);  // <-- This is important

export { db };
export { auth };
