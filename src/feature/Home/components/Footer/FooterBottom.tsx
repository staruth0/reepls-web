import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";
import ThemeSwitcher from "../ThemeSwitcher";
import { Pics } from "../../../../assets/images";
import { getVersionDisplayText } from "../../../../constants";

const FooterBottom = () => {
  const { t } = useTranslation();
  const authState = useUser();

  return (
    <div className="bg-background py-8 px-5 md:px-20">
      <div className=" flex flex-col gap-4 md:flex-row items-center justify-between">
        <div className="flex justify-between w-full md:w-auto">
         <div className="flex items-center gap-2 cursor-pointer">
         <img
            src={Pics.logo}
            alt="Reepls Logo"
            className="w-8 h-8"
          />
          <span className="text-xl font-bold text-neutral-50">Reepls</span>
         </div>

          <li className="block md:hidden">
            <ThemeSwitcher />
          </li>
        </div>

        <ul className="flex items-center gap-6 mt-4 md:mt-0">
          <li>
            <Link
              to="/help"
              className="text-neutral-50 hover:text-primary-400 transition-colors"
            >
              {t("footer.bottom.help")}
            </Link>
          </li>
          <li>
            <Link
              to={`${authState.isLoggedIn ? "Terms&Policies" : "auth"}`}
              className="text-neutral-50 hover:text-primary-400 transition-colors"
            >
              {t("footer.bottom.terms")}
            </Link>
          </li>
          <li>
            <Link
              to={`${authState.isLoggedIn ? "Terms&Policies" : "auth"}`}
              className="text-neutral-50 hover:text-primary-400 transition-colors"
            >
              {t("footer.bottom.policy")}
            </Link>
          </li>

          <li className="hidden md:block">
            <ThemeSwitcher />
          </li>
        </ul>
      </div>
      
      {/* Version display */}
      <div className="flex justify-center mt-4">
        <span className="text-sm text-neutral-400">
          {getVersionDisplayText()}
        </span>
      </div>
    </div>
  );
};

export default FooterBottom;
