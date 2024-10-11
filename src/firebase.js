// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXLtFHMkRBTmVAlNmxfatoxlH6lVGoiP0",
  authDomain: "films-c763c.firebaseapp.com",
  projectId: "films-c763c",
  storageBucket: "films-c763c.appspot.com",
  messagingSenderId: "806934521515",
  appId: "1:806934521515:web:3e94fb86ef6948400b79ee",
  measurementId: "G-VXFSZBXPXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; 

