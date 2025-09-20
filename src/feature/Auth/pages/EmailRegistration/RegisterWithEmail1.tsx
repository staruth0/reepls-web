import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../../../store';
import { validatePassword } from '../../../../utils/validatePassword';
import { useAuthErrorHandler } from '../../../../utils/errorHandler';
import InputField from '../../components/InputField';
import { useRegisterUser } from '../../hooks/AuthHooks';
import { useStoreCredential } from '../../hooks/useStoreCredential';
import '../../styles/authpages.scss';
import { useNavigate } from 'react-router-dom';

function RegisterWithEmail1() {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useRegisterUser();
  const navigate = useNavigate();

  const { email, username, password } = useSelector((state: RootState) => state.user);

  // Custom hooks
  const { storePassword } = useStoreCredential();
  const getErrorMessage = useAuthErrorHandler('register');

  // States
  const [passwords, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  // Initialize form with stored data
  useEffect(() => {
    if (password) {
      setPassword(password);
    }
  }, [password]);

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getErrorMessage(error));
    }
  }, [error, getErrorMessage]);

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

  const handlePasswordBlur = () => {
    if (passwords === '') {
      setPasswordInputError(false);
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validatePassword(passwords)) {
      setPasswordInputError(true);
      return;
    }

    storePassword(passwords);

    console.log( { email, password: passwords, name: username })
    
    mutate(
      { email, password: passwords, name: username },
      {
        onSuccess: () => {
          navigate("/auth/register/checkemail", { state: { email } });
        },
        onError: (error: unknown) => {
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage);
          console.log("Error message:", errorMessage);
        }
      }
    );
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('Create your password')}</div>
        <p>{t('Create your password - description')}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <InputField
            textValue={passwords}
            label={t('PasswordLabel')}
            type="password"
            placeholder={t('PasswordPlaceholder')}
            handleInputChange={handlePasswordChange}
            handleBlur={handlePasswordBlur}
            isInputError={passwordInputError}
            inputErrorMessage={t('PasswordErrorMessage')}
          />
        </div>
        {error && (
          <div className="text-red-500 text-center py-2">
            {getErrorMessage(error)}
          </div>
        )}
        <button type="submit" disabled={isPending}>
          {isPending && <LuLoader className="animate-spin inline-block mx-4" />}
          {t('ContinueButton')}
        </button>
      </form>
    </div>
  );
}

export default RegisterWithEmail1;