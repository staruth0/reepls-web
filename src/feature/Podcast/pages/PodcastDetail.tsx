import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetPodcastById,
  useSavePodcastToLibrary,
  useRemovePodcastFromLibrary,
  useGetMySavedPodcasts,
  useDeletePodcast,
} from "../hooks";
import {
  LuArrowLeft,
  LuHeart,
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

const PodcastDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
 const { mutateAsync: deletePodcast } = useDeletePodcast();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!id) return;

    setDeleteError(null);
    setIsDeleting(true);

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

  const retryDelete = () => {
    handleDelete();
  };

  const cancelDelete = () => {
    setIsDeleting(false);
    setDeleteError(null);
  };
  

  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const {
    data: podcastData,
    isLoading,
    isError,
    refetch,
  } = useGetPodcastById(id || "");

  const { mutate: savePodcast, isPending: isSaving } =
    useSavePodcastToLibrary();
  const { mutate: removePodcast, isPending: isRemoving } =
    useRemovePodcastFromLibrary();

  const { data: savedPodcastsData } = useGetMySavedPodcasts({
    page: 1,
    limit: 20,
  });

  const getSavedPodcastIds = (savedPodcastsData: any): string[] => {
    if (!savedPodcastsData?.data?.savedPodcasts) {
      return [];
    }

    return savedPodcastsData.data.savedPodcasts.map(
      (savedPodcast: { podcastId: { _id: string } }) =>
        savedPodcast.podcastId._id
    );
  };

  const savedPodcastIds = getSavedPodcastIds(savedPodcastsData);
  const isCurrentPodcastSaved = savedPodcastIds.includes(id || "");

  const { authUser } = useUser();

  const isCurrentauthorPodcast = authUser?.id === podcastData?.data?.author?.id;

  // Follow/Unfollow hook
  const { isFollowing, toggleFollow, isFollowPending, isUnfollowPending } =
    useFollowUser({ targetUserId: podcastData?.data?.author?.id });

  useEffect(() => {
    console.log("Podcast data fetched:", podcastData);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLike = () =>
    toast.info("Like functionality will be implemented soon");

  const handleComment = () => setIsCommentSidebarOpen(true);

  const handleBookmark = () => {
    if (isSaving || isRemoving) return;

    if (isCurrentPodcastSaved) {
      removePodcast(id || "", {
        onSuccess: () => {
          toast.success("Removed from bookmarks");
          refetch();
        },
        onError: () => toast.error("Failed to remove from bookmarks"),
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
          onError: () => toast.error("Failed to add to bookmarks"),
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


  const { 
    isPlaying, 
    togglePlay, 
    currentTrack 
  } = useAudioControls(podcast ? {
    id: podcast.id,
    title: podcast.title,
    url: podcast.audio.url,
    thumbnail: podcast.thumbnailUrl,
    author: podcast.author?.name,
  } : undefined);
 

  const getFollowStatusText = () => {
    if (isFollowPending) return "Following...";
    if (isUnfollowPending) return "Unfollowing...";
    return isFollowing ? "Following" : "Follow";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-neutral-50">
        <Topbar>
          <div className="w-full flex justify-between items-center py-4 px-4">
            <span className="font-semibold text-lg">Podcast</span>
            <LuMenu size={24} className="hidden md:block" />
          </div>
        </Topbar>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-pulse text-xl">Loading podcast...</div>
        </div>
      </div>
    );
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
        <div className="w-full flex justify-between items-center py-4 px-4">
          <span className="font-semibold text-lg">Podcast</span>
          {/* Menu only for md+ */}
        { isCurrentauthorPodcast &&  <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="hidden md:block p-2 rounded-full hover:bg-neutral-700"
          >
            <LuMenu size={24} />
          </button>}

          {/* Popup menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute hidden md:block right-4 top-16 w-48 bg-neutral-700 rounded-md shadow-lg py-1 z-[100000]"
        >
          <button
            onClick={handleEdit}
            className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
          >
            Edit Podcast
          </button>
          <button
            onClick={handleDelete}
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-600"
          >
            Delete Podcast
          </button>
        </div>
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
        <div className="my-6 w-full max-w-full mx-auto">
          <img
            src={podcast?.thumbnailUrl || Pics.podcastimg}
            alt={podcast?.title}
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          />
        </div>

        {/* Audio */}
 <div className="flex items-center gap-4 my-6 p-4 bg-neutral-800 rounded-lg">
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
  
  <div className="flex-grow w-full">
    <AudioWave isPlaying={currentTrack?.id === podcast?.id && isPlaying} />
  </div>
  
  <span className="text-sm text-neutral-400">
    {podcast?.duration || "0:00"}
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
        <div className="flex items-center">
          <button
            onClick={handleLike}
            className="p-2 rounded-full hover:bg-neutral-700"
          >
            <LuHeart
              size={20}
              className={
                podcast?.likesCount && podcast.likesCount > 0
                  ? "text-red-500"
                  : ""
              }
            />
          </button>
          <span className="ml-1 text-sm">{podcast?.likesCount || 0}</span>
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
                isCurrentPodcastSaved
                  ? "fill-primary-400 text-primary-400"
                  : ""
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
          ref={buttonRef}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-full hover:bg-neutral-700"
        >
          <EllipsisVertical size={20} />
        </button>
      )}
      {/* Popup for mobile too */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-14 right-4 md:hidden w-48 bg-neutral-700 rounded-md shadow-lg py-1 z-50"
        >
          <button
            onClick={handleEdit}
            className="block w-full text-left px-4 py-2 text-sm text-neutral-50 hover:bg-neutral-600"
          >
            Edit Podcast
          </button>
          <button
            onClick={handleDelete}
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
    </div>
  );
};

export default PodcastDetail;
