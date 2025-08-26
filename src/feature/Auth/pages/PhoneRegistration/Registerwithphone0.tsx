// import React, { useState } from "react";
// import InputField from "../../components/InputField";
// import "../../styles/authpages.scss";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useStoreCredential } from "../../hooks/useStoreCredential";

// function RegisterWithPhone0() {
//   const { t } = useTranslation();
//   const { storePhone} = useStoreCredential();
//   const navigate = useNavigate();

//   // states
//   const [phone, setPhone] = useState<string>("");
//   const [phoneInputError, setPhoneInputError] = useState<boolean>(false);

//   // functions to handle DOM events
//   const handlePhoneNumberChange = (
//     value: string,
  
//   ) => {
//     setPhone(value);
//     storePhone(value);
 

//     // Validate phone number (minimum 8 digits after country code)
//     const digitsOnly = value.replace(/\D/g, '');
//     const isValid = digitsOnly.length >= 8 || value === '';
//     setPhoneInputError(!isValid);
//   };

//   const handlePhoneBlur = () => {
//     if (phone.trim() === "") {
//       setPhoneInputError(false);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     const digitsOnly = phone.replace(/\D/g, '');
//     if (phone.trim() === "" || digitsOnly.length < 8) {
//       setPhoneInputError(true);
//       return;
//     }
     
//     storePhone(phone);
//     navigate("/auth/register/phone/two");
//   };

//   // functions to navigate
//   const navigateToSignInWithEmail = () => {
//     navigate("/auth/register/email");
//   };
  

//   return (
//     <div className="register__phone__container">
//       <div className="insightful__texts">
//         <div>{t("GetInformed")}</div>
//         <p>{t("EnterEmailDescription")}</p> 
//       </div>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <InputField
//             textValue={phone}
//             label={t("PhoneNumberLabel")}
//             type="phone"
//             placeholder={t("PhonePlaceholder")}
//             handleInputChange={handlePhoneNumberChange}
//             handleBlur={handlePhoneBlur}
//             isInputError={phoneInputError}
//             inputErrorMessage={t("PhoneErrorMessage")}
//           />
//         </div>
//         <button type="submit">{t("ContinueButton")}</button>
//       </form>
//       <div className="bottom__links">
//         <div className="alternate__email" onClick={navigateToSignInWithEmail}>
//           {t("Create Account with Email instead")}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default RegisterWithPhone0;

import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";
import PhoneLoginDisabledModal from "../../components/UnavalaiblePopup"; // ✅ reuse modal

function RegisterWithPhone0() {
  const { t } = useTranslation();
  const { storePhone } = useStoreCredential();
  const navigate = useNavigate();

  const [phone, setPhone] = useState<string>("");
  const [phoneInputError, setPhoneInputError] = useState<boolean>(false);

  const handlePhoneNumberChange = (value: string) => {
    setPhone(value);
    storePhone(value);

    const digitsOnly = value.replace(/\D/g, "");
    const isValid = digitsOnly.length >= 8 || value === "";
    setPhoneInputError(!isValid);
  };

  const handlePhoneBlur = () => {
    if (phone.trim() === "") {
      setPhoneInputError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 🚫 phone registration disabled
  };

  const navigateToSignInWithEmail = () => {
    navigate("/auth/register/email");
  };

  return (
    <div className="register__phone__container">
      {/* ✅ Popup modal for unavailable phone registration */}
      <PhoneLoginDisabledModal />

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

        {/* 🚫 Disabled button */}
        <button
          type="submit"
          disabled
          className="w-full mt-4 px-4 py-2 rounded-xl bg-gray-400 text-white cursor-not-allowed"
        >
          {t("ContinueButton")}
        </button>

        <p className="text-center mt-2 text-sm text-red-600">
          {t("Phone registration is unavailable. Please create an account with email instead.")}
        </p>
      </form>

      <div className="bottom__links">
        <div className="alternate__email" onClick={navigateToSignInWithEmail}>
          {t("Create Account with Email instead")}
        </div>
      </div>
    </div>
  );
}

export default RegisterWithPhone0;
