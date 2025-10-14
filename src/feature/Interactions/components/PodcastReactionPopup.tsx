import { X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
// import { useTranslation } from "react-i18next";
import { useGetAllReactionsForTarget, useGetReactionsGroupedByType } from "../../Repost/hooks/useRepost";
import UserReactionContainer2 from "./UserReactionContainer2";

interface Reaction {
  _id: string;
  type: "like" | "clap" | "love" | "smile" | "cry";
  user_id: string;
  target_id: string;
  target_type: "Podcast";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PodcastReactionsProps {
  podcast_id: string;
  isOpen: boolean;
  onClose: () => void;
  position?: { top?: number; left?: number; right?: number; bottom?: number };
}

const PodcastReactionsPopup: React.FC<PodcastReactionsProps> = ({
  isOpen,
  onClose,
  podcast_id,
  position,
}) => {

  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const {
    data: allReactions,
    // isLoading: isLoadingAllReactions,
    // isError: isErrorAllReactions,
  } = useGetAllReactionsForTarget("Podcast", podcast_id);

  const {
    data: reactionsPerType,
    // isLoading: isLoadingReactionsPerType,
    // isError: isErrorReactionsPerType,
  } = useGetReactionsGroupedByType("Podcast", podcast_id);

  const [activeTab, setActiveTab] = useState("All");

  const renderUsersForType = (type: string) => {
    const users = reactionsPerType?.[type as keyof typeof reactionsPerType]?.users || [];
    
    if (users.length === 0) {
      return (
        <p className="text-center text-gray-400 text-sm py-4 sm:py-6">
          No {type} reactions yet.
        </p>
      );
    }

    return users.map((user: any) => (
      <UserReactionContainer2
        key={user.id}
        type={type as "like" | "clap" | "love" | "smile" | "cry"}
        user_id={user.id || ''}
        reaction_id={user.reactionId || ''}
      />
    ));
  };

  return (
    <div 
      ref={popupRef}
      className={`bg-white rounded-lg shadow-lg border border-gray-200 z-[9999] 
                 w-80 sm:w-96 max-h-[20rem] sm:max-h-[28rem] ${
                   position ? 'absolute' : 'relative'
                 }`}
      style={position ? {
        top: position?.top ? `${position.top}px` : '-80px',
        bottom: position?.bottom ? `${position.bottom}px` : 'auto',
        left: position?.left ? `${position.left}px` : 'auto',
        right: position?.right ? `${position.right}px` : 'auto',
        // Smart positioning to prevent overflow on smaller screens
        transform: position?.right !== undefined ? 'translateX(0)' : 'translateX(-50%)',
        marginLeft: position?.right !== undefined ? '0' : '50%',
      } : {}}
    >
      {/* Header with reaction icons */}
      <div className="p-3 sm:p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800">Reactions</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
        
        {/* Reaction icons row - centered and responsive */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <div 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("clap")}
          >
            <Icon 
              icon="pepicons-pencil:hands-clapping" 
              className={`w-4 h-4 sm:w-7 sm:h-7 transform scale-x-[-1] ${
                activeTab === "clap" ? "text-primary-400" : ""
              }`} 
            />
            <span className={`text-xs sm:text-sm font-medium ${
              activeTab === "clap" ? "text-primary-400" : "text-gray-600"
            }`}>
              {reactionsPerType?.clap?.users?.length || 0}
            </span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("like")}
          >
            <Icon 
              icon="heroicons:hand-thumb-up" 
              className={`w-4 h-4 sm:w-7 sm:h-7 ${
                activeTab === "like" ? "text-primary-400" : ""
              }`} 
            />
            <span className={`text-xs sm:text-sm font-medium ${
              activeTab === "like" ? "text-primary-400" : "text-gray-600"
            }`}>
              {reactionsPerType?.like?.users?.length || 0}
            </span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("love")}
          >
            <Icon 
              icon="heroicons:heart" 
              className={`w-4 h-4 sm:w-7 sm:h-7 ${
                activeTab === "love" ? "text-primary-400" : ""
              }`} 
            />
            <span className={`text-xs sm:text-sm font-medium ${
              activeTab === "love" ? "text-primary-400" : "text-gray-600"
            }`}>
              {reactionsPerType?.love?.users?.length || 0}
            </span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("smile")}
          >
            <Icon 
              icon="heroicons:face-smile" 
              className={`w-4 h-4 sm:w-7 sm:h-7 ${
                activeTab === "smile" ? "text-primary-400" : ""
              }`} 
            />
            <span className={`text-xs sm:text-sm font-medium ${
              activeTab === "smile" ? "text-primary-400" : "text-gray-600"
            }`}>
              {reactionsPerType?.smile?.users?.length || 0}
            </span>
          </div>
          <div 
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveTab("cry")}
          >
            <Icon 
              icon="heroicons:face-frown" 
              className={`w-4 h-4 sm:w-7 sm:h-7 ${
                activeTab === "cry" ? "text-primary-400" : ""
              }`} 
            />
            <span className={`text-xs sm:text-sm font-medium ${
              activeTab === "cry" ? "text-primary-400" : "text-gray-600"
            }`}>
              {reactionsPerType?.cry?.users?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Users list */}
      <div className="p-2 sm:p-3 max-h-64 sm:max-h-80 overflow-y-auto">
        {activeTab === "All" &&
          (allReactions?.data?.reactions?.length > 0 ? (
            allReactions.data.reactions.map((reaction: Reaction) => (
              <UserReactionContainer2
                key={reaction._id}
                type={reaction.type}
                user_id={reaction.user_id}
                reaction_id={reaction._id}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm py-4 sm:py-6">
              No reactions yet.
            </p>
          ))}

        {/* Use the helper function to render users for each tab */}
        {activeTab !== "All" && renderUsersForType(activeTab as string)}
      </div>
    </div>
  );
};

export default PodcastReactionsPopup;