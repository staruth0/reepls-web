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

  // Set the theme of the app based on the user's preferences
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : ''; // Apply dark theme if selected
  }, [theme]);

  // Register the service worker when the app loads
  useEffect(() => {
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
  }, []); // Empty dependency array ensures this runs only once when the app loads

  // Function to subscribe to push notifications
  const subscribeToPush = async () => {
    const registration = await navigator.serviceWorker.ready; // Ensure Service Worker is ready

    // Subscribe the user to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true, // Ensures notifications are always visible to the user
      applicationServerKey: data.publicVapid, // VAPID public key to authenticate requests
    });

    // Extract the required subscription details
    const subscriptionData = {
      endpoint: subscription.endpoint, // The push service endpoint
      expirationTime: 20000, // Matching the format from the image
      keys: {
        p256dh: 'string',
        auth: 'string' 
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

  return (
    <>
      {/* RouterProvider renders the appropriate routes for the app */}
      <RouterProvider router={router} />
      {/* ToastContainer is used for in-app toast notifications */}
      <ToastContainer
        position="top-right" // Position of toast notifications
        autoClose={5000} // Auto dismiss after 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false} // Left-to-right layout
        pauseOnFocusLoss
        draggable // Toasts are draggable
        pauseOnHover
        theme={theme} // Toast follows current theme (light/dark)
        transition={Bounce} // Adds a bounce effect to toasts
      />
    </>
  );
}

export default App;