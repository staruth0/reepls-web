import React from 'react'

interface ProfileAboutProps {
  about: string;
 }


const ProfileAbout:React.FC<ProfileAboutProps> = ({ about }) => {
  return (
    <div>
      <div className="text-neutral-100 text-[14px] leading-[18px] px-4">
      {about}
    </div>
    </div>
    
  );
}

export default ProfileAbout