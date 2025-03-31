import { Camera } from 'lucide-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { uploadUserBanner, uploadUserProfile } from '../../../utils/media';
import { User } from '../../../models/datamodels';
import { Pics } from '../../../assets/images';
import { useUpdateUser } from '../hooks';

interface ProfileBodyProps {
  children: ReactNode;
  user?: User; // Made user optional to handle undefined case
}

const ProfileEditBody: React.FC<ProfileBodyProps> = ({ children, user }) => {
  const { authUser } = useUser();
  const {mutate} = useUpdateUser()

  // Safely handle initial state with fallback if user is undefined
  const [bannerImage, setBannerImage] = useState<string | undefined>(() => {
    return user?.banner_picture || Pics.bannerPlaceholder;
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
          toast.success('Successfully updated banner image');
        })
        .catch(() => {
          toast.error('New banner could not be uploaded');
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
          toast.success('Successfully updated profile image');
          
        })
        .catch(() => {
          toast.error('New profile picture could not be uploaded');
        });
    }
  };

  const submitBannerImage = async (file: File) => {
    if (!authUser?.id) {
      toast.error('You must be logged in to upload a banner image');
      return;
    }
    const url = await uploadUserBanner(authUser.id, file);
    setBannerImage(url);
    return url;
  };

  const submitProfileImage = async (file: File) => {
    if (!authUser?.id) {
      toast.error('You must be logged in to upload a profile image');
      return;
    }
    const url = await uploadUserProfile(authUser.id, file);
    setProfileImg(url);
    return url;
  };

  useEffect(()=>{
    console.log('profile',profileImg);
    console.log('banner',bannerImage);

  },[profileImg,bannerImage])

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