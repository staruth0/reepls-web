import React, { useState, useRef, useEffect } from "react";
import { LuThumbsUp,  LuBookmark, LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import {
  useSavePodcastToLibrary,
  useRemovePodcastFromLibrary,
  useCheckIfPodcastIsSaved,
} from "../hooks";
import { useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";

import PodcastReactionsPopup from "../../Interactions/components/PodcastReactionPopup";
import PodcastReactionModal from "./PodcastReactionmodal";

interface PodcastEngagementMetricsProps {
  comments?: number;
  onCommentClick?: () => void;
  id: string;
}

const PodcastEngagementMetrics: React.FC<PodcastEngagementMetricsProps> = ({
 
  id,
}) => {
  const [showReactionModal, setShowReactionModal] = useState(false);
  const [showReactionsPopup, setShowReactionsPopup] = useState(false);

  const { mutate: savePodcast, isPending: isSaving } = useSavePodcastToLibrary();
  const { mutate: removePodcast, isPending: isRemoving } = useRemovePodcastFromLibrary();

  const { data: isSavedData } = useCheckIfPodcastIsSaved(id);
  const isCurrentPodcastSaved = isSavedData?.data?.isSaved || false;

  const { data: allReactions } = useGetAllReactionsForTarget("Podcast", id);

  const handleBookmark = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isSaving || isRemoving || !id) return;

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

  return (
    <>
      <div className="flex items-center justify-between gap-6">
        {/* Engagement Icons */}
        <div className="flex items-center gap-3 text-neutral-50 relative">
          <div className="relative">
            <button
              onClick={handleLikeClick}
              className="flex items-center gap-1 hover:text-primary-400 transition-colors duration-200"
              title="React"
            >
              <LuThumbsUp className="size-4"  onMouseEnter={() => setShowReactionModal(true)} />
            </button>

            {/* Reaction Modal - Positioned relative to the button */}
            {showReactionModal && (
              <div
                ref={modalRef}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[9999] rounded-lg p-2 min-w-[200px]"
              >
                <PodcastReactionModal
                  podcast_id={id}
                  onReact={handleReact}
                  onClose={() => setShowReactionModal(false)}
                />
              </div>
            )}
          </div>
          
          <div className="relative">
            <span
              className="hover:underline cursor-pointer"
              onClick={() => (allReactions?.data?.totalReactions || 0) > 0 && setShowReactionsPopup(true)}
            >
              {allReactions?.data?.totalReactions || 0}
            </span>
            
            {/* Reactions Popup positioned relative to reaction count */}
            {showReactionsPopup && (allReactions?.data?.totalReactions || 0) > 0 && (
              <PodcastReactionsPopup
                isOpen={showReactionsPopup}
                onClose={() => setShowReactionsPopup(false)}
                podcast_id={id}
                position={{ top: -200 }}
              />
            )}
          </div>
        </div>

    

        {/* Bookmark Icon */}
        <button
          onClick={handleBookmark}
          className={`hover:text-primary-400 transition-colors duration-200 ${
            isCurrentPodcastSaved ? "text-primary-400" : ""
          }`}
          disabled={isSaving || isRemoving || !id}
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

    </>
  );
};

export default PodcastEngagementMetrics;
