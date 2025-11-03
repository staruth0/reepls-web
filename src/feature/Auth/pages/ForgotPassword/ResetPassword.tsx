import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'react-toastify';
import InputField from '../../components/InputField';
import { useAuthErrorHandler } from '../../../../utils/errorHandler';
import { useResetPassword } from '../../hooks/AuthHooks';
import { validatePassword } from '../../../../utils/validatePassword';
import '../../styles/authpages.scss';

function ResetPassword() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();
  const getErrorMessage = useAuthErrorHandler('resetPassword');

  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Get email and token from navigation state
    console.log('ResetPassword - location.state:', location.state); // Debug log
    if (location.state?.email && location.state?.token) {
      setEmail(location.state.email);
      setToken(location.state.token);
      console.log('ResetPassword - token set:', location.state.token); // Debug log
    } else {
      console.log('ResetPassword - missing email or token, redirecting to forgot password'); // Debug log
      // If no email/token in state, redirect back to forgot password
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [location.state, navigate]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (passwordValue && !validatePassword(passwordValue)) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }

    // Also check confirm password if it has a value
    if (confirmPassword && passwordValue !== confirmPassword) {
      setConfirmPasswordError(true);
    } else if (confirmPassword) {
      setConfirmPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPasswordValue = e.target.value;
    setConfirmPassword(confirmPasswordValue);

    if (confirmPasswordValue && password !== confirmPasswordValue) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!password) {
      setPasswordError(true);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(true);
      return;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      return;
    }

    console.log('ResetPassword - submitting with:', { token, email, password: '***' }); // Debug log
    resetPasswordMutation.mutate({ token, email, password }, {
      onSuccess: (data) => {
        console.log('ResetPassword - success response:', data); // Debug log
        toast.success(t('PasswordResetSuccess', { defaultValue: 'Password reset successfully! You can now login with your new password.' }));
        navigate('/auth/login/email', { replace: true });
      },
      onError: () => {
        // Error is already displayed on the page
      }
    });
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('ResetPasswordTitle', { defaultValue: 'Reset Password' })}</div>
        <p>{t('ResetPasswordDescription', { defaultValue: 'Enter your new password below.' })}</p>
        {email && (
          <p className="code__message">
            {t('ResettingFor', { defaultValue: 'Resetting password for:' })} {email}
          </p>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={password}
          label={t('NewPasswordLabel', { defaultValue: 'New Password' })}
          type="password"
          placeholder={t('PasswordPlaceholder')}
          handleInputChange={handlePasswordChange}
          isInputError={passwordError}
          inputErrorMessage={t('IncorrectPasswordMessage', { defaultValue: 'Password must be at least 8 characters with uppercase, lowercase, number and special character' })}
        />
        
        <InputField
          textValue={confirmPassword}
          label={t('ConfirmPasswordLabel', { defaultValue: 'Confirm New Password' })}
          type="password"
          placeholder={t('ConfirmPasswordPlaceholder', { defaultValue: 'Confirm your new password' })}
          handleInputChange={handleConfirmPasswordChange}
          isInputError={confirmPasswordError}
          inputErrorMessage={t('PasswordsDoNotMatch', { defaultValue: 'Passwords do not match' })}
        />
        
        {resetPasswordMutation.error && (
          <div className="text-center py-2 text-red-500">
            {getErrorMessage(resetPasswordMutation.error)}
          </div>
        )}
        
        <button type="submit" className="hover:text-white" disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {resetPasswordMutation.isPending ? t('Resetting', { defaultValue: 'Resetting...' }) : t('ResetPassword', { defaultValue: 'Reset Password' })}
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

export default ResetPassword;
