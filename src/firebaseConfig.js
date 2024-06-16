// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAXjraor51lUadglu_ppLb4bqN9OPpbc5A",
  authDomain: "izakaya-1711424542019.firebaseapp.com",
  projectId: "izakaya-1711424542019",
  storageBucket: "izakaya-1711424542019.appspot.com",
  messagingSenderId: "599467736545",
  appId: "1:599467736545:web:42d95b0f20262b2f0626a0",
  measurementId: "G-QLKRY5LF5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/user.birthday.read');

export { auth, provider };
