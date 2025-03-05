import React, { ReactNode, useRef, useState } from "react";
import profileImage from "../../../assets/images/profile__image.svg";
import ImageBanner from "../../../assets/images/image__banner.svg";
import { Camera } from "lucide-react";

interface ProfileBodyProps {
  children: ReactNode;
}

const ProfileEditBody: React.FC<ProfileBodyProps> = ({ children }) => {
  const [bannerImage, setBannerImage] = useState<string>(ImageBanner);
  const [profileImg, setProfileImg] = useState<string>(profileImage);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerClick = () => {
    bannerInputRef.current?.click();
  };

  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setBannerImage(e.target?.result as string);
      reader.readAsDataURL(file);
      submitBannerImage(file);
    }
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImg(e.target?.result as string);
      reader.readAsDataURL(file);
      submitProfileImage(file);
    }
  };

  const submitBannerImage = (file: File) => {
    console.log("Submitting banner image:", file);
  };

  const submitProfileImage = (file: File) => {
    console.log("Submitting profile image:", file);
  };

  return (
    <>
      {/* Banner Section */}
      <div
        className="relative h-24 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bannerImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <button
            onClick={handleBannerClick}
            className="absolute right-[50%] top-4 bg-black/60 p-2 rounded-full"
          >
            <Camera size={20} color="white" />
          </button>
          <input
            type="file"
            ref={bannerInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleBannerChange}
          />
        </div>
      </div>

      <div className="relative -top-24 w-28 h-28">
        <img
          src={profileImg}
          alt="profile"
          className="w-28 h-28 rounded-full border-2 border-white shadow-lg absolute bottom-0 left-4 translate-y-1/2"
        />

        <button
          onClick={handleProfileClick}
          className="absolute  -bottom-3 left-14  bg-black/60 p-2 rounded-full"
        >
          <Camera size={20} color="white" />
        </button>
        <input
          type="file"
          ref={profileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleProfileChange}
        />
      </div>

      {/* Profile Content */}
      <div className="mt-1 px-4">{children}</div>
    </>
  );
};

export default ProfileEditBody;
