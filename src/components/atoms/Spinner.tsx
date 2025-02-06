import React from "react";

interface SpinnerProps {
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20 }) => {
  return (
    <div
      className="animate-spin rounded-full border-t-2 border-b-2 border-primary-400"
      style={{ width: size, height: size }}
    />
  );
};
