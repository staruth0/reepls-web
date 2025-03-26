import React from 'react';
import { thumb } from '../../../assets/icons';
import { useGetUserById } from '../../Profile/hooks';
import { useUpdateNotificationReadStatus } from '../hooks/useNotification';


interface CommentNotificationProps {
  username: string;
  timestamp: string;
  comment: string;
  is_read:boolean;
  id:string
}

const CommentNotificationContainer: React.FC<CommentNotificationProps> = ({ username, timestamp, comment,is_read,id }) => {
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
      <img src={thumb} alt="comment" className="w-[25px] mt-1" />
      <div className="flex-1 flex flex-col gap-1">
        <div className="text-[16px] font-roboto font-bold text-neutral-50 flex items-center gap-3 w-full">
         <div className='line-clamp-1'>  {user?.username}</div>
          <div className="flex justify-between items-center w-full">
            <div className="text-[15px] font-normal">commented on your post</div>
            <div className="text-[15px] font-normal ">{timestamp}</div>
          </div>
        </div>
        <p className="text-[14px] text-neutral-100">{comment}</p>
      </div>
    </div>
  );
};

export default CommentNotificationContainer;