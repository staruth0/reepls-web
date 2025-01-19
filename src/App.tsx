import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './feature/NotFound';
import useTheme from './hooks/useTheme';
import './index.css';
import { AuthRoutes } from './routes/AuthRoutes';
import { UserRoutes } from './routes/UserRoutes';
import { WebRoutes } from './routes/WebRoutes';

const router = createBrowserRouter([
  WebRoutes,
  AuthRoutes,
  UserRoutes,
  { path: '*', element: <NotFound /> }, 
]);

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;
