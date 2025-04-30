import React, { useEffect, useState } from 'react';
import { heart, sadface, smile, thumb } from '../../../assets/icons';
import { t } from 'i18next';

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
      setTimeout(() => setIsVisible(false), 400);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const reactions = [
    { icon: heart, name: t("love") },
    { icon: thumb, name: t("like") },
    { icon: smile, name: t('Laugh') },
    { icon: sadface, name: t('Sad') },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-0 z-40" onClick={onClose}></div>

      <div
        className={`absolute z-50 mt-2 bg-background border-neutral-50 shadow-lg rounded-full p-3 transition-opacity duration-400 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ bottom: '40px', left: '0px' }}>
        <div className="flex space-x-4">
          {reactions.map((reaction) => (
            <button
              key={reaction.name}
              className="flex flex-col items-center  hover:scale-110 transform transition cursor-pointer"
              onClick={() => {
                onReact(reaction.name);
                onClose();
              }}
              title={reaction.name}>
              <img src={reaction.icon} alt={reaction.name} className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReactionModal;
