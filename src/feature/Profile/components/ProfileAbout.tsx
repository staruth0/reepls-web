import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileAboutProps {
  about: string;
  isAuthUser?: boolean;
  username?: string;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ about, isAuthUser = false, username }) => {
  const navigate = useNavigate();
  
  const hasAbout = about && about.trim().length > 0;
  
  const handleEditProfile = () => {
    if (username) {
      navigate(`/profile/edit/${username}`);
    }
  };

  if (!hasAbout) {
    return (
      <div className="px-4 py-8">
        {isAuthUser ? (
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <p className="text-neutral-400 text-base">
              Tell people more about yourself
            </p>
            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-primary-400 text-white rounded-md hover:bg-primary-500 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-neutral-400 text-base">
              This user has no about yet
            </p>
          </div>
        )}
      </div>
    );
  }

  // Split the about text by full stops and filter out empty strings
  const sentences = about.split('.').filter(sentence => sentence.trim().length > 0);
  
  return (
    <div className="px-4">
      <div className="text-neutral-100 text-[14px] leading-[18px]">
        {sentences.map((sentence, index) => (
          <div key={index} className="mb-2">
            {sentence.trim()}.
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileAbout;