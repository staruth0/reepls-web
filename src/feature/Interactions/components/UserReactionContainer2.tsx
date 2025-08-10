import React from "react";
import { heart, sadface, smile, thumb, clap } from "../../../assets/icons/index";
import { useGetUserById } from "../../Profile/hooks";
import { useUser } from "../../../hooks/useUser";
import { XCircle } from "lucide-react";

interface UserReactionProps {
  user_id: string;
  type: string;
}

const UserReactionContainer2: React.FC<UserReactionProps> = ({ user_id, type }) => {
  const { user, isLoading } = useGetUserById(user_id);
  const { authUser } = useUser();

  const isCurrentAuthor = user_id === authUser?.id;

  // Placeholder for the delete functionality
  const handleDeleteReaction = () => {
    // You would implement the logic to delete the reaction here
    console.log(`Deleting reaction of type: ${type} for user: ${user_id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between border-b border-neutral-700 gap-3 px-2 py-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-neutral-600"></div>
          <div>
            <div className="h-4 w-24 bg-neutral-600 rounded"></div>
            <div className="h-3 w-32 mt-2 bg-neutral-600 rounded"></div>
          </div>
        </div>
        <div className="size-5 bg-neutral-600 rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between border-b border-neutral-700 gap-3 px-2 py-4 hover:bg-neutral-700 rounded-md transition-colors duration-200 cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-[13px]">
          {user?.username?.charAt(0)}
        </div>
        <div>
          <span className="flex-1 font-bold text-sm text-neutral-50">{user?.username}</span>
          <div className="text-xs text-neutral-400">{user?.bio}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {type === "love" && <img src={heart} alt="love" className="w-5 h-5" />}
        {type === "like" && <img src={thumb} alt="like" className="w-5 h-5" />}
        {type === "clap" && <img src={clap} alt="clap" className="w-5 h-5" />}
        {type === "cry" && <img src={sadface} alt="cry" className="w-5 h-5" />}
        {type === "smile" && <img src={smile} alt="smile" className="w-5 h-5" />}
        
        {isCurrentAuthor && (
          <button onClick={handleDeleteReaction} className="p-1 rounded-full hover:bg-neutral-800 transition-colors duration-200" title="Remove reaction">
            <XCircle size={20} color="red" className="cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
};

export default UserReactionContainer2;