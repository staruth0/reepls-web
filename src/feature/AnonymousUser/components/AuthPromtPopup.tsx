// src/components/AuthPromptPopup.tsx
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
    <div className="fixed inset-0  flex items-center justify-center p-4 ">
      <div className="w-full max-w-xs sm:max-w-md bg-neutral-800 rounded-md shadow-lg py-6 px-6 sm:px-10 flex flex-col items-center">
        <p className="text-neutral-50 text-base font-medium mb-4 text-center">
          {t("You need to be logged in to")} {text}
        </p>
        
        {/* Sign Up Button */}
        <button
          className="w-full py-2 bg-main-green text-neutral-50 rounded-full hover:bg-primary-700 transition-colors mb-3"
          onClick={() => navigate("/auth")} 
        >
          {t("Create an account")}
        </button>
        
        {/* Divider */}
        <div className="flex items-center w-full mb-3">
          <div className="flex-grow h-px bg-neutral-500"></div>
          <span className="px-2 text-neutral-300 text-sm">{t("or")}</span>
          <div className="flex-grow h-px bg-neutral-500"></div>
        </div>
        
        {/* Login Button */}
        <button
          className="w-full py-2 bg-transparent border border-primary-400 text-neutral-50 rounded-full hover:bg-neutral-700 transition-colors"
          onClick={() => navigate("/auth")}
        >
          {t("Log in to existing account")}
        </button>
      </div>
    </div>
  );
};

export default AuthPromptPopup;