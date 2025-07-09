// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgb0IMekSVMlzPHxvsD_k-uQ-2bF5x3FM",
  authDomain: "fir-project-346fe.firebaseapp.com",
  projectId: "fir-project-346fe",
  storageBucket: "fir-project-346fe.firebasestorage.app",
  messagingSenderId: "769713195340",
  appId: "1:769713195340:web:47a227e68259ae19c4a7e9",
  measurementId: "G-2HCF91GRFZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};

