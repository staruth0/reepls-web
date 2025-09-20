import React, { useState, useEffect } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

function RegisterWithEmail2() {
  const { t } = useTranslation();
  const { storeName } = useStoreCredential();
  const { username } = useSelector((state: RootState) => state.user);
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  // Initialize form with stored data
  useEffect(() => {
    if (username) {
      setName(username);
    }
  }, [username]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    storeName(name);
    navigate("/auth/register/email/one"); 
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

export default RegisterWithEmail2;