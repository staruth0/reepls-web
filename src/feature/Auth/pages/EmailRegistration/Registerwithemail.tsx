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

  const { storeEmail, storeName } = useStoreCredential()
  

  //states
  const [email, setEmail] = useState<string>("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    storeEmail(email);
    storeName(email)

    navigateToPassword();
  };


 const navigateToPassword = () => {
   navigate("/auth/register/email/one");
  };
  
  // const handleGoogleRegister = async () => { 
  //  navigate('/googleAuth/register')
  // }

    const handleGoogleLogin = () => {
      // Construct the Google OAuth2 URL
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${encodeURIComponent(
        'http://localhost:5000/api-v1/googleAuth/google/callback'
      )}&scope=profile%20email&client_id=276268262458-4j71v7s7krk3h4j47d49gp5q72msvdh3.apps.googleusercontent.com`;
  
      // Redirect the user to the Google OAuth2 URL
      window.location.href = googleAuthUrl;
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
        <div className="flex items-center justify-center gap-2 bg-background rounded-full px-2 py-3 text-neutral-50 shadow-md hover:shadow-none cursor-pointer" onClick={ handleGoogleLogin }>
          <img src={google} alt="google_image" className="size-6" />
          <span>{t("Create account with google")}</span>
        </div>
      </form>
      <div className="bottom__links">
        <p>
          {t("LoginPrompt")}{" "}
          <Link to={"/auth/login/phone"} className="bottom__link_login hover:underline">
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
