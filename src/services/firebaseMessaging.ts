// Firebase Cloud Messaging service
import { messaging, initializeMessaging } from './firebase';
import { getToken, onMessage, MessagePayload } from 'firebase/messaging';
import { toast } from 'react-toastify';

// VAPID key from Firebase Console -> Project Settings -> Cloud Messaging -> Web Push certificates
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission has been denied');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/**
 * Get FCM registration token
 * Ensures service worker is ready and active before getting token
 */
export const getFCMToken = async (serviceWorkerRegistration?: ServiceWorkerRegistration): Promise<string | null> => {
  try {
    // Ensure we have a service worker registration
    let registration = serviceWorkerRegistration;
    
    if (!registration && 'serviceWorker' in navigator) {
      // First, ensure service worker is registered
      try {
        registration = await navigator.serviceWorker.register('/sw.js');
        // Wait for it to be ready
        registration = await navigator.serviceWorker.ready;
      } catch (error) {
        // If registration fails, try to get existing one
        try {
          registration = await navigator.serviceWorker.ready;
        } catch (e) {
          console.error('Service Worker not available:', e);
          return null;
        }
      }
    }

    if (!registration) {
      console.warn('Service Worker registration is not available');
      return null;
    }

    // Ensure the service worker is active
    if (registration.active) {
      // Service worker is active, proceed
    } else if (registration.installing) {
      // Wait for service worker to activate
      await new Promise<void>((resolve) => {
        registration!.installing!.addEventListener('statechange', () => {
          if (registration!.installing!.state === 'activated') {
            resolve();
          }
        });
      });
    } else if (registration.waiting) {
      // Service worker is waiting, activate it
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      await new Promise<void>((resolve) => {
        const checkActive = () => {
          if (registration!.active) {
            resolve();
          } else {
            setTimeout(checkActive, 100);
          }
        };
        checkActive();
      });
    } else {
      console.warn('Service Worker is not in a valid state');
      return null;
    }

    // Ensure messaging is initialized
    let currentMessaging = messaging;
    
    if (!currentMessaging) {
      currentMessaging = await initializeMessaging();
    }

    if (!currentMessaging) {
      console.warn('Firebase Messaging is not initialized');
      return null;
    }

    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.warn('Notification permission not granted');
      return null;
    }

    // Get the registration token
    const token = await getToken(currentMessaging, {
      vapidKey: VAPID_KEY,
    });

    if (token) {
      console.log('FCM Registration token:', token);
      return token;
    } else {
      console.warn('No registration token available. Request permission to generate one.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while retrieving token:', error);
    return null;
  }
};

/**
 * Listen for foreground messages (when app is open)
 */
export const onMessageListener = async (): Promise<MessagePayload> => {
  return new Promise(async (resolve) => {
    let currentMessaging = messaging;
    
    // Ensure messaging is initialized
    if (!currentMessaging) {
      currentMessaging = await initializeMessaging();
    }
    
    if (!currentMessaging) {
      console.warn('Firebase Messaging is not initialized');
      return;
    }

    onMessage(currentMessaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Show notification using toast or custom notification
      if (payload.notification) {
        const { title, body, image } = payload.notification;
        
        // You can customize this to show a toast or custom notification
        toast.info(body || title || 'New notification', {
          position: 'top-right',
          autoClose: 5000,
        });

        // Or show a browser notification
        if (Notification.permission === 'granted') {
          new Notification(title || 'New Notification', {
            body: body || '',
            icon: image || '/favicon.png',
            badge: '/favicon.png',
            tag: payload.data?.type || 'notification',
            data: payload.data,
          });
        }
      }
      
      resolve(payload);
    });
  });
};

/**
 * Delete FCM token (for logout/unsubscribe)
 */
export const deleteFCMToken = async (): Promise<boolean> => {
  try {
    if (!messaging) {
      console.warn('Firebase Messaging is not initialized');
      return false;
    }

    // Note: Firebase doesn't have a direct deleteToken method
    // You'll need to handle this on the backend by removing the token from your database
    // The token will automatically become invalid if not used
    return true;
  } catch (error) {
    console.error('Error deleting FCM token:', error);
    return false;
  }
};

