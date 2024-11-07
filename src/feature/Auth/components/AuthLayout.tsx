import "../styles/authlayout.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { back_arrow } from "../../../assets/icons";
import Swiper from "./Swiper";
import { useTranslation } from "react-i18next";

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isBackArrowVisible = location.pathname !== "/auth";

  // Function to navigate to the previous route
  const prevRoute = () => {
    navigate(-1);
  };

  // Function to handle language change
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <div className="auth__layout">
      <div className="swiper__part">
        <Swiper />
      </div>
      <div className="page__container">
        <div className="top__nav">
          {isBackArrowVisible ? (
            <img src={back_arrow} onClick={prevRoute} alt="back_arrow" />
          ) : (
            <div></div>
          )}
          <select onChange={handleLanguageChange} defaultValue={i18n.language}>
            <option value="en">English</option>
            <option value="fr">French</option>
          </select>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
