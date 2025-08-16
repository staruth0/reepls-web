import { X } from "lucide-react";
import React, { useState } from "react";
import { clap, heart, sadface, smile, thumb } from "../../../assets/icons";
import ReactionTab from "./ReactionTab";
import { useTranslation } from "react-i18next";
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
}

const PodcastReactionsPopup: React.FC<PodcastReactionsProps> = ({
  isOpen,
  onClose,
  podcast_id,
}) => {
  const { t } = useTranslation();

  const {
    data: allReactions,
    isLoading: isLoadingAllReactions,
    isError: isErrorAllReactions,
  } = useGetAllReactionsForTarget("Podcast", podcast_id);

  const {
    data: reactionsPerType,
    isLoading: isLoadingReactionsPerType,
    isError: isErrorReactionsPerType,
  } = useGetReactionsGroupedByType("Podcast", podcast_id);

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
          <img src={heart} alt="Heart" className="w-5 h-5" />
          <span>{reactionsPerType?.love?.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "cry",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={sadface} alt="Sad Face" className="w-5 h-5" />
          <span>{reactionsPerType?.cry?.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "smile",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={smile} alt="Smile" className="w-5 h-5" />
          <span>{reactionsPerType?.smile?.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "like",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={thumb} alt="Thumb" className="w-5 h-5" />
          <span>{reactionsPerType?.like?.users?.length || 0}</span>
        </div>
      ),
    },
    {
      id: "clap",
      title: (
        <div className="flex items-center gap-1 font-semibold text-[16px]">
          <img src={clap} alt="Clap" className="w-5 h-5" />
          <span>{reactionsPerType?.clap?.users?.length || 0}</span>
        </div>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState<number | string>(reactionsTab[0].id);

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

  // Helper function to render users for a specific reaction type
  const renderUsersForType = (type: string) => {
    const users = reactionsPerType?.[type]?.users;
    if (!users || users.length === 0) {
      return (
        <p className="text-center text-[var(--neutral-300)]">
          No one has reacted with {type} yet.
        </p>
      );
    }
    return users.map((user: any) => (
      <UserReactionContainer2
        key={user.id}
        type={type}
        user_id={user.id || ''}
      />
    ));
  };

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
            (allReactions?.data?.reactions?.length > 0 ? (
              allReactions.data.reactions.map((reaction: Reaction) => (
                <UserReactionContainer2
                  key={reaction._id}
                  type={reaction.type}
                  user_id={reaction.user_id}
                />
              ))
            ) : (
              <p className="text-center text-[var(--neutral-300)]">
                No reactions yet.
              </p>
            ))}

          {activeTab !== "All" && renderUsersForType(activeTab as string)}
        </div>
      </div>
    </div>
  );
};

export default PodcastReactionsPopup;