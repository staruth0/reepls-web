import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

function RegisterWithEmail2() {
  const { t } = useTranslation();
  const { email, password, username } = useSelector(
    (state: RootState) => state.user
  );
  //custom-hooks
  const {storeName}= useStoreCredential()
  //states
  const [name, setName] = useState<string>("");
  //navigate
  const navigate = useNavigate();
  //functions to handle DOM events

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    storeName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully!");
    console.log({
      email,password,username
    })
    navigateToCheckMail();
  };

    
  // functions to navigate
  const navigateToSignInWithEmail = () => {
    navigate("/auth/register/email");
  };
  const navigateToCheckMail = () => {
    navigate("/auth/register/checkmail");
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>Enter your name</div>
        <p>Almost there! Enter your legal name</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
          <InputField
            textValue={name}
            label={t("NameLabel")}
            type="text"
            placeholder={t("NamePlaceholder")}
            handleInputChange={handleNameChange}
          />
        </div>
        <button type="submit">{t("ContinueButton")}</button>
      </form>
      <div className="bottom__links">
        <div className="alternate__email" onClick={navigateToSignInWithEmail}>
          Create Account with Email instead
        </div>
      </div>
    </div>
  );
}

export default RegisterWithEmail2;
