import React from 'react';

interface ProfileAboutProps {
  about: string;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({ about }) => {
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