import React from "react";
import "../../styles/authpages.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import OTPInput from "../../components/OTPInput";

function Checkphone() {
  const { t } = useTranslation();

  // navigate
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully!");
    navigateToInterests();
  };

     const handleOtpComplete = (otp: string) => {
       console.log("Complete OTP:", otp);
     };
  // functions to navigate
  const navigateToInterests = () => {
    navigate("/auth/interests");
  };

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
