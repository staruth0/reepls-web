import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { toast } from 'react-toastify';
import InputField from '../../components/InputField';
import { useVerifyResetPasswordCode } from '../../hooks/AuthHooks';
import '../../styles/authpages.scss';

function VerifyResetCode() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const verifyCodeMutation = useVerifyResetPasswordCode();

  const [code, setCode] = useState<string>('');
  const [codeError, setCodeError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Get email from navigation state
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If no email in state, redirect back to forgot password
      navigate('/auth/forgot-password', { replace: true });
    }
  }, [location.state, navigate]);

  const validateCode = (code: string): boolean => {
    // Assuming code is 6 digits
    const codeRegex = /^\d{6}$/;
    return codeRegex.test(code);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const codeValue = e.target.value.replace(/\D/g, ''); // Only allow digits
    setCode(codeValue);
    
    if (codeValue && !validateCode(codeValue)) {
      setCodeError(true);
    } else {
      setCodeError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!code) {
      setCodeError(true);
      return;
    }

    if (!validateCode(code)) {
      setCodeError(true);
      return;
    }

    verifyCodeMutation.mutate({ code, email }, {
      onSuccess: (data: { resetPasswordToken?: string; token?: string; resetToken?: string }) => {
        toast.success(t('CodeVerified', { defaultValue: 'Code verified successfully' }));
        console.log('Reset password verification response:', data); // Debug log
        navigate('/auth/reset-password', { 
          state: { 
            email, 
            token: data.resetPasswordToken || data.token || data.resetToken 
          },
          replace: true 
        });
      },
      onError: () => {
        // Error is already displayed on the page
      }
    });
  };

  const handleResendCode = () => {
    // Navigate back to forgot password to resend
    navigate('/auth/forgot-password', { 
      state: { email },
      replace: true 
    });
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('VerifyResetCodeTitle', { defaultValue: 'Verify Reset Code' })}</div>
        <p>{t('VerifyResetCodeDescription', { defaultValue: 'Enter the 6-digit code sent to your email address.' })}</p>
        {email && (
          <p className="code__message">
            {t('CodeSentTo', { defaultValue: 'Code sent to:' })} {email}
          </p>
        )}
      </div>
      
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={code}
          label={t('VerificationCodeLabel', { defaultValue: 'Verification Code' })}
          type="text"
          placeholder={t('CodePlaceholder', { defaultValue: 'Enter 6-digit code' })}
          handleInputChange={handleCodeChange}
          isInputError={codeError}
          inputErrorMessage={t('InvalidCode', { defaultValue: 'Please enter a valid 6-digit code' })}
        />
        
        {verifyCodeMutation.error && (
          <div className="text-center py-2 text-red-500">
            {verifyCodeMutation.error?.message || 
             verifyCodeMutation.error?.message || 
             t('CodeVerificationError', { defaultValue: 'Invalid verification code. Please try again.' })}
          </div>
        )}
        
        <button type="submit" className="hover:text-white" disabled={verifyCodeMutation.isPending}>
          {verifyCodeMutation.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {verifyCodeMutation.isPending ? t('Verifying', { defaultValue: 'Verifying...' }) : t('VerifyCode', { defaultValue: 'Verify Code' })}
        </button>
      </form>
      
      <div className="bottom__links">
        <p>
          {t('DidntReceiveCode', { defaultValue: "Didn't receive the code?" })}{" "}
          <button 
            onClick={handleResendCode} 
            className="bottom__link_login hover:underline"
            type="button"
          >
            {t('ResendCode', { defaultValue: 'Resend Code' })}
          </button>
        </p>
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

export default VerifyResetCode;
