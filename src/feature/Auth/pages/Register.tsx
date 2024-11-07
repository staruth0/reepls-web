import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
import { validatePassword } from "../../../utils/validatePassword";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; 

function Register() {
  const { t } = useTranslation(); 

  //states
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  //navigate
  const navigate = useNavigate();

  //functions to handle DOM events
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;

    if (/^[0-9]*$/.test(phoneValue)) {
      setPhone(phoneValue);
      setPhoneInputError(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordInputError(false);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhoneBlur = () => {
    if (!/^[0-9]{9}$/.test(phone) && phone !== "") {
      setPhoneInputError(true);
    }
  };

  const handlePasswordBlur = () => {
    const isPasswordValid = validatePassword(password);
    setPasswordInputError(!isPasswordValid && password !== "");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isPasswordValid = validatePassword(password);
    setPasswordInputError(!isPasswordValid);
    setPhoneInputError(phone.trim() === "" || !/^[0-9]{9}$/.test(phone));

    if (!isPasswordValid || phoneInputError) return;

    console.log("Form submitted successfully!");
    navigateToCheckPhone();
  };

  // functions to navigate
  const navigateToSignInWithEmail = () => {
    navigate("/auth/register/email");
  };
  const navigateToCheckPhone = () => {
    navigate("/auth/register/checkphone");
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("GetInformed")}</div>
        <p>{t("EnterEmailDescription")}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <InputField
          textValue={phone}
          label={t("PhoneNumberLabel")} 
          type="phone"
          placeholder={t("PhonePlaceholder")} 
          handleInputChange={handlePhoneNumberChange}
          handleBlur={handlePhoneBlur}
          isInputError={phoneInputError}
          inputErrorMessage={t("PhoneErrorMessage")} 
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
        <div className="alternate__email" onClick={navigateToSignInWithEmail}>
          {t("AlternateSignInWithEmail")}
        </div>
      </div>
    </div>
  );
}

export default Register;
