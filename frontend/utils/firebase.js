import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY || "AIzaSyDemoApiKeyForFresherAIApp123456",
  authDomain: "fresherai-68ed5.firebaseapp.com",
  projectId: "fresherai-68ed5",
  storageBucket: "fresherai-68ed5.firebasestorage.app",
  messagingSenderId: "676053165869",
  appId: "1:676053165869:web:bab410f6510119eae755a4",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };
