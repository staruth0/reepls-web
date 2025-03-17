import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";

const FooterBottom = () => {
  const { t } = useTranslation();
  const authState = useUser() 

  return (
    <div className="bg-background py-8 px-5 md:px-20">
      <div className=" flex flex-col-reverse gap-4 md:flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/public/LogoDark.svg" alt="Reepls Logo" className="w-8 h-8" />
          <span className="text-xl font-bold text-plain-a">Reepls</span>
        </div>

        <ul className="flex items-center gap-6 mt-4 md:mt-0">
          <li>
            <Link
              to="/help"
              className="text-plain-a hover:text-primary-400 transition-colors"
            >
              {t("footer.bottom.help")}
            </Link>
          </li>
          <li>
            <Link
              to={`${authState.isLoggedIn ? 'Terms&Policies' : 'auth'}`}
              className="text-plain-a hover:text-primary-400 transition-colors"
            >
              {t("footer.bottom.terms")}
            </Link>
          </li>
          <li>
            <Link
              to={`${authState.isLoggedIn ? 'Terms&Policies' : 'auth'}`}
              className="text-plain-a hover:text-primary-400 transition-colors"
            >
              {t("footer.bottom.policy")}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FooterBottom;