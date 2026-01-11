import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB224EZPclzpbZL-gLJbE7cKo2JbCtdQ5k",
    authDomain: "smartbin-8d218.firebaseapp.com",
    databaseURL: "https://smartbin-8d218-default-rtdb.firebaseio.com",
    projectId: "smartbin-8d218",
    storageBucket: "smartbin-8d218.firebasestorage.app",
    messagingSenderId: "367181288674",
    appId: "1:367181288674:web:74fefae1cc3a22b7683abb",
    measurementId: "G-QCYX2N2V4D"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
