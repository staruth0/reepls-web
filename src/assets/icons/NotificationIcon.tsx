import React from "react";

interface ColorProp {
  color: string;
}

const NotificationIcon: React.FC<ColorProp> = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23"
      height="23"
      viewBox="0 0 24 24"
    >
      <path
        fill={color}
        d="M5.5 18.77q-.213 0-.356-.145T5 18.268t.144-.356t.356-.143h1.116V9.846q0-1.96 1.24-3.447T11 4.546V4q0-.417.291-.708q.291-.292.707-.292t.709.292T13 4v.546q1.904.365 3.144 1.853t1.24 3.447v7.923H18.5q.213 0 .356.144q.144.144.144.357t-.144.356t-.356.143zm6.497 2.615q-.668 0-1.14-.475t-.472-1.14h3.23q0 .67-.475 1.142q-.476.472-1.143.472M7.616 17.77h8.769V9.846q0-1.823-1.281-3.104T12 5.462t-3.104 1.28t-1.28 3.104z"
      />
    </svg>
  );
};

export default NotificationIcon;