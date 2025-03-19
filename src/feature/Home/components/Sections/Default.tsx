import React, { useEffect } from "react";
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

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
    });
  }, []);

  return (
    <div
      className={`w-full ${reverse ? "md:flex-row-reverse" : "md:flex-row"} flex flex-col items-center justify-center text-center md:text-left gap-3 md:gap-10 py-10 md:py-20 px-4 md:px-0`}
    >
      <div
        className="flex-1 w-full"
        data-aos={reverse ? "fade-left" : "fade-right"} 
        data-aos-delay="200" 
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div
        className="flex-1 w-full space-y-3 md:space-y-6"
        data-aos={reverse ? "fade-right" : "fade-left"}
        data-aos-delay="400"
      >
        <h2 className="text-2xl md:text-4xl font-bold text-neutral-50">{title}</h2>
        <p className="text-base md:text-lg text-neutral-100">{description}</p>
        <a
          href={`${authUser?.id ? "feed" : linkUrl}`}
          className="hover-underlined flex items-center justify-center md:justify-start w-fit mx-auto md:mx-0 text-lg md:text-xl font-bold text-primary-400  transition-colors gap-1"
        >
          {linkText} <LuArrowRight />
        </a>
      </div>
    </div>
  );
};

export default Default;