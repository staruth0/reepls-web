import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../../hooks/useUser';


interface ProfileHeroButtonsProps { 
  userId: string;
}

const ProfileHeroButtons: React.FC<ProfileHeroButtonsProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {authUser} = useUser()

     const handleEditProfile = (username: string) => {
       navigate(`/profile/edit/${username}`);
     };
     const handleViewAnalytics = (username: string) => {
       navigate(`/profile/analytics/${username}`);
     };
  
  return (
    <div className="flex gap-2 text-neutral-50 justify-center items-center">
      {userId === authUser?.id ? (
        <>
          <button
            className="px-8 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
            onClick={() => handleEditProfile(authUser?.username || "")}
          >
            {t(`Edit Profile`)}
          </button>
          <button
            className="px-8 py-3 bg-neutral-600 rounded-full text-sm hover:bg-gray-200"
            onClick={() => handleViewAnalytics(authUser?.username || "")}
          >
            {t(`View Analytics`)}
          </button>
        </>
      ) : (
        <div>
          <button className="px-8 py-3 rounded-full text-sm bg-main-green hover:bg-primary-600 text-white">
            Follow
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileHeroButtons