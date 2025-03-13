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

  //custom'hooks
  const Login = useLoginUserWithPhone();
  // const { storeAccessToken,storeRefreshToken } = useTokenStorage();

  // states
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);

  // navigate
  const navigate = useNavigate();

  // functions to handle DOM events
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);
    storePhone(phoneValue);

    if (/^[0-9]{9}$/.test(phoneValue) || phoneValue === '') {
      setPhoneInputError(false);
    } else {
      setPhoneInputError(true);
    }
  };

  const handlePhoneBlur = () => {
    if (phone.trim() === '') {
      setPhoneInputError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      password: enteredPassword,
      phone: enteredPhone,
    });

    Login.mutate({
      password: enteredPassword,
      phone: `+237${enteredPhone}`,
    });
  };

  // functions to navigate
  const navigateToSignInWithEmail = () => {
    navigate('/auth/login/email');
  };

  useEffect(() => {
    if (Login.error) {
      toast.error(Login.error.message);
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
        {Login.error && <div className="text-red-500">{Login.error.message}</div>}
        <button type="submit">
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
