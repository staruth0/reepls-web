import React, { useState } from "react";
import InputField from "../components/InputField";
import "../styles/authpages.scss";
import { useTranslation } from "react-i18next"; 
import { validatePassword } from "../../../utils/validatePassword";
import { useStoreCredential } from "../hooks/useStoreCredential";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { google } from "../../../assets/icons";
import { useLoginUser } from "../hooks/AuthHooks";

function Loginwithemail() {
  const { t } = useTranslation();
  const { storeEmail, storePassword } = useStoreCredential();
  const { email: enteredEmail, password: enteredPassword } = useSelector(
    (state: RootState) => state.user
  );

  const Login = useLoginUser();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    storePassword(passwordValue);

    setPasswordInputError(!validatePassword(passwordValue) && passwordValue !== "");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    storeEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    Login.mutate(
      { password: enteredPassword, email: enteredEmail },
    );
  };

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
        <button type="submit">
          {Login.isPending ? "Logging in..." : t("ContinueButton")}
        </button>
        <div className="divider">
          <p>{t("OrDivider")}</p>
        </div>
        <button type="button" className="create__account__btn">
          <img src={google} alt="google_image" />
          <span>{t("Create account with google")}</span>
        </button>
      </form>
    </div>
  );
}

export default Loginwithemail;
