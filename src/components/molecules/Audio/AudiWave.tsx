// Create a new file called AudioWave.tsx
import React from "react";

interface AudioWaveProps {
  isPlaying: boolean;
  barCount?: number;
}

const AudioWave: React.FC<AudioWaveProps> = ({ isPlaying, barCount = 60 }) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  return (
    <div className="flex items-end h-6 gap-1">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`w-full bg-primary-400 rounded-full ${
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