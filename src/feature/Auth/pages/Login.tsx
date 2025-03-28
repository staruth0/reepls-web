import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RootState } from '../../../store';
import { validatePassword } from '../../../utils/validatePassword';
import InputField from '../components/InputField';
import { useLoginUserWithPhone } from '../hooks/AuthHooks';
import { useStoreCredential } from '../hooks/useStoreCredential';
import '../styles/authpages.scss';

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

function Login() {
  const { t } = useTranslation();
  const { storePhone, storePassword } = useStoreCredential();
  const { phone: enteredPhone, password: enteredPassword } = useSelector(
    (state: RootState) => state.user
  );

  const Login = useLoginUserWithPhone();
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);
  const navigate = useNavigate();

  const getErrorMessage = (error: ApiError) => {
    // Network errors (no response from server)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      return t('Network error. Please check your internet connection.');
    }

    // Timeout errors
    if (error.code === 'ECONNABORTED') {
      return t('Connection timeout. Please try again.');
    }

    // HTTP status code errors
    switch (error.response?.status) {
      case 400:
        return t('Invalid request. Please check your phone number and password.');
      case 401:
        return t('Invalid phone number or password. Please try again.');
      case 403:
        return t('Account not verified. Please verify your phone number first.');
      case 404:
        return t('Account not found. Please check your phone number.');
      case 408:
        return t('Request timeout. Please try again.');
      case 429:
        return t('Too many attempts. Please wait before trying again.');
      case 500:
        return t('Server error. Please try again later.');
      case 502:
        return t('Service unavailable. Please try again soon.');
      case 503:
        return t('Service maintenance in progress. Please check back later.');
      case 504:
        return t('Gateway timeout. Please try again.');
      default:
        return error.message || t('Login failed. Please try again.');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    storePassword(passwordValue);
    setPasswordInputError(!(validatePassword(passwordValue) || passwordValue === ''));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);
    storePhone(phoneValue);
    setPhoneInputError(!(/^[0-9]{9}$/.test(phoneValue) || phoneValue === ''));
  };

  const handlePhoneBlur = () => {
    if (phone.trim() === '') {
      setPhoneInputError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    Login.mutate({
      password: enteredPassword,
      phone: `+237${enteredPhone}`,
    });
  };

  useEffect(() => {
    if (Login.error) {
      const error = Login.error as ApiError;
      if (error.code === 'ERR_NETWORK') {
        toast.error(t('You appear to be offline'));
      }
    }
  }, [Login.error, t]);

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('GetInformed')}</div>
        <p>{t('Enter the phone number associated with your account to sign in')}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={phone}
          label={t('PhoneNumberLabel')}
          type="phone"
          placeholder={t('PhoneNumberPlaceholder')}
          handleInputChange={handlePhoneChange}
          handleBlur={handlePhoneBlur}
          isInputError={phoneInputError}
          inputErrorMessage={t('PhoneErrorMessage')}
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
          <div className="text-center text-red-500 my-2">
            {getErrorMessage(Login.error as ApiError)}
          </div>
        )}
        
        <button 
          type="submit" 
          className="hover:bg-primary-600 transition-colors"
          disabled={Login.isPending}
        >
          {Login.isPending && (
            <LuLoader className="animate-spin text-foreground inline-block mx-4" />
          )}
          {Login.isPending ? t('SigningIn') : t('ContinueButton')}
        </button>
      </form>
      <div className="bottom__links">
        <div 
          className="alternate__email hover:text-primary-500 cursor-pointer transition-colors" 
          onClick={() => navigate('/auth/login/email')}
        >
          {t('AlternateSignInWithEmail')}
        </div>
      </div>
    </div>
  );
}

export default Login;