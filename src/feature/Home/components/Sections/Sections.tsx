import { useTranslation } from "react-i18next";
import Section from "./Default";

const Sections = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 md:py-20 px-4 md:px-24">
      <Section
        title={t("sections.section1.title")}
        description={t("sections.section1.description")}
        linkText={t("sections.section1.linkText")}
        linkUrl="/section-1"
        imageUrl="/src/assets/images/sectionImage1.png"
      />

      <Section
        title={t("sections.section2.title")}
        description={t("sections.section2.description")}
        linkText={t("sections.section2.linkText")}
        linkUrl="/section-2"
        imageUrl="/src/assets/images/sectionImage2.png"
        reverse
      />

      <Section
        title={t("sections.section3.title")}
        description={t("sections.section3.description")}
        linkText={t("sections.section3.linkText")}
        linkUrl="/section-3"
        imageUrl="/src/assets/images/sectionImage3.png"
      />
    </div>
  );
};

export default Sections;