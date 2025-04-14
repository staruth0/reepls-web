import React from 'react'
import ProfileConfigurations from '../components/ProfileConfigurations'
import Topbar from '../../../components/atoms/Topbar/Topbar'
import { useTranslation } from 'react-i18next'

const ProfileSettings:React.FC = () => {
  const {t} = useTranslation()
  return (
    <div className={`lg:grid  `}>
    {/* profile Section */}
    <div className="profile border-neutral-500 ">
      <Topbar>
        <p>{t("profile.profileSettings")}</p>
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
  )
}

export default ProfileSettings
