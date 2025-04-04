import { LuBadgeCheck } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

import { User } from '../../models/datamodels';


interface messageTypes {
  author: User;
  messageDate: string;
  messageText: string;
  postID:string;
}

const Message = (props: messageTypes) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/posts/communique/${props.postID}`);
  };

  return (
    <div
      className="flex flex-col gap-4 font-roboto  text-neutral-50 p-3 border-b-[1px] border-neutral-600 cursor-pointer"
      onClick={handleClick}>
      <header className="flex gap-2">
        {/* <span className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-14 h-14 text-center">
          {props.author?.username?.charAt(0).toUpperCase()  || 'D'}
        </span> */}
          {
  props.author?.profile_picture &&
  props.author.profile_picture !== 'https://example.com/default-profile.png' &&
  props.author.profile_picture !== 'https://example.com/new-profile-picture.jpg' ? (
    <img
      src={props.author.profile_picture}
      alt="avatar"
      className="cursor-pointer w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <span className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-14 h-14 text-center">
      {props.author?.username?.charAt(0).toUpperCase() || 'D'}
    </span>
  )
}

        <div className="flex flex-col justify-center items-start gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold m-0 line-clamp-1 text-ellipsis">{props.author?.username || 'Default'}</h2>
           {props.author?.is_verified_writer && <LuBadgeCheck className="text-primary-400 size-5" strokeWidth={2.5} />}
          </div>

          <p
            className={`text-neutral-50 text-xs whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1`}>
            {props.author?.title || 'Writer @ CMR FA magazine..'}
          </p>

          <span className="text-sm">{props.messageDate}</span>
        </div>
      </header>

    
        <div className="text-xs font-normal leading-5 line-clamp-2 overflow-hidden text-ellipsis">
          {props.messageText}
        </div>
      
    </div>
  );
};

export default Message;
