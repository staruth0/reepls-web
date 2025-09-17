import React from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';

import ProfileConfigurations from '../components/ProfileConfigurations';
import { useTranslation } from 'react-i18next';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

const ProfileAnalytics:React.FC = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  return     <div className={`lg:grid grid-cols-[4fr_1.66fr] `}>
      {/* profile Section */}
      <div className="profile lg:border-r-[1px] border-neutral-500 ">
        <Topbar>
            <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t("profile.profileAnalytics")}</p>
          </div>
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
