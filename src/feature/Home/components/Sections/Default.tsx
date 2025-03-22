import React, { useEffect, useState } from "react";
import { LuArrowRight } from "react-icons/lu";
import { useUser } from "../../../../hooks/useUser";
import AOS from "aos";
import "aos/dist/aos.css";

interface SectionProps {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  imageUrl: string;
  reverse?: boolean;
}

const Default: React.FC<SectionProps> = ({
  title,
  description,
  linkText,
  linkUrl,
  imageUrl,
  reverse = false,
}) => {
  const { authUser } = useUser();
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
    });
  }, []);


  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  const imageAnimation = isSmallScreen ? "zoom-in" : reverse ? "fade-left" : "fade-right";
  const textAnimation = isSmallScreen ? "zoom-in" : reverse ? "fade-right" : "fade-left";

  return (
    <div
      className={`w-full ${reverse ? "md:flex-row-reverse" : "md:flex-row"} flex flex-col items-center justify-center text-center md:text-left gap-8 md:gap-[104px] py-10 px-4 md:px-0`}
    >
      <div
        className="flex-1 w-full md:max-w-[385px]"
        data-aos={imageAnimation}
        data-aos-delay="200"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div
        className="flex-1 lg:max-w-[455px] lg:max-h-[175px] space-y-3 md:space-y-6"
        data-aos={textAnimation}
        data-aos-delay="400"
      >
        <h2 className="text-2xl lg:text-[36px] font-bold text-neutral-50 lg:leading-[44px]">{title}</h2>
        <p className="text-base md:text-[16px] text-neutral-100 md:leading-[24px]">{description}</p>
        <a
          href={`${authUser?.id ? "feed" : linkUrl}`}
          className="hover-underlined flex items-center justify-center md:justify-start w-fit mx-auto md:mx-0 text-md md:text-[15px] font-bold text-primary-400 transition-colors gap-1"
        >
          {linkText} <LuArrowRight />
        </a>
      </div>
    </div>
  );
};

export default Default;