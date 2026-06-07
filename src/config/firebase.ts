import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Paste your Firebase project config here.
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6H_-tmF0Wnw3HCjURrrl5tR0YcIO9Cp4",
  authDomain: "active-fitness-app-85d4e.firebaseapp.com",
  projectId: "active-fitness-app-85d4e",
  storageBucket: "active-fitness-app-85d4e.firebasestorage.app",
  messagingSenderId: "488750404359",
  appId: "1:488750404359:web:0c3defde5f64a91c42aba2",
  measurementId: "G-ZF9TZZ5P7M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// console.firebase.google.com → Project settings → Your apps → Web app → SDK setup
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
