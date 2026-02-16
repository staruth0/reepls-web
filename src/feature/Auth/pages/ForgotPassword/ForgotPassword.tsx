import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'react-toastify';
import InputField from '../../components/InputField';
import { useAuthErrorHandler } from '../../../../utils/errorHandler';
import { useForgotPassword } from '../../hooks/AuthHooks';
import '../../styles/authpages.scss';

function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const forgotPasswordMutation = useForgotPassword();
  const getErrorMessage = useAuthErrorHandler('forgotPassword');

  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    
    if (emailValue && !validateEmail(emailValue)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError(true);
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      return;
    }

    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        toast.success(t('ResetEmailSent', { defaultValue: 'Reset instructions sent to your email' }));
        navigate('/auth/verify-reset-code', { 
          state: { email },
          replace: true 
        });
      },
      onError: () => {
        // Error is already displayed on the page
      }
    });
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('ForgotPasswordTitle', { defaultValue: 'Forgot Password?' })}</div>
        <p>{t('ForgotPasswordDescription', { defaultValue: 'Enter your email address and we\'ll send you instructions to reset your password.' })}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={email}
          label={t('EmailLabel')}
          type="email"
          placeholder={t('EmailPlaceholder')}
          handleInputChange={handleEmailChange}
          isInputError={emailError}
          inputErrorMessage={t('InvalidEmail', { defaultValue: 'Please enter a valid email address' })}
        />
        
        {forgotPasswordMutation.error && (
          <div className="text-center py-2 text-red-500">
            {getErrorMessage(forgotPasswordMutation.error)}
          </div>
        )}
        
        <button type="submit" className="hover:text-white" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {forgotPasswordMutation.isPending ? t('Sending', { defaultValue: 'Sending...' }) : t('SendResetInstructions', { defaultValue: 'Send Reset Instructions' })}
        </button>
      </form>
      
      <div className="bottom__links">
        <p>
          {t('RememberPassword', { defaultValue: 'Remember your password?' })}{" "}
          <button 
            onClick={() => navigate('/auth/login/email')} 
            className="bottom__link_login hover:underline"
            type="button"
          >
            {t('BackToLogin', { defaultValue: 'Back to Login' })}
          </button>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
