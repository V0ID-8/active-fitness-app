import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyD6H_-tmF0Wnw3HCjURrrl5tR0YcIO9Cp4',
  authDomain: 'active-fitness-app-85d4e.firebaseapp.com',
  projectId: 'active-fitness-app-85d4e',
  storageBucket: 'active-fitness-app-85d4e.firebasestorage.app',
  messagingSenderId: '488750404359',
  appId: '1:488750404359:web:0c3defde5f64a91c42aba2',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
