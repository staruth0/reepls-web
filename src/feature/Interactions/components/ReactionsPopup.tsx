import { X } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { Article, User } from "../../../models/datamodels";
import { useTranslation } from "react-i18next";
import { useGetAllReactionsForTarget, useGetReactionsGroupedByType } from "../../Repost/hooks/useRepost";
import UserReactionContainer2 from "./UserReactionContainer2";

interface Reaction {
  _id: string;
  type: "like" | "clap" | "love" | "smile" | "cry";
  user_id: string;
  target_id: string;
  target_type: "Article" | "Repost";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ReactionProps {
  article_id: string;
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  position?: { top?: number; left?: number; right?: number; bottom?: number };
}

const ReactionsPopup: React.FC<ReactionProps> = ({
  isOpen,
  onClose,
  article_id,
  article,
  position,
}) => {
  const { t } = useTranslation();
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

  



  // Determine the target type and ID based on the article prop
  const target_type = article.type === "Repost" ? "Repost" : "Article";
  const target_id = article.type === "Repost" && article.repost?.repost_id
    ? article.repost.repost_id
    : article_id;

  // Use the new hooks with the determined target_type and target_id
  const {
    data: allReactions,
    isLoading: isLoadingAllReactions,
    isError: isErrorAllReactions,
  } = useGetAllReactionsForTarget(target_type, target_id);

  const {
    data: reactionsPerType,
    isLoading: isLoadingReactionsPerType,
    isError: isErrorReactionsPerType,
  } = useGetReactionsGroupedByType(target_type, target_id);

 
  const reactionsTab = [
    {
      id: "All",
      title: (
        <div className="font-semibold text-[16px] space-x-1">
          <span>{t("interaction.all")}</span>
          <span>{allReactions?.data?.totalReactions || 0}</span>
        </div>
      ),
    },
    {
      id: "love",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <Icon icon="heroicons:heart" className="w-5 h-5" />
          <span>{reactionsPerType?.love?.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "cry",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <Icon icon="heroicons:face-frown" className="w-5 h-5" />
          <span>{reactionsPerType?.cry?.users?.length|| 0}</span>
        </div>
      ),
    },
    {
      id: "smile",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <Icon icon="heroicons:face-smile" className="w-5 h-5" />
          <span>{reactionsPerType?.smile?.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "like",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <Icon icon="heroicons:hand-thumb-up" className="w-5 h-5" />
          <span>{reactionsPerType?.like?.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "clap",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <Icon icon="pepicons-pencil:hands-clapping" className="w-5 h-5" />
          <span>{reactionsPerType?.clap?.users?.length || 0}</span>
        </div>
      ),
    },
  ];

    const [activeTab, setActiveTab] = useState<number | string>(
    reactionsTab[0].id
  );

  useEffect(() => {
    console.log('allReactions', allReactions)
    console.log('reactionspertypt',reactionsPerType)
  }, [allReactions, reactionsPerType]);



  if (!isOpen) return null;

  // Handle loading and error states
  if (isLoadingAllReactions || isLoadingReactionsPerType) {
    return (
      <div 
        ref={popupRef}
        className="absolute bg-white rounded-lg shadow-lg border border-gray-200 z-[999] 
                   w-80 sm:w-96 max-h-[20rem] sm:max-h-[28rem]
                   right-0"
        style={{
          top: position?.top ? `${position.top}px` : '-200px',
          bottom: position?.bottom ? `${position.bottom}px` : 'auto',
          left: position?.left ? `${position.left}px` : 'auto',
          right: position?.right ? `${position.right}px` : 'auto',
        }}
      >
        {/* Header skeleton */}
        <div className="p-3 sm:p-5 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          
          {/* Reaction icons skeleton */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-5 h-5 sm:w-7 sm:h-7 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-4 h-3 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Users list skeleton */}
        <div className="p-2 sm:p-3 max-h-64 sm:max-h-80 overflow-y-auto">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-2 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isErrorAllReactions || isErrorReactionsPerType) {
    return (
      <div 
        ref={popupRef}
        className="absolute bg-white rounded-lg shadow-lg border border-gray-200 z-[999] 
                   w-80 sm:w-96 max-h-[20rem] sm:max-h-[28rem]
                   right-0"
        style={{
          top: position?.top ? `${position.top}px` : '-200px',
          bottom: position?.bottom ? `${position.bottom}px` : 'auto',
          left: position?.left ? `${position.left}px` : 'auto',
          right: position?.right ? `${position.right}px` : 'auto',
        }}
      >
        {/* Header */}
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
        </div>

        {/* Error message */}
        <div className="p-3 sm:p-5 flex flex-col items-center justify-center h-32">
          <p className="text-gray-500 text-sm text-center mb-3">
            {t("interaction.errors.reactionerror")}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  }

  // Helper function to render users for a specific reaction type
  const renderUsersForType = (type: string) => {
    const users = reactionsPerType?.[type]?.users;
    if (!users || users.length === 0) {
      return (
        <div className="flex items-center justify-center h-32">
          <p className="text-center text-gray-400 text-sm">
            No reaction
          </p>
        </div>
      );
    }
    return users.map((user: User) => {
      // Find the reaction ID for this user and type from allReactions
      const userReaction = allReactions?.data?.reactions?.find(
        (reaction: Reaction) => reaction.user_id === user._id && reaction.type === type
      );
      
      return (
        <UserReactionContainer2
          key={user._id}
          type={type} // Pass the reaction type
          user_id={user._id || ''} // Pass the user ID as expected by UserReactionContainer2
          reaction_id={userReaction?._id} // Pass the reaction ID for deletion
        />
      );
    });
  };

  return (
    <div 
      ref={popupRef}
      className="absolute bg-white rounded-lg shadow-lg border border-gray-200 z-[999] 
                 w-80 sm:w-96 max-h-[20rem] sm:max-h-[28rem]
                 right-0"
      style={{
        top: position?.top ? `${position.top}px` : '-200px',
        bottom: position?.bottom ? `${position.bottom}px` : 'auto',
        left: position?.left ? `${position.left}px` : 'auto',
        right: position?.right ? `${position.right}px` : 'auto',
      }}
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
              className={`w-5 h-5 sm:w-7 sm:h-7 ${
                activeTab === "like" ? "text-primary-400" : "text-gray-600"
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
              className={`w-5 h-5 sm:w-7 sm:h-7 ${
                activeTab === "love" ? "text-primary-400" : "text-gray-600"
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
              className={`w-5 h-5 sm:w-7 sm:h-7 ${
                activeTab === "smile" ? "text-primary-400" : "text-gray-600"
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
              className={`w-5 h-5 sm:w-7 sm:h-7 ${
                activeTab === "cry" ? "text-primary-400" : "text-gray-600"
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

export default ReactionsPopup;