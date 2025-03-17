import { useTranslation } from "react-i18next";

const FooterTop = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary-400 py-10 md:py-20 px-4 md:px-10 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        <img
          src="/src/assets/images/Ellipse.png"
          alt="Ellipse-image"
          className="w-12 h-12 md:w-16 md:h-16"
        />

        <div className="text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-900 mb-4 md:mb-6">
            {t("footer.top.title")}
          </h2>
          <button className="px-6 py-3 md:px-10 md:py-4 rounded-full bg-white text-black font-bold hover:bg-secondary-200 hover:text-white transition-colors text-base md:text-lg">
            {t("footer.top.button")}
          </button>
        </div>

        <img
          src="/src/assets/images/reeples.png"
          alt="Decorative apostrophes"
          className="w-16 h-16 md:w-20 md:h-20"
        />
      </div>
    </div>
  );
};

export default FooterTop;