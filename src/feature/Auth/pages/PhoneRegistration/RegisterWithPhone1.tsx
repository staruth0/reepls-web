import React, { useState, useEffect } from 'react'; // Added useEffect
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { validatePassword } from '../../../../utils/validatePassword';
import InputField from '../../components/InputField';
import { usePhoneRegisterUser } from '../../hooks/AuthHooks';
import { useStoreCredential } from '../../hooks/useStoreCredential';
import '../../styles/authpages.scss';
import { toast } from 'react-toastify'; // Added for toast notifications

function RegisterWithPhone1() {
  const { t } = useTranslation();
  // Custom hooks
  const { storePassword } = useStoreCredential();
  const { mutate, isPending, error } = usePhoneRegisterUser();

  const { phone, password, username } = useSelector((state: RootState) => state.user);

  // States
  const [passwords, setPassword] = useState<string>('');
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  // Function to get friendly error messages specific to phone registration
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return t('GenericErrorMessage', { defaultValue: "Something went wrong. Please try again." });

    // Handle common error cases
    if (error.message.includes("Network Error")) {
      return t('NetworkErrorMessage', { defaultValue: "Oops! Looks like you’re offline. Check your connection and try again." });
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 400) {
        return t('BadRequestErrorMessage', { defaultValue: "Something’s not right with your input. Please check and try again." });
      }
      if (status === 409) {
        return t('ConflictErrorMessage', { defaultValue: "An account with this phone number already exists." });
      }
      if (status === 500) {
        return t('ServerErrorMessage', { defaultValue: "Our servers are having a moment. Please try again soon!" });
      }
      if (status === 429) {
        return t('RateLimitErrorMessage', { defaultValue: "Too many registration attempts! Please wait a bit and try again." });
      }
    }

    // Default fallback for unhandled errors
    return t('UnexpectedErrorMessage', { defaultValue: "Something unexpected happened during registration. Please try again." });
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

    console.log('password stored', {
      phone: `+237${phone}`,
      password,
      name: username,
    });

    mutate({ phone: `+${phone}`, password, name: username });
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
          <div className="text-neutral-50 text-center py-2">
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

export default RegisterWithPhone1;