import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SeeMore: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSeeMore = () => { 
    navigate("/posts/communiques");
  }
  return (
    <div className="flex justify-center items-center text-[14px] py-2 text-neutral-50 gap-1 cursor-pointer" onClick={handleSeeMore}>
      <span>{t('feed.seeMore')}</span>
      <ArrowRight size={18} />
    </div>
  );
};

export default SeeMore;
