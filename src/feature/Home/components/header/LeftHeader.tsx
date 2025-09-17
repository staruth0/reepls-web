import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";

const LeftHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  

  return (
    <div className="flex items-center gap-4">
      <LanguageSwitcher />

      <button
        onClick={() => navigate('/auth/login/email')}
        className="px-6 py-2 rounded-full border border-plain-a text-neutral-50 bg-transparent hover:border-primary-400 hover:text-primary-400 transition-colors"
      >
        {t("header.signIn")}
      </button>

      <button

        onClick={() => navigate('/auth/register/email')}
        className="px-4 py-2 rounded-full bg-primary-400 text-white hover:bg-primary-300 transition-colors"
      >
        {t("header.signUp")}
      </button>
    </div>
  );
};

export default LeftHeader;