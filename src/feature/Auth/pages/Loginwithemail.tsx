import React, {  useState } from 'react';
import InputField from '../components/InputField';
import '../styles/authpages.scss';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { google } from '../../../assets/icons';
import { RootState } from '../../../store';
import { validatePassword } from '../../../utils/validatePassword';
import { useAuthErrorHandler } from '../../../utils/errorHandler';
import { useLoginUser } from '../hooks/AuthHooks';
import { useStoreCredential } from '../hooks/useStoreCredential';
import { Link } from 'react-router-dom';

function Loginwithemail() {
  const { t } = useTranslation();
  const { storeEmail, storePassword } = useStoreCredential();
  const { email: enteredEmail, password: enteredPassword } = useSelector((state: RootState) => state.user);

  // Custom hooks
  const Login = useLoginUser();
  const getErrorMessage = useAuthErrorHandler('login');

  // States
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);


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
   

    Login.mutate({
      password: enteredPassword,
      email: enteredEmail,
    });
  };

  const handleGoogleLogin = () => {
    // Construct the Google OAuth2 URL
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api-v1/googleAuth/google`;
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
        <div className="forgot__password__link">
          <Link to="/auth/forgot-password" className="forgot__password__text">
            {t('ForgotPassword')}
          </Link>
        </div>
        {Login.error && (
          <div className=" text-center py-2 text-red-500">
            {getErrorMessage(Login.error)}
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
        <p>
          {t("NoAccountPrompt")}{" "}
          <Link to={"/auth/register/email"} className="bottom__link_login hover:underline">
            {t("SignUpButton")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Loginwithemail;