import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuLoader } from 'react-icons/lu';
import { useLocation } from 'react-router-dom';
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

  // Handle OTP completion
  const handleOtpComplete = async (otp: string) => {
    console.log('Complete OTP:', otp);
    setOtp(otp);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    CodeVerify.mutate({
      email,
      code: otp,
    });
  };

  // Function to verify code
  const handleCodeVerification = async () => {
    CodeFetch.mutate({ email });
  };

  // Function to handle resend link
  const handleResendCode = () => {
    setIsCodeResent(true);
    handleCodeVerification();
  };

  // useEffect to fetch initial code
  useEffect(() => {
    if (email) {
      console.log(email);
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
      {CodeFetch.error && <div className="text-red-500">Fetching Code</div>}
      {CodeVerify.error && <div className="text-red-500">An Error Occured While Verifying the code</div>}
      <form onSubmit={handleSubmit}>
        <button type="submit">
          {CodeVerify.isPending && <LuLoader className="animate-spin text-foreground inline-block mx-4" />}
          {CodeVerify.isPending ? 'Verifying....' : t('VerifyButton')}
        </button>
      </form>
      <div className="bottom__links">
        {isCodeResent ? (
          <div> Code Resent: Check your email</div>
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
