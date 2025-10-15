import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace with YOUR config from Firebase Console!
const firebaseConfig = {
  apiKey: ${{ secrets.GEMINI_KEY }},
  authDomain: "the-turnstile-26de6.firebaseapp.com",
  projectId: "the-turnstile-26de6",
  storageBucket: "the-turnstile-26de6.firebasestorage.app",
  messagingSenderId: "479603858919",
  appId: "1:479603858919:web:255ee9658de2fd30563142",
  measurementId: "G-38YPFKTWFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { app, db, auth };

