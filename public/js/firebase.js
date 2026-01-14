// Firebase SDKs from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_7D4x4uGDaHk95bvWg-6YV6bOaxRdqxo",
    authDomain: "class-cut-calculator.firebaseapp.com",
    projectId: "class-cut-calculator",
    storageBucket: "class-cut-calculator.firebasestorage.app",
    messagingSenderId: "550190193734",
    appId: "1:550190193734:web:89a1918cc3a46ed1cbfe47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
