import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import OTPInput from '../../components/OTPInput';
import { useGetEmailCode, useVerifyEmailCode } from '../../hooks/AuthHooks';
import '../../styles/authpages.scss';

function Checkemail() {
  const { t } = useTranslation();
  const location = useLocation();
  const { email } = location.state || {};

  const [otp, setOtp] = useState<string>('');

  const CodeFetch = useGetEmailCode();
  const CodeVerify = useVerifyEmailCode();

  // Handle OTP completion
  const handleOtpComplete = async (otp: string) => {
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
    handleCodeVerification();
  };

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
      {CodeFetch.error && <div className="text-red-500">Fetching Code</div>}
      {CodeVerify.error && <div className="text-red-500">An Error Occured While Verifying the code</div>}
      <form onSubmit={handleSubmit}>
        <button type="submit">{CodeVerify.isPending ? 'Verifying.....' : t('VerifyButton')}</button>
      </form>
      <div className="bottom__links">
        <div className="resend__text">
          {t('ResendPrompt')}
          <div onClick={handleResendCode} className="bottom__link_resend">
            {t('ResendLink')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkemail;
