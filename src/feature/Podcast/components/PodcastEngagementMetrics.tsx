import React, { useState, useRef, useEffect } from "react";
import { LuThumbsUp, LuMessageSquare, LuBookmark, LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import { useGetMySavedPodcasts } from "../hooks";
import {
  useSavePodcastToLibrary,
  useRemovePodcastFromLibrary,
} from "../hooks";
import { useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";

import PodcastReactionsPopup from "../../Interactions/components/PodcastReactionPopup";
import PodcastReactionModal from "./PodcastReactionmodal";

interface PodcastEngagementMetricsProps {
  comments: number;
  onCommentClick?: () => void;
  id: string;
}

const PodcastEngagementMetrics: React.FC<PodcastEngagementMetricsProps> = ({
  comments,
  onCommentClick,
  id,
}) => {
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [showReactionsPopup, setShowReactionsPopup] = useState(false);

  const { mutate: savePodcast, isPending: isSaving } = useSavePodcastToLibrary();
  const { mutate: removePodcast, isPending: isRemoving } = useRemovePodcastFromLibrary();

  const { data: savedPodcastsData } = useGetMySavedPodcasts({
    page: 1,
    limit: 20,
  });

  const { data: allReactions } = useGetAllReactionsForTarget("Podcast", id);

  const getSavedPodcastIds = (savedData: any): string[] => {
    if (!savedData?.data?.savedPodcasts) return [];
    return savedData.data.savedPodcasts.map(
      (savedPodcast: { podcastId: { _id: string } }) => savedPodcast.podcastId._id
    );
  };

  const savedPodcastIds = getSavedPodcastIds(savedPodcastsData);
  const isCurrentPodcastSaved = savedPodcastIds.includes(id);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isSaving || isRemoving) return;

    if (isCurrentPodcastSaved) {
      removePodcast(id, {
        onSuccess: () => {
          toast.success("Removed from bookmarks");
        },
        onError: (error) => {
          toast.error("Failed to remove from bookmarks");
          console.error(error);
        },
      });
    } else {
      savePodcast(
        { podcastId: id, payload: { playlistCategory: "favorites" } },
        {
          onSuccess: () => {
            toast.success("Added to bookmarks");
          },
          onError: (error) => {
            toast.error("Failed to add to bookmarks");
            console.error(error);
          },
        }
      );
    }
  };

  // Close reaction modal when clicking outside
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showReactionModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowReactionModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactionModal]);

  const handleReact = () => {
    setShowReactionModal(false);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReactionModal(true);
  };

  const handleReactionsCountClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReactionsPopup(true);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-6">
        {/* Engagement Icons */}
        <div className="flex items-center gap-3 text-neutral-50 relative">
          <button
            onClick={handleLikeClick}
            className="flex items-center gap-1 hover:text-primary-400 transition-colors duration-200"
            title="React"
          >
            <LuThumbsUp className="size-4"  onMouseEnter={() => setShowReactionModal(true)} />
            <span
              className="hover:underline cursor-pointer"
              onClick={handleReactionsCountClick}
            >
              {allReactions?.data?.totalReactions || 0}
            </span>
          </button>

        
          {showReactionModal && (
            <div
              ref={modalRef}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 rounded-lg p-2 min-w-[200px]"
            >
              <PodcastReactionModal
                podcast_id={id}
                onReact={handleReact}
                onClose={() => setShowReactionModal(false)}
              />
            </div>
          )}
        </div>

        <button
          onClick={onCommentClick}
          className="flex items-center gap-1 hover:text-primary-400 transition-colors duration-200"
          title="Comment"
        >
          <LuMessageSquare className="size-4" />
          <span className="text-sm">{comments}</span>
        </button>

        {/* Bookmark Icon */}
        <button
          onClick={handleBookmark}
          className={`hover:text-primary-400 transition-colors duration-200 ${
            isCurrentPodcastSaved ? "text-primary-400" : ""
          }`}
          disabled={isSaving || isRemoving}
          title={isCurrentPodcastSaved ? "Unsave" : "Save"}
        >
          {isSaving || isRemoving ? (
            <LuLoader size={16} className="animate-spin" />
          ) : (
            <LuBookmark
              size={16}
              className={`${isCurrentPodcastSaved ? "fill-primary-400 text-primary-400" : ""}`}
            />
          )}
        </button>
      </div>

      {/* Reactions Popup */}
      <PodcastReactionsPopup
        isOpen={showReactionsPopup}
        onClose={() => setShowReactionsPopup(false)}
        podcast_id={id}
      />
    </>
  );
};

export default PodcastEngagementMetrics;
