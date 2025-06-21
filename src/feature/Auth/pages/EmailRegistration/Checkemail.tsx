import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useLocation, useNavigate } from 'react-router-dom';
import OTPInput from '../../components/OTPInput';
import { useGetEmailCode, useVerifyEmailCode } from '../../hooks/AuthHooks';
import '../../styles/authpages.scss';

function Checkemail() {
  const { t } = useTranslation();
  const location = useLocation();
  const { email } = location.state || {};
  const [isCodeResent, setIsCodeResent] = useState(false);
  const [otp, setOtp] = useState<string>('');

  const CodeFetch = useGetEmailCode();
  const CodeVerify = useVerifyEmailCode();
  const navigate = useNavigate()
  // Define the type for defaultMessages
  interface ErrorMessages {
    fetch: { [key: number]: string };
    verify: { [key: number]: string };
  }

  // Function to get friendly error messages for email verification
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
          400: 'Invalid email format. Please check and try again.',
          429: 'Too many requests. Please wait and try again.',
          500: 'Server error while sending code. Please try again.',
          404: 'Email not found. Please register first.',
        },
        verify: {
          400: 'Invalid or expired code. Please try again.',
          401: 'Incorrect code. Please check and try again.',
          429: 'Too many attempts. Please wait and try again.',
          500: 'Server error while verifying code. Please try again.',
        },
      } as const;

      // Safely access the message
      return t(`authErrors.checkEmail.${type}.${status}`, {
        defaultValue:
          defaultMessages[type][status] ?? t('authErrors.generic', { defaultValue: 'Something went wrong. Please try again.' }),
      });
    }

    return t('authErrors.generic', { defaultValue: 'Something went wrong. Please try again.' });
  };



  // Handle OTP completion
  const handleOtpComplete = async (otp: string) => {
    setOtp(otp);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    CodeVerify.mutate({
      email,
      code: otp,
    },{
      onSuccess: () => {
        navigate("/auth/interests");
      }
    });
  };

  // Function to fetch OTP
  const handleCodeVerification = async () => {
    CodeFetch.mutate({ email });
  };

  // Function to handle resend link
  const handleResendCode = () => {
    setIsCodeResent(true);
    handleCodeVerification();
  };

  // Fetch initial code on mount
  useEffect(() => {
    if (email) {
      handleCodeVerification();
    }
  }, [email]);

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t('CheckMailHeader')}</div>
        <div className="code__message">{t('CheckMailMessage')}</div>
      </div>
      <OTPInput length={6} onComplete={handleOtpComplete} />
      {/* Optional: Keep inline errors for immediate feedback */}
      {CodeFetch.error && (
        <div className="text-red-500 text-center py-2">
          {getFriendlyErrorMessage(CodeFetch.error, 'fetch')}
        </div>
      )}
      {CodeVerify.error && (
        <div className="text-red-500 text-center py-2">
          {getFriendlyErrorMessage(CodeVerify.error, 'verify')}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={CodeVerify.isPending}>
          {CodeVerify.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {CodeVerify.isPending ? t('Verifying') : t('VerifyButton')}
        </button>
      </form>
      <div className="bottom__links">
        {isCodeResent ? (
          <div>{t('CodeResentMessage', { defaultValue: 'Code resent: Check your email' })}</div>
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

export default Checkemail;