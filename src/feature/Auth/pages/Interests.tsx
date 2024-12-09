import Interestbtn from "../components/Interestbtn";
import "../styles/interest.scss";
// import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { interests } from "../../../Data/Data";
import { useUpdateUser } from "../hooks/AuthHooks";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

function Interests() {
  const { t } = useTranslation();
  //   const navigate = useNavigate();
   const { username} = useSelector((state: RootState) => state.user );
   const updateUser = useUpdateUser();
  
  const [interest, setInterest] = useState<string[]>([]);
  
 const handleInterest = (value: string) => {
   setInterest((prev) =>
     prev.includes(value)
       ? prev.filter((item) => item !== value)
       : [...prev, value]
   );
 };

  const handleComplete = () => {  
       updateUser.mutate({  interests: interest ,username});  
}

  return (
    <div className="interest__container">
      <div className="head__interests">
        <div>{t("Enow, you’re in! Select your interests")}</div>
        <p>{t("Last! Pick at least one topic that you are interested in")}</p>
      </div>
      <div
        className={`counter__interests ${interest.length > 0 ? "green" : null}`}
      >
        {interest.length} Selected
      </div>
      <div className="interest__wrapper">
        {interests.map((interest) => (
          <Interestbtn
            key={interest}
            interest={interest}
            handleInterest={handleInterest}
          />
        ))}
      </div>
      {updateUser.error && <div>{ updateUser.error.message}</div>}
      
      <div className="interest_btns">
        {updateUser.isPending ? (
          <button className={`${interest.length > 0 ? "green" : null}`}>
            Completing Account Creation.......
          </button>
        ) : (
          <button className={`${interest.length > 0 ? "green" : null}`} onClick={handleComplete}>
            {interest.length > 0 ? "Done" : "Sign up"}
          </button>
        )}
        <div>Skip</div>
      </div>
    </div>
  );
}

export default Interests;
