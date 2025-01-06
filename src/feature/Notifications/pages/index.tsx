import React from 'react'
import Topbar from '../../../components/atoms/Topbar/Topbar';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import NotificationContainer from '../components/NotificationContainer';

const Notifications:React.FC = () => {
  return (
    <div className={`grid grid-cols-[4fr_1.66fr] `}>
     
      <div className="profile border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>Notifications</p>
        </Topbar>

        {/* notification content */}
        <div className="profile__content px-20">
          <div className='mt-6 flex flex-col gap-5'>
            <NotificationContainer />
            <NotificationContainer />
            <NotificationContainer />
          </div>
        </div>
      </div>

      {/*configurations Section */}
      <div className="profile__configurationz">
        <ProfileConfigurations />
      </div>
    </div>
  );
}

export default Notifications;