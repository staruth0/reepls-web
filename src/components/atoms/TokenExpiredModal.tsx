import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TokenExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenExpiredModal: React.FC<TokenExpiredModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLoginClick = () => {
    onClose();
    navigate("/auth");
  };

  return (
    <>
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-neutral-700 bg-opacity-50 z-50 flex items-center justify-center"
        onClick={handleOverlayClick}
      >
        {/* Centered Container */}
        <div className="bg-background rounded-lg p-6 shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {t("Token Has Expired")}
          </h2>
          <p className="text-neutral-500 mb-6">
            {t("Your session has expired. Please log in again to continue.")}
          </p>
          <button
            onClick={handleLoginClick}
            className="w-full bg-primary-400 text-foreground py-2 px-4 rounded hover:bg-primary-500 transition-colors"
          >
            {t("Login")}
          </button>
        </div>
      </div>
    </>
  );
};

export default TokenExpiredModal;
