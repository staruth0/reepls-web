import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
// import {useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import { validatePassword } from "../../../utils/validatePassword";
import { useStoreCredential } from "../hooks/useStoreCredential";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { google } from "../../../assets/icons";

function Loginwithemail() {
    const { t } = useTranslation(); 
    const { storeEmail, storePassword } = useStoreCredential();
    const { email: enteredEmail, password: enteredPassword } = useSelector((state: RootState) => state.user);

  //states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  //navigate
  // const navigate = useNavigate();

  //functions to handle DOM events
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    storePassword(passwordValue)

    if (validatePassword(passwordValue) || passwordValue === "") {
      setPasswordInputError(false);
    } else {
      setPasswordInputError(true);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    storeEmail(e.target.value)
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully!");
    console.log({
      enteredEmail,enteredPassword
    })
  };

  // functions to navigate
  // const navigateToSignInWithPhone = () => {
  //   navigate("/auth/login/phone");
  // };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("GetInformed")}</div>
        <p>{t("Enter your email and password to sign in")}</p>
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
        <div className="divider">
          <p>{t("OrDivider")}</p>
        </div>
        <button type="button" className="create__account__btn">
          <img src={google} alt="google_image" />
          <span>{t("Create account with google")}</span>
        </button>
      </form>
      <div className="bottom__links">
        {/* <div className="alternate__email" onClick={navigateToSignInWithPhone}>
          {t("AlternateSignInWithPhone")}
        </div> */}
      </div>
    </div>
  );
}

export default Loginwithemail;
