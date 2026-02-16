import { useTranslation } from "react-i18next";
import Section from "./Default";
import { useUser } from "../../../../hooks/useUser";
import { Pics } from "../../../../assets/images";

const Sections = () => {
  const { t } = useTranslation();
  const {authUser} = useUser()


  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-[48px] py-10 md:py-20 px-4 md:px-24">
      <Section
        title={t("sections.section1.title")}
        description={t("sections.section1.description")}
        linkText={t("sections.section1.linkText")}
        linkUrl={`${authUser?.id? 'feed' : 'auth'}`}
        imageUrl={Pics.image1}
      />

      <Section
        title={t("sections.section2.title")}
        description={t("sections.section2.description")}
        linkText={t("sections.section2.linkText")}
        linkUrl={`${authUser?.id? 'feed' : 'auth'}`}
        imageUrl={Pics.image2}
        reverse
      />

      <Section
        title={t("sections.section3.title")}
        description={t("sections.section3.description")}
        linkText={t("sections.section3.linkText")}
        linkUrl={`${authUser?.id? 'feed' : 'auth'}`}
        imageUrl={Pics.image3}
      />
    </div>
  );
};

export default Sections;
