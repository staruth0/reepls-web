import React, { useEffect, useState, useCallback, useMemo, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPodcastById,
  useSavePodcastToLibrary,
  useRemovePodcastFromLibrary,
  useCheckIfPodcastIsSaved,
  useDeletePodcast,
} from "../hooks";
import {
  LuArrowLeft,
  LuThumbsUp,
  LuMessageSquare,
  LuShare2,
  LuMenu,
  LuBookmark,
  LuLoader,
  LuPause,
  LuPlay,
} from "react-icons/lu";
import { EllipsisVertical } from "lucide-react";
import { toast } from "react-toastify";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import { formatDateWithMonth } from "../../../utils/dateFormater";
import PodcastCommentSidebar from "../components/PodcastCommentSidebar";
import { useFollowUser } from "../../../hooks/useFollowUser";
import { useUser } from "../../../hooks/useUser";
import { Pics } from "../../../assets/images";
import { useAudioControls } from "../../../hooks/useMediaPlayer";
import AudioWave from "../../../components/molecules/Audio/AudiWave";
import { useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";
import PodcastReactionsPopup from "../../Interactions/components/PodcastReactionPopup";
import PodcastReactionModal from "../components/PodcastReactionmodal";
import PodcastDetailSkeleton from "../components/PodcastDetailSkeleton";
import ConfirmationModal from "../../Blog/components/ConfirmationModal";
import { CognitiveModeContext } from "../../../context/CognitiveMode/CognitiveModeContext";

const PodcastDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutateAsync: deletePodcast } = useDeletePodcast();
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReactionsPopup, setShowReactionsPopup] = useState(false);
  const [showReactionsHoverPopup, setShowReactionsHoverPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const {
    data: podcastData,
    isLoading,
    isError,
    refetch,
  } = useGetPodcastById(id || "");

  const { data: allReactions } = useGetAllReactionsForTarget(
    "Podcast",
    id || ""
  );

  const { mutate: savePodcast, isPending: isSaving } =
    useSavePodcastToLibrary();
  const { mutate: removePodcast, isPending: isRemoving } = useRemovePodcastFromLibrary();

  const { data: isSavedData } = useCheckIfPodcastIsSaved(id);
  console.log("isSavedData", isSavedData);
  const isCurrentPodcastSaved = isSavedData?.data?.isSaved || false;

  const { authUser } = useUser();
  const isCurrentauthorPodcast = authUser?.id === podcastData?.data?.author?.id;

  // Follow/Unfollow hook
  const { isFollowing, toggleFollow, isFollowPending, isUnfollowPending } =
    useFollowUser({ targetUserId: podcastData?.data?.author?.id });

  useEffect(() => {
    const handleClickOutside = () => {
      setIsMenuOpen(false);
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleDelete = async () => {
    if (!id) return;

    setDeleteError(null);
    setIsDeleting(true);
    setShowDeleteConfirmation(false);

    try {
      await deletePodcast(id);
      setIsDeleting(false);
      toast.success("Podcast deleted");
      navigate("/feed/podcasts");
    } catch (error) {
      setIsDeleting(false);
      setDeleteError("An error occurred while deleting.");
    }
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    setShowDeleteConfirmation(true);
  };

  const retryDelete = () => {
    handleDelete();
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteError(null);
  };

  const handleReact = () => {
    setShowReactionsHoverPopup(false);
  };

  const handleComment = () => setIsCommentSidebarOpen(true);

  const handleBookmark = () => {
    if (isSaving || isRemoving) return;

    if (isCurrentPodcastSaved) {
      removePodcast(id || "", {
        onSuccess: () => {
          toast.success("Removed from bookmarks");
          refetch();
        },
      });
    } else {
      savePodcast(
        {
          podcastId: id || "",
          payload: { playlistCategory: "favorites" },
        },
        {
          onSuccess: () => {
            toast.success("Added to bookmarks");
            refetch();
          },
        }
      );
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const handleGoBack = () => navigate(-1);

  const handleEdit = () => {
    navigate(`/podcast/edit/${id}`);
    setIsMenuOpen(false);
  };

  const podcast = podcastData?.data;

  const { isPlaying, togglePlay, currentTrack } = useAudioControls(
    podcast
      ? {
          id: podcast.id,
          title: podcast.title,
          url: podcast.audio.url,
          thumbnail: podcast.thumbnailUrl,
          author: podcast.author?.name,
        }
      : undefined
  );

  // Format duration helper function
  const formatDuration = useCallback((seconds?: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Memoized podcast duration
  const memoizedPodcastDuration = useMemo(() => 
    formatDuration(podcast?.audio?.duration),
    [podcast?.audio?.duration, formatDuration]
  );

  const getFollowStatusText = () => {
    if (isFollowPending) return "Following...";
    if (isUnfollowPending) return "Unfollowing...";
    return isFollowing ? "Following" : "Follow";
  };

  if (isLoading) {
    return <PodcastDetailSkeleton />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background text-neutral-50">
        <Topbar>
          <div className="w-full flex justify-between items-center py-4 px-4">
            <span className="font-semibold text-lg">Podcast</span>
            <LuMenu size={24} className="hidden md:block" />
          </div>
        </Topbar>
        <div className="flex flex-col justify-center items-center h-[80vh]">
          <div className="text-xl mb-4">Failed to load podcast</div>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full"
          >
            <LuArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative bg-background text-neutral-50">
      {(isDeleting || deleteError) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
          <div className="bg-neutral-800 rounded-lg p-6 w-[300px] text-center">
            {isDeleting && !deleteError && (
              <>
                <LuLoader size={32} className="mx-auto mb-4 animate-spin" />
                <p className="text-lg font-semibold">Deleting...</p>
              </>
            )}
            {deleteError && (
              <>
                <p className="text-lg font-semibold mb-4">{deleteError}</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={retryDelete}
                    className="px-4 py-2 bg-main-green rounded-lg hover:bg-green-600"
                  >
                    Retry
                  </button>
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 bg-neutral-600 rounded-lg hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Topbar>
        <div className="w-full flex justify-between items-center py-4 px-4 relative">
          <span className="font-semibold text-lg">Podcast</span>
          {isCurrentauthorPodcast && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent the global listener from firing immediately
                  setIsMenuOpen((prev) => !prev);
                }}
                className="hidden md:block p-2 rounded-full hover:bg-neutral-700"
              >
                <LuMenu size={24} />
              </button>

              {/* Desktop dropdown */}
              {isMenuOpen && (
                <div
                  className="absolute right-4 top-16 w-48 bg-neutral-700 rounded-md shadow-lg py-1 z-[1000000]"
                  onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
                  >
                    Edit Podcast
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-600"
                  >
                    Delete Podcast
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Topbar>

      <div className="max-w-[750px] w-full mx-auto px-4 mb-56 flex-grow py-8 flex flex-col gap-2">
        {/* Author Info */}
        <div className="w-full flex my-4 items-center justify-between gap-4 mt-8 mb-4">
          <div className="flex gap-2">
            {podcast?.author?.profile_picture ? (
              <img
                src={podcast.author.profile_picture}
                alt={podcast.author.name || "Author"}
                className="rounded-full w-10 h-10 object-cover"
              />
            ) : (
              <div className="rounded-full w-12 h-12 bg-purple-500 flex items-center justify-center font-bold">
                {podcast?.author?.name?.charAt(0) || "A"}
              </div>
            )}
            <div className="space-y-2">
              <p className="font-semibold text-[16px]">
                {podcast?.author?.name || "Unknown"}
              </p>
              <p className="text-sm text-neutral-100">{podcast?.author?.bio}</p>
              <p className="text-sm text-neutral-100">
                {formatDateWithMonth(podcast?.createdAt)}
              </p>
            </div>
          </div>

          {authUser?.id !== podcast?.author?.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFollow();
              }}
              disabled={isFollowPending || isUnfollowPending}
              className={`ml-auto px-4 py-2 rounded-full text-sm ${
                isFollowing
                  ? "bg-neutral-600 hover:bg-neutral-700"
                  : "bg-main-green hover:bg-green-600"
              }`}
            >
              {getFollowStatusText()}
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className="text-[26px] font-semibold mb-2 mt-4">
          {podcast?.title}
        </h1>

        {/* Thumbnail */}
     {!isCognitiveMode &&   <div className="my-6 w-full max-w-full mx-auto">
          <img
            src={podcast?.thumbnailUrl || Pics.podcastimg}
            alt={podcast?.title}
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          />
        </div>}

        {/* Audio */}
        <div className="flex items-center gap-4 my-6 p-4 bg-neutral-800 rounded-lg overflow-hidden">
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-main-green hover:bg-green-600 flex-shrink-0"
          >
            {currentTrack?.id === podcast?.id && isPlaying ? (
              <LuPause size={20} />
            ) : (
              <LuPlay size={20} />
            )}
          </button>

          <div className="flex-grow min-w-0 overflow-hidden">
            <AudioWave
              isPlaying={currentTrack?.id === podcast?.id && isPlaying}
            />
          </div>

          <span className="text-sm text-neutral-400 flex-shrink-0 whitespace-nowrap">
            {memoizedPodcastDuration}
          </span>
        </div>

        {/* Description */}
        <div className="w-full mb-5 text-lg leading-relaxed">
          <h3 className="text-[18px] font-semibold mb-2">Author's notes</h3>
          <p className="text-neutral-300 text-[16px]">
            {podcast?.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-800 rounded-full shadow-lg p-2 flex gap-4 items-center justify-center">
        {/* Reactions Button with Hover Popup */}
        <div className="flex items-center">
          <div
            className="relative group"
            onMouseEnter={() => setShowReactionsHoverPopup(true)}
            onMouseLeave={() => setShowReactionsHoverPopup(false)}
          >
            <button
              className={`p-2 rounded-full flex items-center ${
                allReactions?.data?.totalReactions ? "text-primary-400" : "text-neutral-50 hover:bg-neutral-700"
              }`}
              title="React"
              aria-label="React to podcast"
            >
              <LuThumbsUp size={20} />
            </button>

            {showReactionsHoverPopup && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowReactionsHoverPopup(false)} />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[999] rounded-lg p-2 min-w-[200px]">
                  <div className="relative z-">
                    <PodcastReactionModal
                      podcast_id={id || ""}
                      onReact={handleReact}
                      onClose={() => setShowReactionsHoverPopup(false)}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative">
            <span
              className="ml-1 text-sm hover:text-primary-400 hover:underline cursor-pointer"
              onClick={() => (allReactions?.data?.totalReactions || 0) > 0 && setShowReactionsPopup(true)}
            >
              {allReactions?.data?.totalReactions || 0}
            </span>
            
            {/* Reactions Popup positioned relative to reaction count */}
            {showReactionsPopup && (allReactions?.data?.totalReactions || 0) > 0 && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[9999]">
                <PodcastReactionsPopup
                  isOpen={showReactionsPopup}
                  onClose={() => setShowReactionsPopup(false)}
                  podcast_id={id || ""}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleComment}
            className="p-2 rounded-full hover:bg-neutral-700"
          >
            <LuMessageSquare size={20} />
          </button>
          <span className="ml-1 text-sm">
            {podcastData?.data.commentsCount || 0}
          </span>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 rounded-full hover:bg-neutral-700 ${
            isCurrentPodcastSaved ? "text-primary-400" : ""
          }`}
          disabled={isSaving || isRemoving}
        >
          {isSaving || isRemoving ? (
            <LuLoader size={20} className="animate-spin" />
          ) : (
            <LuBookmark
              size={20}
              className={`${
                isCurrentPodcastSaved ? "fill-primary-400 text-primary-400" : ""
              }`}
            />
          )}
        </button>

        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-neutral-700"
        >
          <LuShare2 size={20} />
        </button>

        {/* Mobile menu trigger */}
        {isCurrentauthorPodcast && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="md:hidden p-2 rounded-full hover:bg-neutral-700"
          >
            <EllipsisVertical size={20} />
          </button>
        )}

        {/* Popup for mobile too */}
        {isMenuOpen && (
          <div
            className="absolute bottom-14 right-4 md:hidden w-48 bg-neutral-700 rounded-md shadow-lg py-1 z-50"
            onClick={(e) => e.stopPropagation()} // stops propagation so global click doesn't close it
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
            >
              Edit Podcast
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-600"
            >
              Delete Podcast
            </button>
          </div>
        )}
      </div>

      <PodcastCommentSidebar
        isOpen={isCommentSidebarOpen}
        onClose={() => setIsCommentSidebarOpen(false)}
        podcastId={id || ""}
        podcastAuthor={podcast?.author}
        podcast={podcast}
      />

      {showDeleteConfirmation && (
        <ConfirmationModal
          title="Delete Podcast"
          message="Are you sure you want to delete this podcast? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
          confirmText={isDeleting ? "Deleting..." : "Delete"}
          confirmColor="red"
        />
      )}
    </div>
  );
};

export default PodcastDetail;