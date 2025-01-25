import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { validatePassword } from "../../../../utils/validatePassword";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";
import {  usePhoneRegisterUser} from "../../hooks/AuthHooks";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";


function RegisterWithPhone1() {
  const { t } = useTranslation();
  //custom-hooks
  const { storePassword } = useStoreCredential()
  const { mutate, isPending, error } = usePhoneRegisterUser();
  
    const { phone, password, username } = useSelector((state: RootState) => state.user);


  //states
  const [passwords, setPassword] = useState<string>("");
  const [passwordInputError, setPasswordInputError] = useState<boolean>(false);


  //functions to handle DOM events

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = e.target.value;
       setPassword(passwordValue);
       storePassword(passwordValue);

    if (validatePassword(passwordValue) || passwordValue==="") {
      setPasswordInputError(false);
    } else {
      setPasswordInputError(true)
    }
    
  };

  const handlePasswordBlur = () => {
    if (passwords === '') {
      setPasswordInputError(false);
    }
    
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    e.preventDefault();
    console.log("password stored", {
      phone: `+237${phone}`,
      password,
      username,
    });

    mutate({ phone: `+237${phone}`, password, username });

   
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
            textValue={passwords}
            label={t("PasswordLabel")}
            type="password"
            placeholder={t("PasswordPlaceholder")}
            handleInputChange={handlePasswordChange}
            handleBlur={handlePasswordBlur}
            isInputError={passwordInputError}
            inputErrorMessage={t("PasswordErrorMessage")}
          />
        </div>

        {error && <div>{ error.message}</div>}
        <button type="submit">
          {isPending ? "Loading....." : t("ContinueButton")}
        </button>
      </form>
    </div>
  );
}

export default RegisterWithPhone1;
