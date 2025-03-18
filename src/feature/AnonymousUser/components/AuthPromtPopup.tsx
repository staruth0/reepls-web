// src/components/AuthPromptPopup.tsx (adjust path as needed)
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface AuthPromptPopupProps {
  text: string; 
}

const AuthPromptPopup: React.FC<AuthPromptPopupProps> = ({ text }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-md shadow-lg py-6 px-10 z-50  flex flex-col items-center">
      <p className="text-neutral-50 text-base font-medium mb-4">
        {t("You need to be logged in to")} {text}
      </p>
      <button
        className="w-full py-2 bg-main-green text-neutral-50 rounded-full hover:bg-primary-700 transition-colors mb-3"
        onClick={() => navigate("/auth")} 
      >
        {t("Create an account")}
      </button>
      <div className="flex items-center w-full mb-3">
        <div className="flex-grow h-px bg-neutral-500"></div>
        <span className="px-2 text-neutral-300">{t("or")}</span>
        <div className="flex-grow h-px bg-neutral-500"></div>
      </div>
      <button
        className="w-full py-2 bg-neutral-300 text-neutral-50 rounded-full hover:bg-neutral-600 transition-colors"
        onClick={() => navigate("/auth")}
      >
        {t("Log in to existing account")}
      </button>
    </div>
  );
};

export default AuthPromptPopup;