import React, { useEffect } from 'react'
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import NotificationContainer from '../components/NotificationContainer';
import { useTranslation } from 'react-i18next';
import { useFetchUserNotifications } from '../hooks/useNotification';

const Notifications: React.FC = () => {
  const {t} = useTranslation()
  const {data} = useFetchUserNotifications();



  useEffect(()=>{
    console.log('notifications',data);
  },[data])
  
  return (
    <div className={`grid grid-cols-[4fr_1.65fr] `}>
      <div className="profile border-r-[1px] border-neutral-500">
        <Topbar>
          <p>{t(`Notifications`)}</p>
        </Topbar>

        {/* notification content */}
        <div className="notification__content px-20">
          <div className="mt-6 flex flex-col gap-5">
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
          </div>
        </div>
      </div>

      {/*configurations Section */}
      <div className="profile__configurationz hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
}

export default Notifications;