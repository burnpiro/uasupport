// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCnIHO0seWnkqZ15xBCIMsE4xLXsVg-Lwk',
  authDomain: 'ukraina-32e0b.firebaseapp.com',
  projectId: 'ukraina-32e0b',
  storageBucket: 'ukraina-32e0b.appspot.com',
  messagingSenderId: '988341542249',
  appId: '1:988341542249:web:35f1ad49d1d2d86b36f1f8',
  measurementId: 'G-D16EDV9NZC'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// external DB
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

// localhost firebase (it works only on emulated env)
// connectFirestoreEmulator(db, 'localhost', 8081);
// connectStorageEmulator(storage, 'localhost', 9199);
// connectAuthEmulator(auth, 'http://localhost:9099');
// connectFunctionsEmulator(functions, 'localhost', 5001);
