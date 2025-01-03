import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './feature/NotFound';
import useTheme from './hooks/useTheme';
import './index.css';
import { AuthRoutes } from './Routes/AuthRoutes';
import { HomeRoutes } from './Routes/HomeRoutes';
import { PostRoutes, Previewroutes } from './Routes/PostRoutes';
import { WebRoutes } from './Routes/WebRoutes';
import { ProfileRoutes } from './Routes/ProfileRoutes';

const router = createBrowserRouter([
  WebRoutes,
  HomeRoutes,
  AuthRoutes,
  PostRoutes,
  ProfileRoutes,
  Previewroutes,
  { path: '*', element: <NotFound /> }, // Catch-all route for 404
]);

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    console.log('Theme:', theme);
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;
