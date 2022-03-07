// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnIHO0seWnkqZ15xBCIMsE4xLXsVg-Lwk",
  authDomain: "ukraina-32e0b.firebaseapp.com",
  projectId: "ukraina-32e0b",
  storageBucket: "ukraina-32e0b.appspot.com",
  messagingSenderId: "988341542249",
  appId: "1:988341542249:web:35f1ad49d1d2d86b36f1f8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// localhost firebase
// export const db = getFirestore();
// connectFirestoreEmulator(db, 'localhost', 8081);