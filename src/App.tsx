import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './feature/Blog/pages/Home';
import Welcome from './feature/Auth/pages/Welcome';
import Login from './feature/Auth/pages/Login';
import Register from './feature/Auth/pages/Register';
import Registerwithemail from './feature/Auth/pages/Registerwithemail';
import Loginwithemail from './feature/Auth/pages/Loginwithemail';
import Checkemail from './feature/Auth/pages/Checkemail';
import Checkphone from './feature/Auth/pages/Checkphone';
import { useEffect } from 'react';
import useTheme from './hooks/useTheme';
import AuthLayout from './feature/Auth/components/AuthLayout';




const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: "login/phone",
        element: <Login />,
      },
      {
        path: "login/email",
        element: <Loginwithemail />,
      },
      {
        path: "register/phone",
        element: <Register />,
      },
      {
        path: "register/email",
        element: <Registerwithemail />,
      },
      {
        path: "register/checkemail",
        element: <Checkemail/> ,
      },
      {
        path: "register/checkphone",
        element: <Checkphone/> ,
      },
    ],
  },
]);

function App() {
  const { theme} = useTheme();
  
  useEffect(() => {
    document.body.className = theme === 'dark' ? "dark-theme" : "";
  },[theme])

  return (
    <RouterProvider router={router}/>
  )
}

export default App;
