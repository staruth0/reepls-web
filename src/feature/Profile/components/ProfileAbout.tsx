import React from 'react'

interface ProfileAboutProps {
  bio: string;
 }


const ProfileAbout:React.FC<ProfileAboutProps> = ({ bio }) => {
  return (
    <div>
      <div className="text-neutral-100 text-[14px] leading-[18px] px-4">
      {bio}
    </div>
    </div>
    
  );
}

export default ProfileAbout