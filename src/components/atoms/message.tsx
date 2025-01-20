import { LuBadgeCheck } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

interface messageTypes {
  profile: string;
  Name: string;
  description: string;
  messageDate: string;
  messageText: string;
  isExpandedMode: boolean;
}

const Message = (props: messageTypes) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/posts/communique');
  };

  return (
    <div
      className="flex flex-col gap-4 font-roboto mt-2 text-neutral-50 p-3 border-b-[1px] border-neutral-600 cursor-pointer"
      onClick={handleClick}>
      <header className="flex gap-2">
        <span className="flex justify-center items-center bg-purple-200 text-purple-800 text-base font-medium rounded-full w-14 h-14 text-center">
          {props.profile}
        </span>

        <div className="flex flex-col justify-center items-start gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold m-0">{props.Name}</h2>
            <LuBadgeCheck className="text-primary-500 size-5" strokeWidth={2.5} />
          </div>

          <p
            className={`text-neutral-50 text-xs ${
              props.isExpandedMode ? 'whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]' : ''
            }`}>
            {props.description}
          </p>

          <span className="text-sm">{props.messageDate}</span>
        </div>
      </header>

      {!props.isExpandedMode && <div className="text-xs font-normal leading-5">{props.messageText}</div>}
    </div>
  );
};

export default Message;
