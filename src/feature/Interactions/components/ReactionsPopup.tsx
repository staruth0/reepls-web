import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserReactionContainer from "./UserReactionContainer";
import { clap, heart, sadface, smile, thumb } from "../../../assets/icons";
import ReactionTab from "./ReactionTab";
import { useGetArticleReactions, useGetReactionsPerType } from "../hooks";

interface ReactionProps {
  article_id: string;
  isOpen: boolean;
  onClose: () => void;
}

const ReactionsPopup: React.FC<ReactionProps> = ({
  isOpen,
  onClose,
  article_id,
}) => {
  const {
    data: allReactions,
    isLoading: isLoadingAllReactions,
    isError: isErrorAllReactions,
  } = useGetArticleReactions(article_id);
  const {
    data: reactionsPerType,
    isLoading: isLoadingReactionsPerType,
    isError: isErrorReactionsPerType,
  } = useGetReactionsPerType(article_id);

  const reactionsTab = [
    {
      id: "All",
      title: (
        <div className="font-semibold text-[16px] space-x-1">
          <span>All</span>
          <span>{allReactions?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "love",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={heart} alt="Heart" className="w-5 h-5" />
          <span>{reactionsPerType?.love?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "cry",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={sadface} alt="Sad Face" className="w-5 h-5" />
          <span>{reactionsPerType?.cry?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "smile",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={smile} alt="Smile" className="w-5 h-5" />
          <span>{reactionsPerType?.smile?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "like",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={thumb} alt="Thumb" className="w-5 h-5" />
          <span>{reactionsPerType?.like?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "clap",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={clap} alt="Clap" className="w-5 h-5" />
          <span>{reactionsPerType?.clap?.length || 0}</span>
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState<number | string>(
    reactionsTab[0].id
  );

  useEffect(() => {
    console.log("allReactions", allReactions);
  }, [allReactions]);

  if (!isOpen) return null;

  // Handle loading and error states
  if (isLoadingAllReactions || isLoadingReactionsPerType) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg w-[50vw] max-w-full shadow-lg h-[80vh] p-4 flex items-center justify-center">
          <p>Loading reactions...</p>
        </div>
      </div>
    );
  }

  if (isErrorAllReactions || isErrorReactionsPerType) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg w-[50vw] max-w-full shadow-lg h-[80vh] p-4 flex items-center justify-center">
          <p>Error loading reactions. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-[50vw] max-w-full shadow-lg h-[80vh]">
        <div className="border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold">Reactions</h2>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black"
            >
              <X size={20} />
            </button>
          </div>

          <div className="w-[70%] px-2">
            <ReactionTab
              tabs={reactionsTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={true}
              borderBottom={true}
            />
          </div>
        </div>
        <div className="p-4 space-y-3 min-h-[30vh] max-h-[63vh] overflow-y-auto">
          {activeTab === "All" &&
            allReactions?.map((reaction, index) => (
              <UserReactionContainer
                key={index}
                type={reaction.type}
                user_id={reaction.user_id}
              />
            ))}
          {activeTab === "smile" &&
            allReactions
              ?.filter((reaction) => reaction.type === "smile")
              .map((reaction, index) => (
                <UserReactionContainer
                  key={index}
                  type={reaction.type}
                  user_id={reaction.user_id}
                />
              ))}
          {activeTab === "cry" &&
            allReactions
              ?.filter((reaction) => reaction.type === "cry")
              .map((reaction, index) => (
                <UserReactionContainer
                  key={index}
                  type={reaction.type}
                  user_id={reaction.user_id}
                />
              ))}
          {activeTab === "love" &&
            allReactions
              ?.filter((reaction) => reaction.type === "love")
              .map((reaction, index) => (
                <UserReactionContainer
                  key={index}
                  type={reaction.type}
                  user_id={reaction.user_id}
                />
              ))}
          {activeTab === "clap" &&
            allReactions
              ?.filter((reaction) => reaction.type === "clap")
              .map((reaction, index) => (
                <UserReactionContainer
                  key={index}
                  type={reaction.type}
                  user_id={reaction.user_id}
                />
              ))}
          {activeTab === "like" &&
            allReactions
              ?.filter((reaction) => reaction.type === "like")
              .map((reaction, index) => (
                <UserReactionContainer
                  key={index}
                  type={reaction.type}
                  user_id={reaction.user_id}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ReactionsPopup;
