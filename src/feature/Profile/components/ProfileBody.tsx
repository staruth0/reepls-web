import React, { ReactNode } from "react";
import { User } from "../../../models/datamodels";
import { Pics } from "../../../assets/images";

interface ProfileBodyProps {
  children: ReactNode;
  user:User;
}

const ProfileBody: React.FC<ProfileBodyProps> = ({ children,user }) => {
  return (
    <>
      <div
        className="relative h-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${user.banner_image?user.banner_image:Pics.bannerPlaceholder})` }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <img
            src={user.profile_picture? user.profile_picture: Pics.imagePlaceholder }
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
