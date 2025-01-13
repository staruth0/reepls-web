import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './feature/NotFound';
import useTheme from './hooks/useTheme';
import './index.css';
import { AuthRoutes } from './Routes/AuthRoutes';
import { UserRoutes } from './Routes/UserRoutes';
import { WebRoutes } from './Routes/WebRoutes';

const router = createBrowserRouter([
  WebRoutes,
  AuthRoutes,
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
