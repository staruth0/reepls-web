// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, Messaging, isSupported } from 'firebase/messaging';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration - you'll need to add these to your .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let messaging: Messaging | null = null;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase Messaging
 * Firebase v9+ automatically detects service worker when getToken() is called
 */
export const initializeMessaging = async (): Promise<Messaging | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const supported = await isSupported();
    if (!supported) {
      console.warn('Firebase Messaging is not supported in this browser.');
      return null;
    }

    // Initialize Firebase app if not already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    // Initialize Messaging (Firebase v9+ automatically detects service worker)
    // Service worker registration is handled when calling getToken()
    messaging = getMessaging(app);

    return messaging;
  } catch (error) {
    console.warn('Firebase Messaging initialization failed:', error);
    return null;
  }
};

if (typeof window !== 'undefined') {
  // Initialize Firebase app
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Analytics (optional)
  if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }
  }

  // Messaging will be initialized when service worker is ready
  // Call initializeMessaging() after service worker registration
}

export { app, messaging, analytics };

