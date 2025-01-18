// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfwgm6buTZfHXwrSi7WYCgLcAQmNTbNk0",
  authDomain: "marquitusbusiness.firebaseapp.com",
  projectId: "marquitusbusiness",
  storageBucket: "marquitusbusiness.firebasestorage.app",
  messagingSenderId: "55628514551",
  appId: "1:55628514551:web:d8881b42a0b8c303c63ff2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };