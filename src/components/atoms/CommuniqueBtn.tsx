import React, { useState } from 'react';
import { LuStar } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';

interface StarToggleProps {
  isCommunique: boolean;
  onToggle: (isCommunique: boolean) => void;
}

const StarToggle: React.FC<StarToggleProps> = ({ isCommunique, onToggle }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const handleToggle = () => {
    onToggle(!isCommunique);
  };

  const tooltipMessage = isCommunique
    ? t('Untag as communique')
    : t('Tag as communique');

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="focus:outline-none"
      >
        <LuStar
          className={`size-6 transition-colors duration-200 ${
            isCommunique ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'
          } hover:text-yellow-300`}
        />
      </button>
      {isHovered && (
        <div className="absolute z-10 -top-6 left-1/2 transform -translate-x-1/2 bg-background text-neutral-50 text-xs rounded py-1 px-2 whitespace-nowrap">
          {tooltipMessage}
        </div>
      )}
    </div>
  );
};

export default StarToggle;