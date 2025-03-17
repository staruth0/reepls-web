import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const FooterBottom = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-background py-8 px-5">
      <div className="container mx-auto flex flex-col-reverse gap-2 md:flex-row items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <img src="/public/Logo.svg" alt="Reepls Logo" className="w-8 h-8" /> {/* Adjust logo size as needed */}
          <span className="text-xl font-bold text-plain-a">Reepls</span>
        </div>

        {/* Links Section */}
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
              to="/terms"
              className="text-plain-a hover:text-primary-400 transition-colors"
            >
              {t("footer.bottom.terms")}
            </Link>
          </li>
          <li>
            <Link
              to="/policy"
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