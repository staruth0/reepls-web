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

function Login() {
  const { t } = useTranslation();
  const { storePhone, storePassword } = useStoreCredential();
  const { phone: enteredPhone, password: enteredPassword } = useSelector((state: RootState) => state.user);

  const Login = useLoginUserWithPhone();
  const navigate = useNavigate();

  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);

  // Function to get friendly error messages specific to login
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return t('GenericErrorMessage', { defaultValue: "Something went wrong. Please try again." });

    // Handle common error cases
    if (error.message.includes("Network Error")) {
      return t('NetworkErrorMessage', { defaultValue: "Oops! Looks like you’re offline. Check your connection and try again." });
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        return t('AuthErrorMessage', { defaultValue: "Incorrect phone number or password. Please try again." });
      }
      if (status === 404) {
        return t('NotFoundErrorMessage', { defaultValue: "We couldn’t find an account with that phone number." });
      }
      if (status === 500) {
        return t('ServerErrorMessage', { defaultValue: "Our servers are having a moment. Please try again soon!" });
      }
      if (status === 429) {
        return t('RateLimitErrorMessage', { defaultValue: "Too many login attempts! Please wait a bit and try again." });
      }
    }

    // Default fallback for unhandled errors
    return t('UnexpectedErrorMessage', { defaultValue: "Something unexpected happened during login. Please try again." });
  };

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

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    storePhone(value);

    // Validate phone number (minimum 8 digits including country code)
    const digitsOnly = value.replace(/\D/g, '');
    const isValid = digitsOnly.length >= 8 || value === '';
    setPhoneInputError(!isValid);
  };

  const handlePhoneBlur = () => {
    if (phone.trim() === '') {
      setPhoneInputError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before submission
    const digitsOnly = phone.replace(/\D/g, '');
    if (phone.trim() === "" || digitsOnly.length < 8) {
      setPhoneInputError(true);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordInputError(true);
      return;
    }

    console.log({
      password: enteredPassword,
      phone: enteredPhone,
    });

    Login.mutate({
      password: enteredPassword,
      phone: enteredPhone?.startsWith('+') ? enteredPhone : `+${enteredPhone}`,
    });
  };

  const navigateToSignInWithEmail = () => {
    navigate('/auth/login/email');
  };

  // Toast error notification
  useEffect(() => {
    if (Login.error) {
      toast.error(getFriendlyErrorMessage(Login.error));
    }
  }, [Login.error]);

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
          <div className="text-neutral-50 text-center py-2">
            {getFriendlyErrorMessage(Login.error)}
          </div>
        )}
        <button type="submit" disabled={Login.isPending}>
          {Login.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {t('ContinueButton')}
        </button>
      </form>
      <div className="bottom__links">
        <div className="alternate__email" onClick={navigateToSignInWithEmail}>
          {t('AlternateSignInWithEmail')}
        </div>
      </div>
    </div>
  );
}

export default Login;