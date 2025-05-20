import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserReactionContainer from "./UserReactionContainer";
import { clap, heart, sadface, smile, thumb } from "../../../assets/icons";
import ReactionTab from "./ReactionTab";
import { useGetArticleReactions, useGetReactionsPerType } from "../hooks";
import { ReactionReceived } from "../../../models/datamodels";
import { useTranslation } from "react-i18next";

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

  const {t} = useTranslation()
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
          <span>{t("interaction.all")}</span>
          <span>{allReactions?.totalReactions || 0}</span>
        </div>
      ),
    },
    {
      id: "love",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={heart} alt="Heart" className="w-5 h-5" />
          <span>{reactionsPerType?.love?.totalUsers || 0}</span>
        </div>
      ),
    },
    {
      id: "cry",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={sadface} alt="Sad Face" className="w-5 h-5" />
          <span>{reactionsPerType?.cry?.totalUsers || 0}</span>
        </div>
      ),
    },
    {
      id: "smile",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={smile} alt="Smile" className="w-5 h-5" />
          <span>{reactionsPerType?.smile?.totalUsers || 0}</span>
        </div>
      ),
    },
    {
      id: "like",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={thumb} alt="Thumb" className="w-5 h-5" />
          <span>{reactionsPerType?.like?.totalUsers || 0}</span>
        </div>
      ),
    },
    {
      id: "clap",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={clap} alt="Clap" className="w-5 h-5" />
          <span>{reactionsPerType?.clap?.totalUsers || 0}</span>
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState<number | string>(
    reactionsTab[0].id
  );

  useEffect(() => {
   
  }, [allReactions,reactionsPerType]);

  if (!isOpen) return null;

  // Handle loading and error states
  if (isLoadingAllReactions || isLoadingReactionsPerType) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-[2000]">
        <div className="bg-[var(--plain-b)] rounded-lg md:w-[50vw] max-w-full shadow-lg h-[80vh] p-4">
          <div className="">
            <div className="flex items-center justify-between p-4">
              <div className="h-6 w-24 bg-[var(--neutral-300)] rounded animate-pulse"></div>
              <div className="h-6 w-6 bg-[var(--neutral-300)] rounded animate-pulse"></div>
            </div>
            <div className="w-[70%] px-4">
              <div className="flex gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-5 w-16 bg-[var(--neutral-300)] rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3 min-h-[30vh] max-h-[63vh] overflow-y-auto">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="h-16 bg-[var(--neutral-300)] rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isErrorAllReactions || isErrorReactionsPerType) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-[910]">
        <div className="bg-[var(--plain-b)] rounded-lg w-[50vw] max-w-full shadow-lg h-[80vh] p-4 items-center justify-center">
          <p className="text-[var(--text-color)]">
            {t("interaction.errors.reactionerror")}
          </p>
          <button
            onClick={onClose}
            className=""
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-[910]">
      <div className="bg-[var(--plain-b)] rounded-lg w-[95%] md:w-[50vw] max-w-full shadow-lg h-[50vh] md:h-[80vh]">
        <div className="border-b border-[var(--neutral-400-main)]">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-[var(--text-color)]">
              {t("interaction.reactions")}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--neutral-300)] hover:text-[var(--neutral-50)]"
            >
              <X size={20} />
            </button>
          </div>
          <div className="md:w-[70%] px-2">
            <ReactionTab
              tabs={reactionsTab}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={true}
              borderBottom={false}
            />
          </div>
        </div>
        <div className="p-4 space-y-3 min-h-[30vh] max-h-[63vh] overflow-y-auto">
          {activeTab === "All" &&
            allReactions?.reactions?.map((reaction: ReactionReceived) => (
              <UserReactionContainer
                key={reaction.type}
                type={reaction.type}
                user={reaction.user_id}
              />
            ))}
          {activeTab === "smile" &&
            allReactions?.reactions
              ?.filter(
                (reaction: ReactionReceived) => reaction.type === "smile"
              )
              .map((reaction: ReactionReceived) => (
                <UserReactionContainer
                  key={reaction.type}
                  type={reaction.type}
                  user={reaction.user_id}
                />
              ))}
          {activeTab === "cry" &&
            allReactions?.reactions
              ?.filter((reaction: ReactionReceived) => reaction.type === "cry")
              .map((reaction: ReactionReceived) => (
                <UserReactionContainer
                  key={reaction.type}
                  type={reaction.type}
                  user={reaction.user_id}
                />
              ))}
          {activeTab === "love" &&
            allReactions?.reactions
              ?.filter((reaction: ReactionReceived) => reaction.type === "love")
              .map((reaction: ReactionReceived) => (
                <UserReactionContainer
                  key={reaction.type}
                  type={reaction.type}
                  user={reaction.user_id}
                />
              ))}
          {activeTab === "clap" &&
            allReactions?.reactions
              ?.filter((reaction: ReactionReceived) => reaction.type === "clap")
              .map((reaction: ReactionReceived) => (
                <UserReactionContainer
                  key={reaction.type}
                  type={reaction.type}
                  user={reaction.user_id}
                />
              ))}
          {activeTab === "like" &&
            allReactions?.reactions
              ?.filter((reaction: ReactionReceived) => reaction.type === "like")
              .map((reaction: ReactionReceived) => (
                <UserReactionContainer
                  key={reaction.type}
                  type={reaction.type}
                  user={reaction.user_id}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default ReactionsPopup;
