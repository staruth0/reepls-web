import AuthLayout from "../feature/Auth/components/AuthLayout";
import Checkemail from "../feature/Auth/pages/EmailRegistration/Checkemail";
import Registerwithemail from "../feature/Auth/pages/EmailRegistration/Registerwithemail";
import RegisterWithEmail1 from "../feature/Auth/pages/EmailRegistration/RegisterWithEmail1";
import RegisterWithEmail2 from "../feature/Auth/pages/EmailRegistration/RegisterWithEmail2";
import Interests from "../feature/Auth/pages/Interests";
import Login from "../feature/Auth/pages/Login";
import Loginwithemail from "../feature/Auth/pages/Loginwithemail";
import Checkphone from "../feature/Auth/pages/PhoneRegistration/Checkphone";
import Registerwithphone0 from "../feature/Auth/pages/PhoneRegistration/Registerwithphone0";
import RegisterWithPhone1 from "../feature/Auth/pages/PhoneRegistration/RegisterWithPhone1";
import RegisterWithPhone2 from "../feature/Auth/pages/PhoneRegistration/RegisterWithPhone2";
import Welcome from "../feature/Auth/pages/Welcome";


const AuthRoutes =  {
    path: "/auth",
    element: <AuthLayout/>,
    children: [
      {
        index: true,
        element: <Welcome/>
      },
      {
        path: "login/phone",
        element: <Login/>,
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
        element: <RegisterWithEmail1 />,
      },
      {
        path: "register/email/two",
        element: <RegisterWithEmail2 />,
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
  }

export { AuthRoutes };
