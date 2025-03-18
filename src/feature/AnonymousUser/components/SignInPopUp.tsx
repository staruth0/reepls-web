import React from "react";
import { FaRegUserCircle } from 'react-icons/fa';
import { useTranslation } from "react-i18next"; 
import { useNavigate } from "react-router-dom";

interface SignInPopUpProps {
  text: string; // Dynamic text like "Comment", "React", "Follow"
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "above" | "below"; // Positioning options
  onClose?: () => void; // Function to close the popup
}

const SignInPopUp: React.FC<SignInPopUpProps> = ({ text, position, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Positioning styles based on prop
  const positionStyles: Record<string, string> = {
    "top-left": "top-0 left-0 mt-2 ml-2",
    "top-right": "top-0 right-0 mt-2 mr-2",
    "bottom-left": "bottom-0 left-0 mb-2 ml-2",
    "bottom-right": "bottom-0 right-0 mb-2 mr-2",
    "above": "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
    "below": "top-full mt-2 left-1/2 transform -translate-x-1/2",
  };

  return (
    <>
      {/* Transparent Overlay to Close Popup */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose} 
      ></div>

      {/* Popup */}
      <div
        className={`absolute bg-neutral-800 rounded-md shadow-lg p-4 z-50 w-64 flex flex-col items-center ${positionStyles[position]}`}
      >
        <p className="text-neutral-50 text-base font-medium mb-3 text-center ">
          {t("Please sign in to")} {text}
        </p>
        <button
          className="flex items-center gap-2 px-4 py-1 bg-primary-600 text-neutral-50 rounded-md shadow-sm hover:bg-primary-700 transition-colors"
          onClick={() => navigate('/auth')} 
        >
          <FaRegUserCircle size={16} className="text-main-green" />
          {t("Sign In")}
        </button>
      </div>
    </>
  );
};

export default SignInPopUp;