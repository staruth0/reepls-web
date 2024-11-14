import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import { validatePassword } from "../../../utils/validatePassword";
import { useStoreCredential } from "../hooks/useStoreCredential";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

function Login() {
  const { t } = useTranslation(); 
  const { storePhone, storePassword } = useStoreCredential()
  const { phone:enteredPhone, password:enteredPassword } = useSelector((state:RootState) => state.user);

  // states
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);

  // navigate
  const navigate = useNavigate();

  // functions to handle DOM events
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const passwordValue = e.target.value;
      setPassword(passwordValue);
      storePassword(passwordValue);

      if (validatePassword(passwordValue) || passwordValue === "") {
        setPasswordInputError(false);
      } else {
        setPasswordInputError(true);
      }
    };

const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const phoneValue = e.target.value;
  setPhone(phoneValue);
  storePhone(phoneValue);

  if (/^[0-9]{9}$/.test(phoneValue) || phoneValue === "") {
    setPhoneInputError(false);
  } else {
    setPhoneInputError(true);
  }
};

const handlePhoneBlur = () => {
  if (phone.trim() === "") {
    setPhoneInputError(false);
  }
};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({

      enteredPassword,enteredPhone
    })
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
