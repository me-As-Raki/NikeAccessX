import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Import auth

const firebaseConfig = {
  apiKey: "AIzaSyDe7ZqtlvgA0N83s8Ulynt3hQ_sXVsJnEM",
  authDomain: "nike-ai-cms.firebaseapp.com",
  projectId: "nike-ai-cms",
  storageBucket: "nike-ai-cms.appspot.com", // ✅ Fixed the domain (was incorrect)
  messagingSenderId: "786451806722",
  appId: "1:786451806722:web:aa235b000e02504212c51b",
  measurementId: "G-FVGB929W5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
