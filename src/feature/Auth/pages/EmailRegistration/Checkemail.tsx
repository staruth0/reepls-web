import { useEffect, useState } from "react";
import "../../styles/authpages.scss";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OTPInput from "../../components/OTPInput";
import { useAuth } from "../../hooks/useAuth";

function Checkemail() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; 

  const [otp,setOtp] = useState<string>('')
  const { getEmailCode, verifyEmail } = useAuth();

  // Handle OTP completion
  const handleOtpComplete = async (otp: string) => {
    console.log("Complete OTP:", otp);
    setOtp(otp)
    
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await verifyEmail({
        email,
        code: otp,
      });
      if (response) {
        console.log(response.message)
        navigateToInterests();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  // Function to verify code
  const handleCodeVerification = async () => {
    try {
      const res = await getEmailCode({email});
      console.log("Code verification response:", res);
    } catch (error) {
      console.error("Error fetching email code:", error);
    }
  };

  // Function to handle resend link
  const handleResendCode = () => {
    handleCodeVerification();
  };

  // Navigate to interests page
  const navigateToInterests = () => {
    navigate("/auth/interests");
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
        <div>{t("CheckMailHeader")}</div>
        <div className="code__message">{t("CheckMailMessage")}</div>
      </div>
      <OTPInput length={6} onComplete={handleOtpComplete} />
      <form onSubmit={handleSubmit}>
        <button type="submit">
          {t("VerifyButton")}
        </button>
      </form>
      <div className="bottom__links">
        <div className="resend__text">
          {t("ResendPrompt")}
          <div onClick={handleResendCode} className="bottom__link_resend">
            {t("ResendLink")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkemail;
