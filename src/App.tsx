import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';
import NotFound from './feature/NotFound';
import useTheme from './hooks/useTheme';
import './index.css';
import { AuthRoutes } from './Routes/AuthRoutes';
import { UserRoutes } from './Routes/UserRoutes';
import { WebRoutes } from './Routes/WebRoutes';
import { apiClient } from './services/apiClient';
import { useFetchVapidPublicKey } from './feature/Notifications/hooks/useNotification';
import { useUser } from './hooks/useUser';

// Setting up routes for your app
const router = createBrowserRouter([WebRoutes, AuthRoutes, UserRoutes, { path: '*', element: <NotFound /> }]);

function App() {
  const { theme } = useTheme(); // Get the current theme (light/dark) of the app
  const { data } = useFetchVapidPublicKey();
  const {authUser} = useUser();

  function urlBase64ToUint8Array(base64String:string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}


  // Set the theme of the app based on the user's preferences
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : ''; // Apply dark theme if selected
  }, [theme]);



  // Function to subscribe to push notifications
  const subscribeToPush = async () => {
    const registration = await navigator.serviceWorker.ready; // Ensure Service Worker is ready

     // Check if the user is already subscribed
  const existingSubscription = await registration.pushManager.getSubscription();

  if (existingSubscription) {
    console.log('Already subscribed to push notifications.');
    return; // Stop here to avoid duplicate subscriptions
  }

    // Subscribe the user to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // Ensures notifications are always visible to the user
      applicationServerKey: urlBase64ToUint8Array(data.publicVapid), // VAPID public key to authenticate requests
    });

    // Extract the required subscription details
 const subscriptionData = {
  endpoint: subscription.endpoint,
  expirationTime: 20000,
  keys: {
    p256dh: subscription.toJSON().keys?.p256dh || '',
    auth: subscription.toJSON().keys?.auth || '',
  },
  userId: `${authUser.id}`,
};


    try {
      // Send subscription object to the backend
      await apiClient.post('/push-notification/subscribe', subscriptionData); // Replace URL with your backend endpoint
      console.log('Subscribed to push notifications!');
    } catch (error) {
      console.error('Subscription failed:', error); // Logs if the subscription fails
    }
  };

    // Register the service worker when the app loads
  useEffect(() => {
    console.log('vapiddata',data);
    if (!data?.publicVapid || !authUser?.id) return;
    
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // Check if Service Worker and PushManager are supported by the browser
      navigator.serviceWorker
        .register('/sw.js') // Register the service worker file at '/sw.js'
        .then((registration) => {
          console.log('Service Worker Registered:', registration); // Logs successful registration
          // Automatically subscribe to push notifications after Service Worker registers
          subscribeToPush();
        })
        .catch((error) => {
          console.error('Service Worker Error:', error); // Log error if the Service Worker fails to register
        });
    }
  }, [data,authUser?.id]); // Empty dependency array ensures this runs only once when the app loads

  return (
    <>
  
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
    </>
  );
}

export default App;