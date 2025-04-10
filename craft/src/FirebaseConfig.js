// firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDpHGfbJErPMRss5hLwtrjzQDzPZg3GOhs",
    authDomain: "crafto-34078.firebaseapp.com",
    projectId: "crafto-34078",
    storageBucket: "crafto-34078.firebasestorage.app",
    messagingSenderId: "206209931522",
    appId: "1:206209931522:web:a8b5a70ba84e7ee5cd8a1b"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, RecaptchaVerifier, signInWithPhoneNumber };
