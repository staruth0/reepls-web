// src/components/AuthReminderPopup.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

interface AuthReminderPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthReminderPopup: React.FC<AuthReminderPopupProps> = ({ isOpen }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Random position options
  const positions = [
    "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "top-8 right-8",
    "bottom-8 left-8",
    
    
  ];

  // Select random position
  const randomPosition = positions[Math.floor(Math.random() * positions.length)];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/20 z-[1000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`fixed z-[1000] bg-neutral-800 rounded-md shadow-lg p-6 w-80 flex flex-col items-center ${randomPosition}`}
          >
            <p className="text-neutral-50 text-base font-medium mb-4 text-center">
              {t("Sign in for an amazing experience! Comment, react, follow, and more!")}
            </p>
            <button
              className="w-full py-2 bg-main-green text-neutral-50 rounded-full hover:bg-primary-700 transition-colors"
              onClick={() => navigate("/auth/")}
            >
              {t("Sign In Now")}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthReminderPopup;