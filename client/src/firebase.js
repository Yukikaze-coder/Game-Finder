import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD3zKPgxUrP2YvUvh2BhVJT1KlajeESGu4",
  authDomain: "game-finder-ca560.firebaseapp.com",
  projectId: "game-finder-ca560",
  storageBucket: "game-finder-ca560.firebasestorage.app",
  messagingSenderId: "1013520454597",
  appId: "1:1013520454597:web:341c43cdab7d996b4d31ac",
  measurementId: "G-6D7WJWKXDJ"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const analytics = getAnalytics(app);
