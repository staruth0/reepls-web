import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";

const LeftContent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authUser } = useUser();

  return (
    <div className="space-y-8 lg:space-y-6 max-w-2xl">
      <h1 className="text-3xl md:text-[64px] font-bold text-neutral-50 text-center md:text-left md:leading-[64px]">
        {t("Drop your thoughts and let them")}{" "}
        <span className=" font-light italic">reepl</span>
      </h1>

      <p className="text-base md:text-[16px] text-neutral-100 text-center lg:text-left">
        {t(
          "Explore, write, and share insightful stories and heartfelt reflections. Stay informed, engaged, and part of a thoughtful community."
        )}
      </p>

      <div className="flex justify-center lg:justify-start gap-4">
        <button
          className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-primary-400 text-white hover:bg-primary-300 transition-colors text-sm md:text-base"
          onClick={() => navigate(`${authUser?.id ? "posts/create" : "/auth"}`)}
        >
          {t("Start a Reepl")}
        </button>

        <button
          className="px-4 py-2 md:px-6 md:py-3 rounded-full border border-plain-a text-plain-a hover:text-primary-400 hover:border-primary-400 transition-colors text-sm md:text-base"
          onClick={() => navigate(`${authUser?.id ? "feed" : "/auth"}`)}
        >
          {t("Explore Stories")}
        </button>
      </div>
    </div>
  );
};

export default LeftContent;
