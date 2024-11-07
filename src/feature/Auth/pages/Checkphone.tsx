import React from "react";
import "../styles/authpages.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

function Checkphone() {
  const { t } = useTranslation();

  // navigate
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully!");
    navigateToHomepage();
  };

  // functions to navigate
  const navigateToHomepage = () => {
    navigate("/");
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("CheckMessagesHeader")}</div>
        <div className="code__message">{t("CheckMessagesMessage")}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit">{t("VerifyButton")}</button>
      </form>
      <div className="bottom__links">
        <div className="resend__text">
          {t("ResendPrompt")}
          <div onClick={navigateToHomepage} className="bottom__link_resend">
            {t("ResendButton")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkphone;
