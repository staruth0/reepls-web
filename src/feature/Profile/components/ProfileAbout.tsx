import React from 'react';

interface ProfileAboutProps {
  about: string;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ about }) => {
  return (
    <div className="px-4">
      <div 
        className="text-neutral-100 text-[14px] leading-[18px] whitespace-pre-wrap"
      >
        {about}
      </div>
    </div>
  );
};

export default ProfileAbout;