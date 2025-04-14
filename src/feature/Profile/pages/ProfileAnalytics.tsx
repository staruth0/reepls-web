import React from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';

import ProfileConfigurations from '../components/ProfileConfigurations';
import { useTranslation } from 'react-i18next';

const ProfileAnalytics:React.FC = () => {
  const {t} = useTranslation()
  return     <div className={`lg:grid grid-cols-[4fr_1.66fr] `}>
      {/* profile Section */}
      <div className="profile lg:border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>{t("profile.profileAnalytics")}</p>
        </Topbar>

        {/* Analytics content */}
        <div className="profile__content px-5 md:px-10 lg:px-20">
         {t("profile.analytics")}
        </div>
      </div>

      {/*configurations Section */}
      <div className="profile__configurationz bg-background hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>;
};

export default ProfileAnalytics;
