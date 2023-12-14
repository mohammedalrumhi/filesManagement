// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBVaK4z3JegQ0l5QEi4h9iuqecCeoh3_Ao",
  authDomain: "twjeeh-dev-84df5.firebaseapp.com",
  projectId: "twjeeh-dev-84df5",
  storageBucket: "twjeeh-dev-84df5.appspot.com",
  messagingSenderId: "827206962887",
  appId: "1:827206962887:web:a29918caa123e5af7a38e2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export default app;
