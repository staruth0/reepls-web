// Create a new file called AudioWave.tsx
import React, { useMemo } from "react";

interface AudioWaveProps {
  isPlaying: boolean;
  barCount?: number;
}

const AudioWave: React.FC<AudioWaveProps> = ({ isPlaying, barCount }) => {
  // Responsive bar count based on screen size
  const responsiveBarCount = useMemo(() => {
    if (barCount) return barCount;
    // Default to 60 on larger screens, fewer on smaller screens
    if (typeof window !== 'undefined') {
      return window.innerWidth < 640 ? 50 : window.innerWidth < 1024 ? 90 : 90;
    }
    return 60;
  }, [barCount]);

  const bars = Array.from({ length: responsiveBarCount }, (_, i) => i);

  return (
    <div className="flex items-end h-6 gap-0.5 sm:gap-1 min-w-0 w-full">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`flex-shrink-0 min-w-[2px] bg-primary-400 rounded-full ${
            isPlaying
              ? `animate-audio-wave-${index % 2 === 0 ? "even" : "odd"}`
              : "h-1"
          }`}
          style={{
            height: isPlaying ? `${Math.random() * 100}%` : "25%",
            animationDuration: `${0.5 + Math.random() * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default AudioWave;