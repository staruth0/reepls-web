import React, { ReactNode } from "react";
import profileImage from "../../../assets/images/profile__image.svg";
import ImageBanner from "../../../assets/images/image__banner.svg";

interface ProfileBodyProps {
  children:ReactNode
}

const ProfileBody: React.FC<ProfileBodyProps> = ({children}) => {
  return (
    <>
      <div
        className="relative h-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${ImageBanner})` }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <img
            src={profileImage}
            alt="profile"
            className="w-28 h-28 rounded-full border-2 border-white shadow-lg absolute bottom-0 left-4 translate-y-1/2"
          />
        </div>
      </div>
      
      <div className="mt-20 px-4">{children}</div>
    </>
  );
};

export default ProfileBody;
