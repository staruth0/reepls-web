import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ProfileHeroButtons: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

     const handleEditProfile = () => {
       navigate("/test/profile/edit");
     };
     const handleViewAnalytics = () => {
       navigate("/profile/analytics");
     };
  return (
    <div className="flex gap-2 text-neutral-50 justify-center items-center">
      <button
        className="px-8 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
        onClick={handleEditProfile}
      >
       {t(`Edit Profile`)}
      </button>
      <button
        className="px-8 py-3 bg-neutral-600 rounded-full text-sm hover:bg-gray-200"
        onClick={handleViewAnalytics}
      >
        {t(`View Analytics`)}
      </button>
    </div>
  );
}

export default ProfileHeroButtons