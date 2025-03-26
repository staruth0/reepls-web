import React from 'react';
import { thumb } from '../../../assets/icons';
import { useGetUserById } from '../../Profile/hooks';
import { useUpdateNotificationReadStatus } from '../hooks/useNotification';


interface FollowNotificationProps {
  username: string;
  timestamp: string;
  is_read:boolean;
  id:string
}

const FollowNotificationContainer: React.FC<FollowNotificationProps> = ({ username, timestamp ,is_read,id}) => {
    const {user} = useGetUserById(username)
      const {mutate} = useUpdateNotificationReadStatus();
    
        const updateStatus = ()=>{
          mutate( {notificationId:id , isRead:true},{
            onSuccess:()=>{
              console.log('success read')
            }
          })
        }
  return (
    <div onClick={updateStatus} className={`flex gap-2 w-full items-start border-b-[1px] rounded border-neutral-500 pb-3 cursor-pointer ${!is_read ? 'bg-primary-700 p-2':''}`}>
      <img src={thumb} alt="user" className="w-[25px] mt-1" />
      <div className="flex-1 flex  gap-3 items-center relative">
        <div className='text-[16px]'>{user?.username}</div>
        <div className="text-xl font-roboto font-bold text-neutral-50 flex items-center gap-3 ">
        <div className="text-[15px] font-normal">followed you</div>
          <div className=" absolute right-0">
           
            <div className="text-[15px] font-normal">{timestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowNotificationContainer;