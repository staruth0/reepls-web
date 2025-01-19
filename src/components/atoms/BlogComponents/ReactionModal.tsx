import React, { useEffect, useState } from "react";
import { heart, thumb, sadface, smile } from "../../../assets/icons"; 

interface ReactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReact: (reaction: string) => void;
}

const ReactionModal: React.FC<ReactionModalProps> = ({ isOpen, onClose, onReact }) => {
  const [isVisible, setIsVisible] = useState(false);
//   const [likeCount, setLikeCount] = useState(0);
//   const [likeCountIcons, setLikeCountIcons] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const reactions = [
    { icon: heart, name: "Love" },
    { icon: thumb, name: "Like" },
    { icon: smile, name: "Laugh" },
    { icon: sadface, name: "Sad" },
  ];

  return (
    <>
      <div
        className="fixed inset-0 bg-black opacity-0 z-40"
        onClick={onClose}
      ></div>

      <div
        className={`absolute z-50 mt-2 bg-white border border-gray-200 shadow-lg rounded-full p-3 transition-opacity duration-400 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        style={{ bottom: "40px", left: "0px" }}
      >
        <div className="flex space-x-4">
          {reactions.map((reaction) => (
            <div
              key={reaction.name}
              className="flex flex-col items-center cursor-pointer hover:scale-110 transform transition"
              onClick={() => {
                onReact(reaction.name);
                onClose();
              }}
              title={reaction.name}
            >
              <img src={reaction.icon} alt={reaction.name} className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReactionModal;
