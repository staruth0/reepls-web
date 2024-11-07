import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
import { validatePassword } from "../../../utils/validatePassword";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Registerwithemail() {
  const { t } = useTranslation();

  //states
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  //navigate
  const navigate = useNavigate();

  //functions to handle DOM events
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordInputError(false);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordBlur = () => {
    const isPasswordValid = validatePassword(password);
    setPasswordInputError(!isPasswordValid && password !== "");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPasswordValid = validatePassword(password);
    setPasswordInputError(!isPasswordValid);

    if (!isPasswordValid) return;

    console.log("Form submitted successfully!");
    navigateToCheckEmail();
  };

  // functions to navigate
  const navigateToSignInWithPhone = () => {
    navigate("/auth/register/phone");
  };

  const navigateToCheckEmail = () => {
    navigate("/auth/register/checkemail");
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("GetInformed")}</div>
        <p>{t("EnterEmailDescription")}</p>
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
          handleBlur={handlePasswordBlur}
          isInputError={passwordInputError}
          inputErrorMessage={t("PasswordErrorMessage")}
        />
        <InputField
          textValue={name}
          label={t("NameLabel")}
          type="text"
          placeholder={t("NamePlaceholder")}
          handleInputChange={handleNameChange}
        />

        <button type="submit">{t("ContinueButton")}</button>
      </form>
      <div className="bottom__links">
        <p>
          {t("LoginPrompt")}{" "}
          <Link to={"/auth/login/phone"} className="bottom__link_login">
            {t("LoginLink")}
          </Link>
        </p>
        <div className="alternate__email" onClick={navigateToSignInWithPhone}>
          {t("AlternateSignInWithPhone")}
        </div>
      </div>
    </div>
  );
}

export default Registerwithemail;
