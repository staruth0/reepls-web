import React from "react";
import { Icon } from "@iconify/react";
import { useGetUserById } from "../../Profile/hooks";
import { useUser } from "../../../hooks/useUser";
import { XCircle, Loader2 } from "lucide-react";
import { useDeleteReaction } from "../hooks";
import { toast } from "react-toastify";

interface UserReactionProps {
  user_id: string;
  type: string;
  reaction_id?: string;
}

const UserReactionContainer2: React.FC<UserReactionProps> = ({ user_id, type, reaction_id }) => {
  const { user, isLoading } = useGetUserById(user_id);
  const { authUser } = useUser();
  const { mutate: deleteReaction, isPending: isDeleting } = useDeleteReaction();

  const isCurrentAuthor = user_id === authUser?.id;

  // Delete reaction functionality
  const handleDeleteReaction = () => {
    if (!reaction_id) {
      toast.error("Reaction ID not found");
      return;
    }
    
    deleteReaction(reaction_id, {
      onSuccess: () => {
        toast.success("Reaction removed successfully");
      },
      onError: (error) => {
        console.error("Failed to delete reaction:", error);
        toast.error("Failed to remove reaction");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-between gap-3 px-2 py-4 animate-pulse">
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
    <div className="flex items-center justify-between gap-3 px-2 py-4">
      <div className="flex items-center gap-3">
        {user?.profile_picture && user?.profile_picture !== 'https://example.com/default-profile.png' && user?.profile_picture !== '' ? (
          <img
            src={user?.profile_picture}
            alt="avatar"
            className="size-9 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="size-9 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-[13px]">
            {user?.name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase() || 'D'}
          </div>
        )}
        <div>
          <span className="flex-1 font-bold text-sm text-neutral-50">{user?.username}</span>
          <div className="text-xs text-neutral-400 truncate max-w-[120px] sm:max-w-[150px] md:max-w-[200px]" title={user?.bio}>
            {user?.bio && user.bio.length > 30 ? `${user.bio.substring(0, 30)}...` : user?.bio}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {type === "love" && <Icon icon="heroicons:heart" className="w-5 h-5 text-gray-600" />}
        {type === "like" && <Icon icon="heroicons:hand-thumb-up" className="w-5 h-5 text-gray-600" />}
        {type === "clap" && <Icon icon="pepicons-pencil:hands-clapping" className="w-5 h-5 text-gray-600 transform scale-x-[-1]" />}
        {type === "cry" && <Icon icon="heroicons:face-frown" className="w-5 h-5 text-gray-600" />}
        {type === "smile" && <Icon icon="heroicons:face-smile" className="w-5 h-5 text-gray-600" />}
        
        {isCurrentAuthor && (
          <button 
            onClick={handleDeleteReaction} 
            disabled={isDeleting}
            className="p-1 rounded-full hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
            title="Remove reaction"
          >
            {isDeleting ? (
              <Loader2 size={20} className="animate-spin text-red-500" />
            ) : (
              <XCircle size={20} color="red" className="cursor-pointer" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserReactionContainer2;