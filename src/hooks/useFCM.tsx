// Custom hook for Firebase Cloud Messaging
import { useEffect, useState, useCallback } from 'react';
import { getFCMToken, onMessageListener, requestNotificationPermission } from '../services/firebaseMessaging';
import { apiClient } from '../services/apiClient';
import { useUser } from './useUser';
import { toast } from 'react-toastify';

export const useFCM = () => {
  const { authUser } = useUser();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Request permission and get FCM token
  const subscribeToFCM = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Wait for service worker to be ready
      if (!('serviceWorker' in navigator)) {
        toast.error('Service Worker is not supported in this browser');
        setIsLoading(false);
        return false;
      }

      // Ensure service worker is registered first
      let registration: ServiceWorkerRegistration;
      try {
        // Try to get existing registration
        registration = await navigator.serviceWorker.ready;
      } catch (error) {
        // If not ready, register it
        registration = await navigator.serviceWorker.register('/sw.js');
        // Wait for it to be ready
        registration = await navigator.serviceWorker.ready;
      }

      // Additional wait to ensure service worker is fully active
      if (registration.active) {
        // Good, service worker is active
      } else {
        // Wait a bit more for service worker to activate
        await new Promise(resolve => setTimeout(resolve, 500));
        registration = await navigator.serviceWorker.ready;
      }
      
      // Request notification permission
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        toast.error('Notification permission denied');
        setIsLoading(false);
        return false;
      }

      // Get FCM token with service worker registration
      const token = await getFCMToken(registration);
      if (!token) {
        toast.error('Failed to get FCM token. Please check console for details.');
        setIsLoading(false);
        return false;
      }

      setFcmToken(token);

      // Send token to backend
      if (authUser?.id) {
        try {
          await apiClient.post('/push-notification/subscribe', {
            token,
            userId: authUser.id,
            platform: 'web',
          });
          
          setIsSubscribed(true);
          toast.success('Notifications enabled successfully!');
          setIsLoading(false);
          return true;
        } catch (error: any) {
          console.error('Error subscribing to FCM:', error);
          
          // Extract error message from backend response
          let errorMessage = 'Failed to subscribe to notifications';
          
          if (error.response?.data) {
            // Backend returns: { error: { code: 400, message: "...", stack: "..." } }
            if (error.response.data.error?.message) {
              errorMessage = error.response.data.error.message;
              console.error('Backend error message:', error.response.data.error.message);
              console.error('Backend error code:', error.response.data.error.code);
              if (error.response.data.error.stack) {
                console.error('Backend error stack:', error.response.data.error.stack);
              }
            } else if (error.response.data.message) {
              errorMessage = error.response.data.message;
              console.error('Backend error message:', error.response.data.message);
            } else if (error.response.data.error) {
              errorMessage = typeof error.response.data.error === 'string' 
                ? error.response.data.error 
                : 'Failed to subscribe to notifications';
              console.error('Backend error:', error.response.data.error);
            }
          }
          
          // Log full error response for debugging
          console.error('Full error response:', error.response?.data);
          
          toast.error(errorMessage);
          setIsLoading(false);
          return false;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error: any) {
      console.error('Error in subscribeToFCM:', error);
      const errorMessage = error.message || 'Failed to enable notifications';
      toast.error(errorMessage);
      setIsLoading(false);
      return false;
    }
  }, [authUser?.id]);

  // Unsubscribe from FCM
  const unsubscribeFromFCM = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (fcmToken && authUser?.id) {
        try {
          await apiClient.post('/push-notification/unsubscribe', {
            token: fcmToken,
            userId: authUser.id,
          });
          setFcmToken(null);
          setIsSubscribed(false);
          toast.success('Notifications disabled successfully!');
          setIsLoading(false);
          return true;
        } catch (error) {
          console.error('Error unsubscribing from FCM:', error);
          toast.error('Failed to unsubscribe from notifications');
          setIsLoading(false);
          return false;
        }
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Error in unsubscribeFromFCM:', error);
      toast.error('Failed to disable notifications');
      setIsLoading(false);
      return false;
    }
  }, [fcmToken, authUser?.id]);

  // Initialize FCM on mount - Check subscription status from backend
  useEffect(() => {
    if (!authUser?.id) {
      return;
    }

    const initializeFCM = async () => {
      try {
        // Check with backend if user is subscribed
        try {
          const response = await apiClient.get(`/push-notification/status/${authUser.id}`);
          const statusData = response.data;
          
          if (statusData?.isSubscribed) {
            // User is subscribed on backend
            setIsSubscribed(true);
            
            // Try to get local token to sync with backend
            if ('serviceWorker' in navigator) {
              try {
                const registration = await navigator.serviceWorker.ready;
                const localToken = await getFCMToken(registration);
                if (localToken) {
                  setFcmToken(localToken);
                }
              } catch (error) {
                console.log('Could not get local FCM token, but user is subscribed on backend');
              }
            }
          } else {
            // User is not subscribed on backend
            setIsSubscribed(false);
            setFcmToken(null);
          }
        } catch (error: any) {
          // Backend endpoint error, fall back to local check
          console.log('Could not check subscription status from backend, checking locally:', error.message);
          
          // Fallback: Check if we have a local token
          if ('serviceWorker' in navigator) {
            try {
              const registration = await navigator.serviceWorker.ready;
              const token = await getFCMToken(registration);
              if (token) {
                setFcmToken(token);
                // If we have a token locally, assume subscribed (but should verify with backend)
                setIsSubscribed(true);
              } else {
                setIsSubscribed(false);
              }
            } catch (error) {
              console.error('Error getting local FCM token:', error);
              setIsSubscribed(false);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing FCM:', error);
        setIsSubscribed(false);
      }
    };

    // Small delay to ensure service worker is registered
    const timer = setTimeout(() => {
      initializeFCM();
    }, 2000);

    return () => clearTimeout(timer);
  }, [authUser?.id]);

  // Listen for foreground messages
  useEffect(() => {
    if (!authUser?.id) {
      return;
    }

    onMessageListener()
      .then((payload) => {
        console.log('Foreground message received:', payload);
        // Handle foreground message (already shown in firebaseMessaging.ts)
      })
      .catch((error) => {
        console.error('Error listening to foreground messages:', error);
      });
  }, [authUser?.id]);

  // Handle token refresh - check for token changes periodically and on visibility change
  useEffect(() => {
    if (!authUser?.id || !isSubscribed) {
      return;
    }

    let lastToken = fcmToken;

    const checkTokenRefresh = async () => {
      try {
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          const currentToken = await getFCMToken(registration);
          
          if (currentToken && currentToken !== lastToken) {
            console.log('FCM token refreshed, updating backend');
            lastToken = currentToken;
            setFcmToken(currentToken);
            
            // Update token on backend
            try {
              await apiClient.post('/push-notification/subscribe', {
                token: currentToken,
                userId: authUser.id,
                platform: 'web',
              });
              console.log('Token refresh: Backend updated successfully');
            } catch (error) {
              console.error('Token refresh: Failed to update backend:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error checking token refresh:', error);
      }
    };

    // Check token on visibility change (when user comes back to the app)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkTokenRefresh();
      }
    };

    // Check token periodically (every 5 minutes)
    const interval = setInterval(checkTokenRefresh, 5 * 60 * 1000);

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [authUser?.id, isSubscribed, fcmToken]);

  return {
    fcmToken,
    isSubscribed,
    isLoading,
    subscribeToFCM,
    unsubscribeFromFCM,
  };
};

