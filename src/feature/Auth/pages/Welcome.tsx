import "../styles/welcome.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
 

  const navigateToSignIn = () => {
    navigate("register/phone");
  };
  const navigateToSignUp = () => {
    navigate("login/phone");
  };
  const navigateToFeed = () => {
    navigate("/feed");
  };

  return (
    <div className="welcome__container">
      <div className="welcome__text">{t("WelcomeMessage")}</div>

      <div className="welcome__buttons">
        <button className="btn__sign-in" onClick={navigateToSignUp}>
          {t("SignInButton")}
        </button>
        <div className="divider">
          <p>{t("OrDivider")}</p>
        </div>
        <button className="btn__sign-up" onClick={navigateToSignIn}>
          {t("SignUpButton")}
        </button>
      </div>

      <div className="welcome__link" onClick={navigateToFeed}>{t("ContinueWithoutSignIn")}</div>
    </div>
  );
}

export default Welcome;
