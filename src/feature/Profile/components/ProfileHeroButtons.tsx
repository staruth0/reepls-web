import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';


interface ProfileHeroButtonsProps { 
  userId: string;
}

const ProfileHeroButtons: React.FC<ProfileHeroButtonsProps> = ({userId}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

     const handleEditProfile = (userId: string) => {
       navigate(`/profile/edit/${userId}`);
     };
     const handleViewAnalytics = (userId: string) => {
       navigate(`/profile/analytics/${userId}`);
     };
  
  return (
    <div className="flex gap-2 text-neutral-50 justify-center items-center">
      <button
        className="px-8 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
        onClick={() => handleEditProfile(userId)}
      >
       {t(`Edit Profile`)}
      </button>
      <button
        className="px-8 py-3 bg-neutral-600 rounded-full text-sm hover:bg-gray-200"
        onClick={() => handleViewAnalytics(userId)}
      >
        {t(`View Analytics`)}
      </button>
    </div>
  );
}

export default ProfileHeroButtons