import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import OTPInput from '../../components/OTPInput';
import { useGetPhoneCode, useVerifyPhoneCode } from '../../hooks/AuthHooks';
import '../../styles/authpages.scss';

function Checkphone() {
  const { t } = useTranslation();
  const location = useLocation();
  const { phone } = location.state || {}; // Get phone from location state
  const [isCodeResent, setIsCodeResent] = useState(false);
  const navigate = useNavigate();

  //states
  const [otp, setOtp] = useState<string>('');

  // custom-hooks
  const codeGet = useGetPhoneCode();
  const codeVerify = useVerifyPhoneCode();

  // Define the type for defaultMessages
  interface ErrorMessages {
    fetch: { [key: number]: string };
    verify: { [key: number]: string };
  }

  // Function to get friendly error messages for phone verification
  const getFriendlyErrorMessage = (error: any, type: 'fetch' | 'verify'): string => {
    if (!error) {
      return t('authErrors.generic', { defaultValue: 'Something went wrong. Please try again.' });
    }

    // Handle network errors
    if (error.message?.includes('Network Error')) {
      return t('authErrors.network', {
        defaultValue: 'No internet connection. Please check your connection and try again.',
      });
    }

    // Handle API response errors
    if (error.response?.status) {
      const status = error.response.status;

      // Default messages for fetch (getting OTP) and verify (verifying OTP)
      const defaultMessages: ErrorMessages = {
        fetch: {
          400: 'Invalid phone number format. Please check and try again.',
          429: 'Too many requests. Please wait and try again.',
          500: 'Server error while sending code. Please try again.',
          404: 'Phone number not found. Please register first.', // Or a more specific message if applicable
        },
        verify: {
          400: 'Invalid or expired code. Please try again.',
          401: 'Incorrect code. Please check and try again.',
          429: 'Too many attempts. Please wait and try again.',
          500: 'Server error while verifying code. Please try again.',
        },
      } as const; // Use 'as const' for literal types

      // Safely access the message using translation key first, then fallback to default
      return t(`authErrors.checkPhone.${type}.${status}`, {
        defaultValue:
          defaultMessages[type][status] ?? t('authErrors.generic', { defaultValue: 'Something went wrong. Please try again.' }),
      });
    }

    return t('authErrors.generic', { defaultValue: 'Something went wrong. Please try again.' });
  };

  // Ensure phone number is present before proceeding
  useEffect(() => {
    if (!phone) {
      // Redirect to the phone registration step if phone number is missing
      // You'll need to define this route, e.g., '/auth/register/phone'
      navigate('/auth/register/phone');
    }
  }, [phone, navigate]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    codeVerify.mutate(
      { phone, code: otp },
      {
        onSuccess: () => {
          navigate("/auth/interests", { state: { phoneVerified: true } }); // Pass state to indicate phone is verified
        },
      }
    );
  };

  const handleOtpComplete = (otp: string) => {
    setOtp(otp);
  };

  const handleResendCode = () => {
    setIsCodeResent(true);
    handleCodeVerification();
  };

  const handleCodeVerification = async () => {
    codeGet.mutate({ phone });
  };

  useEffect(() => {
    if (phone) {
      handleCodeVerification();
    }
  }, [phone]);

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('CheckMessagesHeader')}</div>
        <div className="code__message">{t('CheckMessagesMessage')}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <OTPInput length={6} onComplete={handleOtpComplete} />
        {/* Display errors from fetching the code */}
        {codeGet.error && (
          <div className="text-red-500 text-center py-2">
            {getFriendlyErrorMessage(codeGet.error, 'fetch')}
          </div>
        )}
        {/* Display errors from verifying the code */}
        {codeVerify.error && (
          <div className="text-red-500 text-center py-2">
            {getFriendlyErrorMessage(codeVerify.error, 'verify')}
          </div>
        )}
        <button type="submit" disabled={codeVerify.isPending}>
          {codeVerify.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {codeVerify.isPending ? t('Verifying') : t('VerifyButton')}
        </button>
      </form>
      <div className="bottom__links">
        {isCodeResent ? (
          <div> {t('CodeResentMessagePhone', { defaultValue: 'Code Resent: Check your phone' })}</div>
        ) : (
          <div className="resend__text">
            {t('ResendPrompt')}
            <div className="bottom__link_resend cursor-pointer hover:underline" onClick={handleResendCode}>
              {t('ResendButton')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkphone;