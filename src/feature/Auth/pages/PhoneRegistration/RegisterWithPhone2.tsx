import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";




function RegisterWithPhone2() {
  const { t } = useTranslation();
  //custom-hooks
  const { storeName } = useStoreCredential()

  //states
  const [name, setName] = useState<string>("");
  //navigate
  const navigate = useNavigate();
  //functions to handle DOM events

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    storeName(e.target.value)
    setName(e.target.value)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    storeName(name)
    navigate("/auth/register/phone/one");
  };

  

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("Enter your name")}</div>
        <p>{t("Almost there! Enter your legal name")}</p>
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
     
    </div>
  );
}

export default RegisterWithPhone2;
