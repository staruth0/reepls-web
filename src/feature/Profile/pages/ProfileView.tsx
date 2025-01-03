import React from 'react'
import ProfileBody from '../components/ProfileBody';


const ProfileView:React.FC= () => {
  return (
      <div className="profile__view px-24">
          <ProfileBody>
               <h1>Profile</h1>

          </ProfileBody>
    </div>
  );
}

export default ProfileView