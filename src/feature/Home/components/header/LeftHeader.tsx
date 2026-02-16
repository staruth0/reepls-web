import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";

interface LeftHeaderProps {
  isLanding?: boolean;
}

const LeftHeader = ({ isLanding }: LeftHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <ThemeSwitcher />
      <LanguageSwitcher />

      <button
        onClick={() => navigate("/auth/login/email")}
        className={`px-6 py-2 rounded-full bg-transparent transition-colors ${
          isLanding
            ? "border border-primary-400 text-primary-400 hover:bg-primary-400/10"
            : "border border-plain-a text-neutral-50 hover:border-primary-400 hover:text-primary-400"
        }`}
      >
        {t("header.signIn")}
      </button>

      <button
        onClick={() => navigate("/auth/register/email")}
        className="px-4 py-2 rounded-full bg-primary-400 text-white hover:bg-primary-500 transition-colors"
      >
        {t("header.signUp")}
      </button>
    </div>
  );
};

export default LeftHeader;