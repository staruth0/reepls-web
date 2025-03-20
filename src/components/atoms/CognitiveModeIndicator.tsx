import { LuBrain } from 'react-icons/lu';
import { cn } from '../../utils';
const CognitiveModeIndicator = ({
  className = '',
  isActive = false,
  onClick = () => {},
}: {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}) => (
  <LuBrain
    size={30}
    className={cn(
      className,
      isActive ? 'text-primary-400' : 'text-neutral-100',
      'cursor-pointer transition-all duration-300 ease-in-out',
      'hover:text-primary-400'
    )}
    onClick={onClick}
    fill={isActive ? '#7ef038' : 'none'}
  />
);

export default CognitiveModeIndicator;
