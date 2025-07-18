import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDIDjX8_oTtTUPTvd2PeKSkOkwQBEnE-l0",
  authDomain: "nutritrack-ai-46286.firebaseapp.com",
  projectId: "nutritrack-ai-46286",
  storageBucket: "nutritrack-ai-46286.appspot.com",
  messagingSenderId: "982936246412",
  appId: "1:982936246412:web:20c50c047e55d788fd83a9",
  measurementId: "G-172RBFG0YH"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Initialize Analytics if running in the browser
if (typeof window !== 'undefined') {
  getAnalytics(app);
}


export { app, auth, db, storage };
