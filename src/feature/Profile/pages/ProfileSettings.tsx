import React from 'react'
import ProfileConfigurations from '../components/ProfileConfigurations'
import Topbar from '../../../components/atoms/Topbar/Topbar'
import { useTranslation } from 'react-i18next'
import MainContent from '../../../components/molecules/MainContent';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';

const ProfileSettings:React.FC = () => {
  const {t} = useTranslation()
  const navigate = useNavigate();
  return (
    <MainContent> 
    <div className={`lg:grid  `}>
    {/* profile Section */}
    <div className="profile border-neutral-500 ">
      <Topbar>
      <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t("profile.profileSettings")}</p>
          </div>
      
      </Topbar>

      {/* Analytics content */}
      <div className='lg:px-20 '>
      <ProfileConfigurations />
      </div>
     
    </div>

    {/*configurations Section */}
    <div className="profile__configurationz bg-background hidden ">
      <ProfileConfigurations />
    </div>
  </div>
  </MainContent>
  )
}

export default ProfileSettings
