import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { validatePassword } from "../../../../utils/validatePassword";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";


function RegisterWithPhone1() {
  const { t } = useTranslation();
  //custom-hooks
  const {storePassword} = useStoreCredential()


  //states
  const [password, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);

  //navigate
  const navigate = useNavigate();
  //functions to handle DOM events

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);

    if (validatePassword(passwordValue) || passwordValue==="") {
      setPasswordInputError(false);
    } else {
      setPasswordInputError(true)
    }
    
  };

  const handlePasswordBlur = () => {
    if (password === '') {
      setPasswordInputError(false);
    }
    
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Form submitted successfully!");
    storePassword(password)
    navigateToName();
  };

  // functions to navigate

 const navigateToName = () => {
   navigate("/auth/register/phone/two");
 };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("Create your password")}</div>
        <p>{t("Create your password - description")}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
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
        </div>

        <button type="submit">{t("ContinueButton")}</button>
      </form>
    </div>
  );
}

export default RegisterWithPhone1;
