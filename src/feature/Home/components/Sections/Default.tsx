import React from "react";
import { LuArrowRight } from "react-icons/lu";

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
  return (
    <div className={`w-full ${reverse ? "md:flex-row-reverse" : "md:flex-row"} flex flex-col items-center justify-center text-center md:text-left gap-10 py-10 md:py-20 px-4 md:px-0`}>
      <div className="flex-1 w-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto rounded-lg"
        />
      </div>

      <div className="flex-1 w-full space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-4xl font-bold text-plain-a">{title}</h2>
        <p className="text-base md:text-lg text-neutral-100">{description}</p>
        <a
          href={linkUrl}
          className="flex items-center justify-center md:justify-start w-fit mx-auto md:mx-0 text-lg md:text-xl font-bold text-primary-400 hover:underline transition-colors gap-1"
        >
          {linkText} <LuArrowRight />
        </a>
      </div>
    </div>
  );
};

export default Default;