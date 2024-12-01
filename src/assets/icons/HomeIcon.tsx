import React from "react";

interface ColorProp {
  color: string;
}

const HomeIcon: React.FC<ColorProp> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 24 24"
    >
      <path fill={color} d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z" />
    </svg>
  );
};

export default HomeIcon;
