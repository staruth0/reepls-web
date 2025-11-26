import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Bounce, ToastContainer} from 'react-toastify';
import NotFound from './feature/NotFound';
import useTheme from './hooks/useTheme';
import './index.css';
import { AuthRoutes } from './Routes/AuthRoutes';
import { UserRoutes } from './Routes/UserRoutes';
import { WebRoutes } from './Routes/WebRoutes';
import FloatingAudioPlayer from './components/molecules/Audio/FloatingAudioPlayer';
import { AudioPlayerProvider } from './context/AudioContext/AudioContextPlayer';
import NotificationPermissionPopup from './components/molecules/NotificationPermissionPopup';
import config from './config';

// Setting up routes for your app
const router = createBrowserRouter([WebRoutes, AuthRoutes, UserRoutes, { path: '*', element: <NotFound /> }]);

function App() {
  const { theme } = useTheme();

  // Apply theme
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : ''; 
  }, [theme]);

  // Register the service worker for FCM
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(async (registration) => {
          console.log('Service Worker registered successfully:', registration);
          
          // Wait for service worker to be ready
          const readyRegistration = await navigator.serviceWorker.ready;
          
          // Send Firebase config to service worker
          if (readyRegistration.active) {
            const firebaseConfig = {
              apiKey: config.firebase.apiKey,
              authDomain: config.firebase.authDomain,
              projectId: config.firebase.projectId,
              storageBucket: config.firebase.storageBucket,
              messagingSenderId: config.firebase.messagingSenderId,
              appId: config.firebase.appId,
            };
            
            readyRegistration.active.postMessage({
              type: 'FIREBASE_CONFIG',
              config: firebaseConfig,
            });
            console.log('Firebase config sent to service worker');
          }
          
          // Also register firebase-messaging-sw.js for Firebase
          navigator.serviceWorker
            .register('/firebase-messaging-sw.js')
            .then(() => {
              console.log('Firebase Messaging Service Worker registered');
            })
            .catch((err) => {
              console.warn('Firebase Messaging SW registration failed (this is OK if using main SW):', err);
            });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Note: Auto-subscription removed - users must explicitly enable notifications via toggle
  // The useFCM hook will still check subscription status silently on mount

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
      <NotificationPermissionPopup />
    </AudioPlayerProvider>
      
    </>
  );
}

export default App;