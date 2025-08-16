import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Bounce, ToastContainer} from 'react-toastify';
import NotFound from './feature/NotFound';
import useTheme from './hooks/useTheme';
import './index.css';
import { AuthRoutes } from './Routes/AuthRoutes';
import { UserRoutes } from './Routes/UserRoutes';
import { WebRoutes } from './Routes/WebRoutes';
import { apiClient } from './services/apiClient';
import { useFetchVapidPublicKey } from './feature/Notifications/hooks/useNotification';
import { useUser } from './hooks/useUser';
import { getDecryptedAccessToken } from './feature/Auth/api/Encryption';
import FloatingAudioPlayer from './components/molecules/Audio/FloatingAudioPlayer';
import { AudioPlayerProvider } from './context/AudioContext/AudioContextPlayer';

// Setting up routes for your app
const router = createBrowserRouter([WebRoutes, AuthRoutes, UserRoutes, { path: '*', element: <NotFound /> }]);

// Type for subscription data
interface SubscriptionData {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId: string;
}

// Type for PushSubscription JSON result
interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime: number | null;
  keys?: {
    p256dh: string;
    auth: string;
  };
}

function App() {
  const { theme } = useTheme(); 
  const { data,  error } = useFetchVapidPublicKey();
  const { authUser } = useUser();
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(()=>{
    console.log("access token", getDecryptedAccessToken())
  },[])


  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    if (!base64String) {
      return new Uint8Array();
    }
    
    try {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
    } catch (error) {
      void error;
      return new Uint8Array();
    }
  }


  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : ''; 
  }, [theme]);

  // Register the service worker
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          setSwRegistration(registration);
        })
        .catch((error) => {
          void error;
         
        });
    } else {
      return
    }
  }, []);

  // Check notification permission
  useEffect(() => {
    const checkPermission = async () => {
      if ('Notification' in window) {
        const permission = Notification.permission;
        setPermissionGranted(permission === 'granted');
        
        if (permission === 'denied') {
          return
        }
      }
    };
    
    checkPermission();
  }, []);

  // Subscribe to push notifications
  useEffect(() => {
    const subscribeToPush = async () => {
      // Only proceed if we have all the necessary data
      if (!data?.publicVapid || !authUser?.id || !swRegistration || !permissionGranted) {
        return;
      }
      
      try {
        // Check for existing subscription
        const existingSubscription = await swRegistration.pushManager.getSubscription();
        
        if (existingSubscription) {
          // Get the subscription as JSON
          const subscriptionJSON = existingSubscription.toJSON() as PushSubscriptionJSON;
          

          const subscriptionData: SubscriptionData = {
            endpoint: existingSubscription.endpoint,
            expirationTime: existingSubscription.expirationTime || null,
            keys: {
              p256dh: subscriptionJSON.keys?.p256dh || '',
              auth: subscriptionJSON.keys?.auth || '',
            },
            userId: `${authUser.id}`,
          };
          
          await apiClient.post('/push-notification/subscribe', subscriptionData);
          return;
        }
        
        // Request permission if not already granted
        if (Notification.permission !== 'granted') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            return;
          }
          setPermissionGranted(true);
        }
        
        // Subscribe the user with properly converted VAPID key
        const applicationServerKey = urlBase64ToUint8Array(data.publicVapid);
        const subscription = await swRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });
        // Get the subscription as JSON
        const subscriptionJSON = subscription.toJSON() as PushSubscriptionJSON;
        // Prepare subscription data for backend
        const subscriptionData: SubscriptionData = {
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime || null,
          keys: {
            p256dh: subscriptionJSON.keys?.p256dh || '',
            auth: subscriptionJSON.keys?.auth || '',
          },
          userId: `${authUser.id}`,
        };
        
        // Send subscription to backend
        await apiClient.post('/push-notification/subscribe', subscriptionData);
      
      } catch (error: unknown) {
        void error;
        
      }
    };
    
    subscribeToPush();
  }, [data, authUser?.id, swRegistration, permissionGranted]);

  if (error) {
    void error;
  }



  return (
    <>
    <AudioPlayerProvider>
      <RouterProvider router={router} />
      
      
      
      <ToastContainer
        position="top-right" 
        autoClose={5000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false} 
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
        transition={Bounce} 
      />

      <FloatingAudioPlayer />
    </AudioPlayerProvider>
      
    </>
  );
}

export default App;