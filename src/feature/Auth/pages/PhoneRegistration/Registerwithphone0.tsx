import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss"
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";


function Registerwithphone0() {
  const { t } = useTranslation();

  //custom-hooks
  const { storePhone,storeName } = useStoreCredential();
 

  //states
  const [phone, setPhone] = useState<string>("");
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);

  //navigate
  const navigate = useNavigate();

  //functions to handle DOM events
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setPhone(phoneValue);
    storeName(phoneValue);

    if (/^[0-9]{9}$/.test(phoneValue) || phoneValue === '') {
      setPhoneInputError(false);
    } else {
      setPhoneInputError(true)
    } 
  };

  const handlePhoneBlur = () => {
    if (phone.trim() === "") {
      setPhoneInputError(false);
    }
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (phone.trim() === "" || !/^[0-9]{9}$/.test(phone)) {
      setPhoneInputError(true);
      return
    }
     
    storePhone(phone)

    navigateToPassword();
  };

  // functions to navigate
  const navigateToSignInWithEmail = () => {
    navigate("/auth/register/email");
  };
  const navigateToPassword = () => {
    navigate("/auth/register/phone/one");
  };

  return (
    <div className="register__phone__container">
      <div className="insightful__texts">
        <div>{t("GetInformed")}</div>
        <p>{t("EnterEmailDescription")}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div>
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
        </div>

        <button type="submit">{t("ContinueButton")}</button>
      </form>
      <div className="bottom__links">
        <div className="alternate__email" onClick={navigateToSignInWithEmail}>
         {t(" Create Account with Email instead")}
        </div>
      </div>
    </div>
  );
}

export default Registerwithphone0;
