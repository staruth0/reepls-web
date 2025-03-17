import { useTranslation } from "react-i18next";

const LeftContent = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 max-w-2xl text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-plain-a">
        {t("Drop your thoughts and let them")}{" "}
        <span className="text-primary-400">reepl</span>
      </h1>

      <p className="text-base md:text-lg text-neutral-200 text-center">
        {t("Explore, write, and share insightful stories and heartfelt reflections. Stay informed, engaged, and part of a thoughtful community.")}
      </p>

      <div className="flex justify-center md:justify-start gap-4">
        <button
          className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-primary-400 text-white hover:bg-primary-300 transition-colors text-sm md:text-base"
        >
          {t("Start a Reepl")}
        </button>

        <button
          className="px-4 py-2 md:px-6 md:py-3 rounded-full border border-plain-a text-plain-a hover:text-primary-400 hover:border-primary-400 transition-colors text-sm md:text-base"
        >
          {t("Explore Stories")}
        </button>
      </div>
    </div>
  );
};

export default LeftContent;