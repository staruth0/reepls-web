import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { google } from "../../../../assets/icons";
import { useStoreCredential } from "../../hooks/useStoreCredential";

function Registerwithemail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {storeEmail,storeName}= useStoreCredential()

  //states
  const [email, setEmail] = useState<string>("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    storeEmail(email);
    storeName(email)

    console.log("Email submitted successfully!");
    navigateToPassword();
  };


 const navigateToPassword = () => {
   navigate("/auth/register/email/one");
 };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("GetInformed")}</div>
        <p>{t("Enter your email to create account")}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={email}
          label={t("EmailLabel")}
          type="email"
          placeholder={t("EmailPlaceholder")}
          handleInputChange={handleEmailChange}
        />

        <button type="submit">{t("ContinueButton")}</button>
        <div className="divider">
          <p>{t("OrDivider")}</p>
        </div>
        <button type="button" className="create__account__btn">
          <img src={google} alt="google_image" />
          <span>{t("Create account with google")}</span>
        </button>
      </form>
      <div className="bottom__links">
        <p>
          {t("LoginPrompt")}{" "}
          <Link to={"/auth/login/phone"} className="bottom__link_login">
            {t("LoginLink")}
          </Link>
        </p>
        {/* <div className="alternate__email" onClick={navigateToSignInWithPhone}>
          {t("AlternateSignInWithPhone")}
        </div> */}
      </div>
    </div>
  );
}

export default Registerwithemail;
