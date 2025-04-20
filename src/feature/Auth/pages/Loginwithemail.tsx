import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import '../styles/authpages.scss';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { google } from '../../../assets/icons';
import { RootState } from '../../../store';
import { validatePassword } from '../../../utils/validatePassword';
import { useLoginUser } from '../hooks/AuthHooks';
import { useStoreCredential } from '../hooks/useStoreCredential';
import { toast } from 'react-toastify'; // Added for toast notifications

function Loginwithemail() {
  const { t } = useTranslation();
  const { storeEmail, storePassword } = useStoreCredential();
  const { email: enteredEmail, password: enteredPassword } = useSelector((state: RootState) => state.user);

  // Custom hooks
  const Login = useLoginUser();

  // States
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  // Function to get friendly error messages specific to email login
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return t('authErrors.generic', { defaultValue: "Something went wrong. Please try again." });
  
    // Handle network errors
    if (error.message?.includes("Network Error")) {
      return t('authErrors.network', { defaultValue: "No internet connection. Check and retry." });
    }
  
    // Handle API response errors
    if (error.response?.status) {
      const status = error.response.status as keyof typeof defaultMessages; // Type assertion
      
      // Default messages with explicit type
      const defaultMessages = {
        400: "Email or password format is wrong.",
        401: "Wrong email or password. Try again.",
        404: "No account found with this email. Sign up!",
        429: "Too many attempts! Wait and retry.",
        500: "Server error. Please try again."
      } as const; // "as const" for precise typing
  
      // Type-safe access with fallback
      return t(`authErrors.loginWithEmail.${status}`, {
        defaultValue: defaultMessages[status] ?? t('authErrors.generic')
      });
    }
  
    return t('authErrors.generic');
  };

  // Toast error notification
  useEffect(() => {
    if (Login.error) {
      toast.error(getFriendlyErrorMessage(Login.error));
    }
  }, [Login.error]);

  // Functions to handle DOM events
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    storePassword(passwordValue);

    if (validatePassword(passwordValue) || passwordValue === '') {
      setPasswordInputError(false);
    } else {
      setPasswordInputError(true);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    storeEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      enteredEmail,
      enteredPassword,
    });

    Login.mutate({
      password: enteredPassword,
      email: enteredEmail,
    });
  };

  const handleGoogleLogin = () => {
    // Construct the Google OAuth2 URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${encodeURIComponent(
      'http://localhost:5000/api-v1/googleAuth/google/callback'
    )}&scope=profile%20email&client_id=276268262458-4j71v7s7krk3h4j47d49gp5q72msvdh3.apps.googleusercontent.com`;

    // Redirect the user to the Google OAuth2 URL
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('GetInformed')}</div>
        <p>{t('Enter your email and password to sign in')}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={email}
          label={t('EmailLabel')}
          type="email"
          placeholder={t('EmailPlaceholder')}
          handleInputChange={handleEmailChange}
        />
        <InputField
          textValue={password}
          label={t('PasswordLabel')}
          type="password"
          placeholder={t('PasswordPlaceholder')}
          handleInputChange={handlePasswordChange}
          isInputError={passwordInputError}
          inputErrorMessage={t('IncorrectPasswordMessage')}
        />
        {Login.error && (
          <div className=" text-center py-2 text-red-500">
            {getFriendlyErrorMessage(Login.error)}
          </div>
        )}
        <button type="submit" className="hover:text-white" disabled={Login.isPending}>
          {Login.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {Login.isPending ? 'Logging in...' : t('ContinueButton')}
        </button>
        <div className="divider">
          <p>{t('OrDivider')}</p>
        </div>
        <div
          className="flex items-center justify-center gap-2 bg-background rounded-full px-2 py-3 text-neutral-50 shadow-md hover:shadow-none cursor-pointer"
          onClick={handleGoogleLogin}
        >
          <img src={google} alt="google_image" className="size-6" />
          <span>{t("Login with google")}</span>
        </div>
      </form>
      <div className="bottom__links">
        {/* Uncomment and implement if needed */}
        {/* <div className="alternate__email" onClick={navigateToSignInWithPhone}>
          {t("AlternateSignInWithPhone")}
        </div> */}
      </div>
    </div>
  );
}

export default Loginwithemail;