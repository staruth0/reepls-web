import React from 'react';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  thumbClassName?: string;
  trackClassName?: string;
}

const Slider: React.FC<SliderProps> = ({
  className = '',
  thumbClassName = '',
  trackClassName = '',
  ...props
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="range"
        className={`absolute w-full h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:pointer-events-auto ${thumbClassName}`}
        {...props}
      />
      <div className={`h-1.5 rounded-full bg-neutral-600 ${trackClassName}`}>
        <div
          className="h-full rounded-full bg-primary-500"
          style={{
            width: props.value
              ? `${((Number(props.value) - Number(props.min || 0)) / 
                  (Number(props.max || 100) - Number(props.min || 0))) * 100}%`
              : '0%',
          }}
        />
      </div>
    </div>
  );
};

export default Slider;