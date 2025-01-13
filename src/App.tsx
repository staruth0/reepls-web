import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './feature/NotFound';
import useTheme from './hooks/useTheme';
import './index.css';
import { AuthRoutes } from './routes/AuthRoutes';
import { HomeRoutes } from './routes/HomeRoutes';
import { PostRoutes, Previewroutes } from './routes/PostRoutes';
import { ProfileRoutes } from './routes/ProfileRoutes';
import { UserRoutes } from './routes/UserRoutes';
import { WebRoutes } from './routes/WebRoutes';

const router = createBrowserRouter([
  WebRoutes,
  HomeRoutes,
  AuthRoutes,
  PostRoutes,
  ProfileRoutes,
  Previewroutes,
  UserRoutes,
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
