import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCmHfwKV80lfxJHbXr9za2HPZUSaYdPBjw",
    authDomain: "r-mart-c0286.firebaseapp.com",
    projectId: "r-mart-c0286",
    storageBucket: "r-mart-c0286.firebasestorage.app",
    messagingSenderId: "628917108412",
    appId: "1:628917108412:web:169735a85ccc1804285ab9",
    measurementId: "G-3S5RLD345D"
};

// Initialize Firebase (Singleton pattern to avoid re-initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };
