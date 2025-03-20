import React, { useState } from 'react';
import InputField from '../components/InputField';
import '../styles/authpages.scss';
// import {useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { google } from '../../../assets/icons';
import { RootState } from '../../../store';
import { validatePassword } from '../../../utils/validatePassword';
import { useLoginUser } from '../hooks/AuthHooks';
import { useStoreCredential } from '../hooks/useStoreCredential';
// import { useNavigate } from 'react-router-dom';

function Loginwithemail() {
  const { t } = useTranslation();
  const { storeEmail, storePassword } = useStoreCredential();
  const { email: enteredEmail, password: enteredPassword } = useSelector((state: RootState) => state.user);
 
  //custom'hooks
  const Login = useLoginUser();
  // const { storeAccessToken,storeRefreshToken } = useTokenStorage();

  //states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  //navigate
  // const navigate = useNavigate();

  //functions to handle DOM events
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

  // const handleGoogleRegister = async () => { 
  //   navigate('/googleAuth/login')
  //  }

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
        {Login.error && <div>{Login.error.message}</div>}
        <button type="submit" className=" hover:text-white">
          {Login.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {Login.isPending ? 'Loging in......' : t('ContinueButton')}
        </button>
        <div className="divider">
          <p>{t('OrDivider')}</p>
        </div>
         <div className="flex items-center justify-center gap-2 bg-background rounded-full px-2 py-3 text-neutral-50 shadow-md hover:shadow-none cursor-pointer" onClick={handleGoogleLogin}>
                  <img src={google} alt="google_image" className="size-6" />
                  <span>{t("Login with google")}</span>
                </div>
      </form>
      <div className="bottom__links">
        {/* <div className="alternate__email" onClick={navigateToSignInWithPhone}>
          {t("AlternateSignInWithPhone")}
        </div> */}
      </div>
    </div>
  );
}

export default Loginwithemail;
