import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
import { useTranslation } from "react-i18next";
import { LuLoader } from "react-icons/lu";
import { useSelector } from "react-redux";
import { google } from "../../../assets/icons";
import { RootState } from "../../../store";
import { validatePassword } from "../../../utils/validatePassword";
import { useLoginUser } from "../hooks/AuthHooks";
import { useStoreCredential } from "../hooks/useStoreCredential";
import { toast } from "react-toastify";

type ApiError = Error & {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  isAxiosError?: boolean;
  code?: string;
};

function Loginwithemail() {
  const { t } = useTranslation();
  const { storeEmail, storePassword } = useStoreCredential();
  const { email: enteredEmail, password: enteredPassword } = useSelector(
    (state: RootState) => state.user
  );

  const Login = useLoginUser();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  const getErrorMessage = (error: ApiError) => {
    // Network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return t('Network error. Please check your internet connection.');
    }

    // Timeout errors
    if (error.code === 'ECONNABORTED') {
      return t('Connection timeout. Please try again.');
    }

    // HTTP status code errors
    switch (error.response?.status) {
      case 400: return t('Invalid request. Please check your email and password.');
      case 401: return t('Invalid email or password. Please try again.');
      case 403: return t('Access denied. Please verify your email first.');
      case 404: return t('Account not found. Please check your email.');
      case 408: return t('Request timeout. Check your connection.');
      case 429: return t('Too many attempts. Please wait before trying again.');
      case 500: return t('Server error. Please try again later.');
      case 502: return t('Service unavailable. Please try again soon.');
      case 503: return t('Service maintenance in progress. Please check back later.');
      case 504: return t('Gateway timeout. Please try again.');
      default: return error.message || t('Login failed. Please try again.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    storePassword(passwordValue);
    setPasswordInputError(!(validatePassword(passwordValue) || passwordValue === ''));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    storeEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Login.mutate({
      password: enteredPassword,
      email: enteredEmail,
    });
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${encodeURIComponent(
      "http://localhost:5000/api-v1/googleAuth/google/callback"
    )}&scope=profile%20email&client_id=276268262458-4j71v7s7krk3h4j47d49gp5q72msvdh3.apps.googleusercontent.com`;
    window.location.href = googleAuthUrl;
  };

  // Show toast notifications for specific errors
  React.useEffect(() => {
    if (Login.error) {
      const error = Login.error as ApiError;
      
      if (error.code === 'ERR_NETWORK') {
        toast.error(t('You appear to be offline. Please check your internet connection.'));
      } else if (error.response?.status === 429) {
        toast.warning(t('Too many login attempts. Please wait before trying again.'));
      } else if (error.response?.status === 500) {
        toast.error(t('Server error. Our team has been notified.'));
      }
    }
  }, [Login.error, t]);

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("GetInformed")}</div>
        <p>{t("Enter your email and password to sign in")}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={email}
          label={t("EmailLabel")}
          type="email"
          placeholder={t("EmailPlaceholder")}
          handleInputChange={handleEmailChange}
        />
        <InputField
          textValue={password}
          label={t("PasswordLabel")}
          type="password"
          placeholder={t("PasswordPlaceholder")}
          handleInputChange={handlePasswordChange}
          isInputError={passwordInputError}
          inputErrorMessage={t("IncorrectPasswordMessage")}
        />
        
        {Login.error && (
          <div className="text-center text-red-500 my-2">
            {getErrorMessage(Login.error as ApiError)}
          </div>
        )}
        
        <button 
          type="submit" 
          className="hover:text-white transition-colors"
          disabled={Login.isPending}
        >
          {Login.isPending && (
            <LuLoader className="animate-spin text-foreground inline-block mx-4" />
          )}
          {Login.isPending ? t("SigningIn") : t("ContinueButton")}
        </button>
        
        <div className="divider">
          <p>{t("OrDivider")}</p>
        </div>
        
        <div
          className="flex items-center justify-center gap-2 bg-background rounded-full px-2 py-3 text-neutral-50 shadow-md hover:shadow-none cursor-pointer transition-all"
          onClick={handleGoogleLogin}
        >
          <img src={google} alt="google_image" className="size-6" />
          <span>{t("Login with google")}</span>
        </div>
      </form>
      <div className="bottom__links">
        {/* Alternate sign-in options can be added here */}
      </div>
    </div>
  );
}

export default Loginwithemail;