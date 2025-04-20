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
    if (!error) return t('authErrors.generic', { defaultValue: "Something went wrong. Please try again." });
  
    // Handle network errors
    if (error.message.includes("Network Error")) {
      return t('authErrors.network', { defaultValue: "No internet connection. Check and retry." });
    }
  
    // Handle API response errors
    if (error.response?.status) {
      const status = error.response.status;
      const errorKey = `authErrors.loginWithPhone.${status}`;
      
      // Default messages mapped to status codes
      const defaultMessages: Record<number, string> = {
        400: "Invalid phone number or password format.",
        401: "Incorrect phone number or password.",
        404: "Account not found. Please sign up.",
        429: "Too many attempts. Wait and try again.",
        500: "Server error. Please try again later."
      };
  
      return t(errorKey, { 
        defaultValue: defaultMessages[status] || t('authErrors.generic') 
      });
    }
  
    // Fallback for unhandled errors
    return t('authErrors.generic');
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
          <div className=" text-center py-2 text-red-500">
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