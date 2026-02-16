import { Camera } from 'lucide-react';
import React, { ReactNode,  useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { uploadUserBanner, uploadUserProfile } from '../../../utils/media';
import { User } from '../../../models/datamodels';
import { Pics } from '../../../assets/images';
import { useUpdateUser } from '../hooks';
import { useTranslation } from 'react-i18next';

interface ProfileBodyProps {
  children: ReactNode;
  user?: User; // Made user optional to handle undefined case
}

const ProfileEditBody: React.FC<ProfileBodyProps> = ({ children, user }) => {
  const { authUser } = useUser();
  const {mutate} = useUpdateUser()

  const {t} = useTranslation();

  const [bannerImage, setBannerImage] = useState<string | undefined>(() => {
    return user?.banner_picture ?? undefined;
  });
  const [profileImg, setProfileImg] = useState<string | undefined>(() => {
    return user?.profile_picture || Pics.imagePlaceholder;
  });

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
      submitBannerImage(file)
        .then((data) => {
          mutate({banner_picture:data})
          toast.success(t("profile.alerts.bannerSuccess"));
        })
        .catch(() => {
          toast.error(t("profile.alerts.bannerFailed"));
        });
    }
  };

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImg(e.target?.result as string);
      reader.readAsDataURL(file);
      submitProfileImage(file)
        .then((data) => {
          mutate({profile_picture:data})
          toast.success(t("profile.alerts.profileImageSuccess"));
          
        })
        .catch(() => {
          toast.error(t("profile.alerts.profileImageFailed"));
        });
    }
  };

  const submitBannerImage = async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("profile.alerts.bannerLogin"));
      return;
    }
    const url = await uploadUserBanner(file);
    setBannerImage(url);
    return url;
  };

  const submitProfileImage = async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("profile.alerts.profileImageLogin"));
      return;
    }
    const url = await uploadUserProfile( file);
    setProfileImg(url);
    return url;
  };

 

  return (
    <>
      <div
        className="relative h-24 bg-cover bg-center bg-no-repeat bg-neutral-200"
        style={{ backgroundImage: bannerImage ? `url(${bannerImage})` : undefined }}
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
          className="absolute -bottom-3 left-14 bg-black/60 p-2 rounded-full"
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