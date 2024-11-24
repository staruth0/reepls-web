import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./feature/Blog/pages/Home";
import Welcome from "./feature/Auth/pages/Welcome";
import Login from "./feature/Auth/pages/Login";
import Registerwithphone0 from "./feature/Auth/pages/PhoneRegistration/Registerwithphone0";
import RegisterWithPhone1 from "./feature/Auth/pages/PhoneRegistration/RegisterWithPhone1";
import RegisterWithPhone2 from "./feature/Auth/pages/PhoneRegistration/RegisterWithPhone2";
import Registerwithemail from "./feature/Auth/pages/EmailRegistration/Registerwithemail";
import RegisterWithEmail1 from "./feature/Auth/pages/EmailRegistration/RegisterWithEmail1";
import RegisterWithEmail2 from "./feature/Auth/pages/EmailRegistration/RegisterWithEmail2";
import Loginwithemail from "./feature/Auth/pages/Loginwithemail";
import Checkemail from "./feature/Auth/pages/EmailRegistration/Checkemail";
import Checkphone from "./feature/Auth/pages/PhoneRegistration/Checkphone";
import { useEffect } from "react";
import useTheme from "./hooks/useTheme";
import AuthLayout from "./feature/Auth/components/AuthLayout";
import Interests from "./feature/Auth/pages/Interests";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {}
    ],
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
        element: <Registerwithphone0 />,
      },
      {
        path: "register/phone/one",
        element: <RegisterWithPhone1 />,
      },
      {
        path: "register/phone/two",
        element: <RegisterWithPhone2 />,
      },
      {
        path: "register/email",
        element: <Registerwithemail />,
      },
      {
        path: "register/email/one",
        element: <RegisterWithEmail1/>,
      },
      {
        path: "register/email/two",
        element: <RegisterWithEmail2/>,
      },
      {
        path: "register/checkemail",
        element: <Checkemail />,
      },
      {
        path: "register/checkphone",
        element: <Checkphone />,
      },
      {
        path: "interests",
        element: <Interests />,
      },
    ],
  },

]);

function App() {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.className = theme === "dark" ? "dark-theme" : "";
    console.log(theme)
  }, [theme]);

  return <RouterProvider router={router} />;
}

export default App;
