import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

function Loginwithemail() {
  const { t } = useTranslation(); 

  //states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  //navigate
  const navigate = useNavigate();

  //functions to handle DOM events
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordInputError(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully!");
  };

  // functions to navigate
  const navigateToSignInWithPhone = () => {
    navigate("/auth/login/phone");
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div className="welcome">{t("WelcomeBackToREEPLS")}</div>
        <div className="login">{t("Login")}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={email}
          label={t("EmailLabel")} 
          type="email"
          placeholder={t("EmailPlaceholder")} 
          handleInputChange={handleEmailChange}
        />
        <InputField
          textValue={password}
          label={t("PasswordLabel")} 
          type="password"
          placeholder={t("PasswordPlaceholder")} 
          handleInputChange={handlePasswordChange}
          isInputError={passwordInputError}
          inputErrorMessage={t("IncorrectPasswordMessage")} 
        />
        <button type="submit">{t("ContinueButton")}</button>
      </form>
      <div className="bottom__links">
        <p>
          {t("NoAccountPrompt")}{" "}
          <Link to={"/auth/register/phone"} className="bottom__link_login">
            {t("RegisterLink")}
          </Link>
        </p>
        <div className="alternate__email" onClick={navigateToSignInWithPhone}>
          {t("AlternateSignInWithPhone")}
        </div>
      </div>
    </div>
  );
}

export default Loginwithemail;
