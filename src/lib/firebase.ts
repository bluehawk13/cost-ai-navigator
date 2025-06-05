
const firebaseConfig = {
  apiKey: "AIzaSyBH8vCZk4qO5mH2g6vK3dF8qR7sT9pL1mN2",
  authDomain: "ai-cost-optimizer.firebaseapp.com",
  projectId: "ai-cost-optimizer",
  storageBucket: "ai-cost-optimizer.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345",
  measurementId: "G-ABCDEFGHIJ"
};

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics
export const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
