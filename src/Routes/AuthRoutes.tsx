import AuthLayout from "../feature/Auth/components/AuthLayout";
import Checkemail from "../feature/Auth/pages/EmailRegistration/Checkemail";
import Registerwithemail from "../feature/Auth/pages/EmailRegistration/Registerwithemail";
import RegisterWithEmail1 from "../feature/Auth/pages/EmailRegistration/RegisterWithEmail1";
import RegisterWithEmail2 from "../feature/Auth/pages/EmailRegistration/RegisterWithEmail2";
import Interests from "../feature/Auth/pages/Interests";
import ForgotPassword from "../feature/Auth/pages/ForgotPassword/ForgotPassword";
import VerifyResetCode from "../feature/Auth/pages/ForgotPassword/VerifyResetCode";
import ResetPassword from "../feature/Auth/pages/ForgotPassword/ResetPassword";
import GoogleAuthCallback from "../feature/Auth/pages/GoogleAuthCallback";

import Loginwithemail from "../feature/Auth/pages/Loginwithemail";

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
        element: <Loginwithemail />,
      },
      {
        path: "login/email",
        element: <Loginwithemail />,
      },
      {
        path: "register/phone",
        element: <Registerwithemail />,
      },
      {
        path: "register/phone/one",
        element: <RegisterWithEmail1 />,
      },
      {
        path: "register/phone/two",
        element: <RegisterWithEmail2 />,
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
        element: <Checkemail />,
      },
      {
        path: "interests",
        element: <Interests />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-reset-code",
        element: <VerifyResetCode />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "google/callback",
        element: <GoogleAuthCallback />,
      },
    ],
  }

export { AuthRoutes };
