import React, { useState } from 'react';
import { LuStar } from 'react-icons/lu';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils';

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
    <div className="relative flex items-center justify-center">
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'w-6 h-6 flex items-center justify-center',
          'hover:text-primary-400 focus:text-primary-400 cursor-pointer',
          'transition-all duration-300 ease-in-out'
        )}
      >
        <LuStar
          className={`w-6 h-6 transition-colors duration-300 ${
            isCommunique ? 'fill-primary-400 text-primary-400' : 'text-neutral-100'
          } hover:text-primary-400`}
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