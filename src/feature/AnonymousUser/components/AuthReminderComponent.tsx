// src/components/AuthReminderPopup.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; 

interface AuthReminderPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthReminderPopup: React.FC<AuthReminderPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 z-[1000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center z-[1001] p-4"
          >
            <div className="relative bg-neutral-800 rounded-md shadow-lg p-6 w-80 max-w-full flex flex-col items-center">
              {/* Close button with proper spacing */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" /> {/* Using Lucide X icon */}
              </button>
              
              <p className="text-neutral-50 text-base font-medium mb-4 mt-2 text-center px-2">
                {t("Sign in for an amazing experience! Comment, react, follow, and more!")}
              </p>
              <button
                className="w-full py-2 bg-main-green text-neutral-50 rounded-full hover:bg-primary-700 transition-colors"
                onClick={() => navigate("/auth/")}
              >
                {t("Sign In Now")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthReminderPopup;