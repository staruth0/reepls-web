import React, { useEffect, useState } from "react";
import "../../styles/authpages.scss";
import { useNavigate,useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import OTPInput from "../../components/OTPInput";
import { useAuth } from "../../hooks/useAuth";

function Checkphone() {
  const { t } = useTranslation();
  
  const location = useLocation();
  const { phone } = location.state || {}; 

  //states
  const [otp,setOtp] = useState<string>('')

 // custom-hooks
  const { getPhoneCode, verifyPhone } = useAuth();

  // navigate
  const navigate = useNavigate();

  const handleSubmit = async  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log({
        phone,
        code: otp,
      });
      const res = await verifyPhone({
        phone,
        code: otp,
      });
      if (res) {
          navigateToInterests();
      }
    } catch (error) {
      console.error(error)
    }
  
  };

  const handleOtpComplete = (otp: string) => {
       console.log("Complete OTP:", otp);
       setOtp(otp);
  };
  
    const handleCodeVerification = async () => {
      try {
        const res = await getPhoneCode(phone);
        console.log("Code verification response:", res);
      } catch (error) {
        console.error("Error fetching email code:", error);
      }
    };
  // functions to navigate
  const navigateToInterests = () => {
    navigate("/auth/interests");
  };

  useEffect(() => {
    if (phone) {
      console.log(phone);
      handleCodeVerification();
    }
    
  }, []);

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("CheckMessagesHeader")}</div>
        <div className="code__message">{t("CheckMessagesMessage")}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <OTPInput length={6} onComplete={handleOtpComplete} />
        <button type="submit">{t("VerifyButton")}</button>
      </form>
      <div className="bottom__links">
        <div className="resend__text">
          {t("ResendPrompt")}
          <div onClick={navigateToInterests} className="bottom__link_resend">
            {t("ResendButton")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkphone;
