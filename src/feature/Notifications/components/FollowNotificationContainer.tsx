import React from 'react';
import { thumb } from '../../../assets/icons';
import { useGetUserById } from '../../Profile/hooks';


interface FollowNotificationProps {
  username: string;
  timestamp: string;
}

const FollowNotificationContainer: React.FC<FollowNotificationProps> = ({ username, timestamp }) => {
    const {user} = useGetUserById(username)
  return (
    <div className="flex gap-2 w-full items-start border-b-[1px] rounded border-neutral-500 pb-3">
      <img src={thumb} alt="user" className="w-[25px] mt-1" />
      <div className="flex-1 flex  gap-3 items-center relative">
        <div>{user?.username}</div>
        <div className="text-xl font-roboto font-bold text-neutral-50 flex items-center gap-3 ">
        <div className="text-[15px] font-normal">followed you</div>
          <div className=" absolute right-5">
           
            <div className="text-[15px] font-normal">{timestamp}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowNotificationContainer;