import { useTranslation } from "react-i18next";
import { useUser } from "../../../../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { Pics } from "../../../../assets/images";

const FooterTop = () => {
  const { t } = useTranslation();
  const {authUser} = useUser()
  const navigate = useNavigate()

  return (
    <div className="bg-secondary-400 py-10 md:py-24 px-4 md:px-20 overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
        <img
          src={Pics.ellipse}
          alt="Ellipse-image"
          className="w-12 h-12 md:w-32 md:h-32 absolute top-4 left-6 md:static"
        />

        <div className="text-center py-10 text-neutral-50">
          <h2 className="text-2xl md:text-4xl font-bold text-[#333333] mb-4 md:mb-6">
            {t("footer.top.title")} <span className=" font-normal italic">Reepl</span>
          </h2>
          <button className="px-6 py-3 md:px-10 md:py-4 rounded-full bg-background text-neutral-50 font-bold hover:bg-secondary-200 hover:text-white transition-colors text-base md:text-lg"
          onClick={() => navigate(`${authUser?.id ? "/posts/create" : "auth"}`)}
          >
            {t("footer.top.button")}
          </button>
        </div>

        <img
          src={Pics.reeplspng}
          alt="Decorative apostrophes"
          className="w-16 h-16 md:w-32 md:h-32 absolute bottom-4 right-6 md:static"
        />
      </div>
    </div>
  );
};

export default FooterTop;