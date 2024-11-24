import React, { useState } from "react";
import InputField from "../../components/InputField";
import "../../styles/authpages.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStoreCredential } from "../../hooks/useStoreCredential";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useAuth } from "../../hooks/useAuth";
import { useTokenStorage } from "../../hooks/useTokenStorage";
import { EmailCode} from "../../../../models/datamodels";


function RegisterWithEmail2(){
  const { t } = useTranslation();
  const { email, password, username } = useSelector((state: RootState) => state.user);
  //custom-hooks
  const { storeName } = useStoreCredential()
  const { createUser } = useAuth()
  const {storeAccessToken,storeRefreshToken} = useTokenStorage()
  
  //states
  const [name, setName] = useState<string>("");
  //navigate
  const navigate = useNavigate();
  //functions to handle DOM events

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    storeName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted successfully!");
    console.log({
      email,password,username
    })
    try {
       const data = await createUser({ email, password, username });
       if (data) {
         console.log("authenticated");
         storeAccessToken(data.tokens.access.token);
         storeRefreshToken(data.tokens.refresh.token);

         navigateToCheckMail({email:data.user.email});
       }
      
    } catch (error) {
      console.error(error);
    }
 
   
  };
    
  // functions to navigate
  const navigateToSignInWithEmail = () => {
    navigate("/auth/register/email");
  };
  const navigateToCheckMail = (userEmail:EmailCode) => {
    navigate("/auth/register/checkemail",{state:userEmail});
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
      <div className="bottom__links">
        <div className="alternate__email" onClick={navigateToSignInWithEmail}>
         {t("Create Account with Email instead")}
        </div>
      </div>
    </div>
  );
}

export default RegisterWithEmail2;
