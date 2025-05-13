import { LuBadgeCheck } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { User } from '../../models/datamodels';

interface MessageTypes {
  author: User;
  messageDate: string;
  messageText: string;
  postID: string;
  slug:string;
  isArticle:boolean;
}

const Message = (props: MessageTypes) => {
  const navigate = useNavigate();

  const handleClick = () => {
      navigate(
      `${props.isArticle ? `/posts/article/slug/${props.slug}` : `/posts/post/${props.postID}`}`
    );
  };

  return (
    <div
      className="flex flex-col gap-3  text-neutral-50 p-4 border-b-[1px] border-neutral-700  hover:bg-neutral-700/70 transition-all duration-300 cursor-pointer "
      onClick={handleClick}
    >
      <header className="flex gap-3 items-center">
        {/* Profile Picture or Initials */}
        {props.author?.profile_picture &&
        props.author.profile_picture !== 'https://example.com/default-profile.png' &&
        props.author.profile_picture !== 'https://example.com/new-profile-picture.jpg' ? (
          <img
            src={props.author.profile_picture}
            alt={`${props.author?.username}'s avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-neutral-600  transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <span className="flex justify-center items-center bg-purple-200 text-purple-800 text-lg font-semibold rounded-full w-12 h-12 shadow-sm">
            {props.author?.username?.charAt(0).toUpperCase() || 'D'}
          </span>
        )}

        {/* Author Info */}
        <div className="flex flex-col justify-center items-start gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold m-0 line-clamp-1 text-ellipsis text-neutral-50 hover:text-primary-400 transition-colors duration-200">
              {props.author?.username || 'Default'}
            </h2>
            {props.author?.is_verified_writer && (
              <LuBadgeCheck className="text-primary-400 size-5" strokeWidth={2.5} />
            )}
          </div>
          <p className="text-neutral-300 text-xs font-medium  overflow-hidden text-ellipsis line-clamp-1">
            {props.author?.title || props.author.bio}
          </p>
          <span className="text-neutral-300 text-xs font-normal">
            {props.messageDate}
          </span>
        </div>
      </header>

      {/* Message Content */}
      <div className="text-sm font-normal leading-6 text-neutral-200 line-clamp-2 overflow-hidden text-ellipsis">
        {props.messageText}
      </div>
    </div>
  );
};

export default Message;