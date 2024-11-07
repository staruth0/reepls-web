import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

function Login() {
  const { t } = useTranslation(); 

  // states
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);

  // navigate
  const navigate = useNavigate();

  // functions to handle DOM events
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordInputError(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;

    if (/^[0-9]*$/.test(phoneValue)) {
      setPhone(phoneValue);
      setPhoneInputError(false);
    }
  };

  const handlePhoneBlur = () => {
    if (!/^[0-9]{9}$/.test(phone) && phone !== "") {
      setPhoneInputError(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully!");
  };

  // functions to navigate
  const navigateToSignInWithEmail = () => {
    navigate("/auth/login/email");
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div className="welcome">{t("WelcomeBackToREEPLS")}</div>
        <div className="login">{t("Login")}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={phone}
          label={t("PhoneNumberLabel")} 
          type="phone"
          placeholder={t("PhoneNumberPlaceholder")} 
          handleInputChange={handlePhoneChange}
          handleBlur={handlePhoneBlur}
          isInputError={phoneInputError}
          inputErrorMessage={t("PhoneInputErrorMessage")} 
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
          <Link to={"/auth/register/email"} className="bottom__link_login">
            {t("RegisterLink")}
          </Link>
        </p>
        <div className="alternate__email" onClick={navigateToSignInWithEmail}>
          {t("AlternateSignInWithEmail")}
        </div>
      </div>
    </div>
  );
}

export default Login;
