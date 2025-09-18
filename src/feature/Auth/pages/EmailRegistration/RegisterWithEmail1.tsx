import React, { useEffect, useState, useCallback } from 'react';
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

  // Function to get error messages from backend
  const getErrorMessage = useCallback((error: unknown): string => {
    if (!error) return t('authErrors.generic', { defaultValue: "Something went wrong. Please try again." });
  
    // Type guard for error with message property
    const isErrorWithMessage = (err: unknown): err is { message: string } => {
      return typeof err === 'object' && err !== null && 'message' in err && typeof (err as Record<string, unknown>).message === 'string';
    };

    // Type guard for error with response property
    const isErrorWithResponse = (err: unknown): err is { response: { data: unknown; status: number } } => {
      return typeof err === 'object' && err !== null && 'response' in err;
    };
  
    // Handle network errors
    if (isErrorWithMessage(error) && error.message.includes("Network Error")) {
      return t('authErrors.network', { defaultValue: "No internet connection. Check and retry." });
    }
  
    // Try to get the actual error message from backend
    if (isErrorWithResponse(error) && error.response?.data) {
      const backendError = error.response.data as Record<string, unknown>;
      
      // Check for different possible error message formats
      if (typeof backendError.message === 'string') {
        return backendError.message;
      }
      
      if (typeof backendError.error === 'string') {
        return backendError.error;
      }
      
      if (typeof backendError.details === 'string') {
        return backendError.details;
      }
      
      if (Array.isArray(backendError.errors) && backendError.errors.length > 0) {
        const firstError = backendError.errors[0];
        if (typeof firstError === 'string') {
          return firstError;
        }
        if (typeof firstError === 'object' && firstError !== null && 'message' in firstError && typeof (firstError as Record<string, unknown>).message === 'string') {
          return (firstError as Record<string, unknown>).message as string;
        }
      }
      
      // If it's an object with nested messages
      if (typeof backendError === 'object') {
        const firstError = Object.values(backendError)[0];
        if (typeof firstError === 'string') {
          return firstError;
        }
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0] as string;
        }
      }
    }
  
    // Fallback to status-based messages if no specific message found
    if (isErrorWithResponse(error) && error.response?.status) {
      const status = error.response.status;
      const defaultMessages: Record<number, string> = {
        400: "Invalid request. Please check your input.",
        409: "Email already registered. Log in instead.",
        429: "Too many sign-ups. Wait and retry.",
        500: "Server error. Please try later."
      };
      return defaultMessages[status] || t('authErrors.generic');
    }
  
    // Fallback for unhandled errors
    return isErrorWithMessage(error) ? error.message : t('authErrors.generic');
  }, [t]);

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
        onError: (error: any) => {
          toast.error(error.response.data.message);
          console.log("error.response.data.message", error.response.data.message);
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