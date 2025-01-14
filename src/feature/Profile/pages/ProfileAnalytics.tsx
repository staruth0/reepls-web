import React from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileBody from '../components/ProfileBody';
import ProfileConfigurations from '../components/ProfileConfigurations';

const ProfileAnalytics:React.FC = () => {
  return     <div className={`grid grid-cols-[4fr_1.66fr] `}>
      {/* profile Section */}
      <div className="profile border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>Profile Analytics</p>
        </Topbar>

        {/* Analytics content */}
        <div className="profile__content px-20">
          <ProfileBody>
            <p>Analytics</p>
          </ProfileBody>
        </div>
      </div>

      {/*configurations Section */}
      <div className="profile__configurationz">
        <ProfileConfigurations />
      </div>
    </div>;
};

export default ProfileAnalytics;
