import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
const PUBLIC_FIREBASE_API_KEY = "AIzaSyC4dZnAnYlhq0AGCN_8D8_YQyr7JYryHkA";
const PUBLIC_FIREBASE_AUTH_DOMAIN = "tools-hub-297ed.firebaseapp.com";
const PUBLIC_FIREBASE_PROJECT_ID = "tools-hub-297ed";
const PUBLIC_FIREBASE_STORAGE_BUCKET = "tools-hub-297ed.firebasestorage.app";
const PUBLIC_FIREBASE_MESSAGING_SENDER_ID = "769028586660";
const PUBLIC_FIREBASE_APP_ID = "1:769028586660:web:e02e3654531a56c220fa31";
const PUBLIC_FIREBASE_MEASUREMENT_ID = "G-CK0R7MSXWQ";
const firebaseConfig = {
  apiKey: PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FIREBASE_APP_ID,
  measurementId: PUBLIC_FIREBASE_MEASUREMENT_ID
};
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
getAuth(app);
getFirestore(app);
getStorage(app);
if (typeof window !== "undefined") {
  getAnalytics(app);
}
