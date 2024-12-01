
import React from "react";

interface ColorProp {
  color: string;
}

const BookmarkIcon: React.FC<ColorProp> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke={color}
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4.421 6.75v13a1 1 0 0 0 1.619.786l5.342-4.205a1 1 0 0 1 1.236 0l5.342 4.205a1 1 0 0 0 1.619-.786v-13a3.5 3.5 0 0 0-3.5-3.5H7.921a3.5 3.5 0 0 0-3.5 3.5Z"
      />
    </svg>
  );
};

export default BookmarkIcon;
