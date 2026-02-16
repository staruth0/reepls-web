import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { google } from "../../../../assets/icons";
import { useStoreCredential } from "../../hooks/useStoreCredential";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

function Registerwithemail() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { storeEmail } = useStoreCredential();
  const { email } = useSelector((state: RootState) => state.user);

  //states
  const [emailInput, setEmailInput] = useState<string>("");

  // Initialize form with stored data
  useEffect(() => {
    if (email) {
      setEmailInput(email);
    }
  }, [email]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    storeEmail(emailInput);
    navigate("/auth/register/email/two"); // Changed to navigate to name input
  };


  // const handleGoogleRegister = async () => { 
  //  navigate('/googleAuth/register')
  // }

  const handleGoogleLogin = () => {
    // Simply redirect to your backend Google auth route
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api-v1/googleAuth/google`;
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("GetInformed")}</div>
        <p>{t("Enter your email to create account")}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={emailInput}
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
          <Link to={"/auth/login/email"} className="bottom__link_login hover:underline">
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
