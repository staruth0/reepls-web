import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { RootState } from '../../../../store';
import { validatePassword } from '../../../../utils/validatePassword';
import InputField from '../../components/InputField';
import { useRegisterUser } from '../../hooks/AuthHooks';
import { useStoreCredential } from '../../hooks/useStoreCredential';
import '../../styles/authpages.scss';
import { useNavigate } from 'react-router-dom';

function RegisterWithEmail1() {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useRegisterUser();
  const navigate = useNavigate();

  const { email, username } = useSelector((state: RootState) => state.user);

  // Custom hooks
  const { storePassword } = useStoreCredential();

  // States
  const [passwords, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  // Function to get friendly error messages specific to email registration
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return t('authErrors.generic', { defaultValue: "Something went wrong. Please try again." });
  
    // Handle network errors
    if (error.message.includes("Network Error")) {
      return t('authErrors.network', { defaultValue: "No internet connection. Check and retry." });
    }
  
    // Handle API response errors
    if (error.response?.status) {
      const status = error.response.status;
      const errorKey = `authErrors.signupWithEmail.${status}`;
      
      // Default messages mapped to status codes
      const defaultMessages: Record<number, string> = {
        400: "Invalid email format. Check and retry.",
        409: "Email already registered. Log in instead.",
        429: "Too many sign-ups. Wait and retry.",
        500: "Server error. Please try later."
      };
  
      return t(errorKey, { 
        defaultValue: defaultMessages[status] || t('authErrors.generic') 
      });
    }
  
    // Fallback for unhandled errors
    return t('authErrors.generic');
  };

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

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
            {getFriendlyErrorMessage(error)}
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