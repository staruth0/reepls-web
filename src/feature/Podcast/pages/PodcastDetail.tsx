import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPodcastById, useSavePodcastToLibrary, useRemovePodcastFromLibrary } from '../hooks';
import { LuArrowLeft, LuHeart, LuMessageSquare, LuBookmark, LuShare2, LuMenu } from 'react-icons/lu';
import { toast } from 'react-toastify';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { formatDateWithMonth } from '../../../utils/dateFormater';
import { useAudioPlayerControls, AudioPlayer } from '../../../components/molecules/AudioPlayer';
import PodcastCommentSidebar from '../components/PodcastCommentSidebar';


const PodcastDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);

  // Fetch podcast data
  const { data: podcastData, isLoading, isError, refetch } = useGetPodcastById(id || '');

  const {
    playTrack
  } = useAudioPlayerControls();

  // When podcast data changes, load track in global player
  useEffect(() => {

 console.log('log', podcastData?.data.id, 'equal to', id)

    if (podcastData?.data) {
      const data = podcastData.data;

      const track = {
        id: data.id || data._id || 'unknown',
        title: data.title || 'Untitled Podcast',
        url: data.audio?.url || '',
        thumbnail: data.thumbnailUrl || '',
        duration: data.audio?.duration || 0,
        artist: data.authorId?.username || data.authorId?.name || '',
      };

      playTrack(track);
      setIsBookmarked(data.isBookmarked || false);
    }
  }, [podcastData, playTrack,id]);

  // Audio player is now handled by the AudioPlayer component

  // Save podcast mutation
  const { mutate: savePodcast, isPending: isSaving } = useSavePodcastToLibrary();
  
  // Remove podcast mutation
  const { mutate: removePodcast, isPending: isRemoving } = useRemovePodcastFromLibrary();

  const handleLike = () => {
    toast.info('Like functionality will be implemented soon');
  };

  const handleComment = () => {
    setIsCommentSidebarOpen(true);
  };

  const handleBookmark = () => {
    if (isSaving) console.log('isSaving', isSaving)
    if (isRemoving) console.log('isRemoving', isRemoving)
    if (isBookmarked) {
      removePodcast(id || '', {
        onSuccess: () => {
          setIsBookmarked(false);
          toast.success('Removed from bookmarks');
          refetch();
        },
        onError: (error) => {
          toast.error('Failed to remove from bookmarks');
          console.error('Error removing bookmark:', error);
        }
      });
    } else {
      savePodcast({
        podcastId: id || '',
        payload: {
          playlistCategory: 'favorites',
        }
      }, {
        onSuccess: () => {
          setIsBookmarked(true);
          toast.success('Added to bookmarks');
          refetch();
        },
        onError: (error) => {
          toast.error('Failed to add to bookmarks');
          console.error('Error adding bookmark:', error);
        }
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleFollowClick = () => {
    setIsFollowing((prev) => !prev);
    toast.success(isFollowing ? 'Unfollowed' : 'Following');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const getFollowStatusText = () => (isFollowing ? 'Following' : 'Follow');

  // Handle loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-neutral-50">
        <Topbar>
          <div className="w-full flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
            <span className="font-semibold text-lg">Podcast</span>
            <LuMenu size={24} className="text-neutral-50" />
          </div>
        </Topbar>
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-pulse text-xl">Loading podcast...</div>
        </div>
      </div>
    );
  }

  // Handle error UI
  if (isError) {
    return (
      <div className="min-h-screen bg-background text-neutral-50">
        <Topbar>
          <div className="w-full flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
            <span className="font-semibold text-lg">Podcast</span>
            <LuMenu size={24} className="text-neutral-50" />
          </div>
        </Topbar>
        <div className="flex flex-col justify-center items-center h-[80vh]">
          <div className="text-xl mb-4">Failed to load podcast</div>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full text-neutral-50"
          >
            <LuArrowLeft /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const podcast = podcastData?.data;

  return (
    <div className="flex flex-col min-h-screen relative bg-background text-neutral-50">
      {/* Topbar */}
      <Topbar>
        <div className="w-full flex justify-between items-center py-4 px-4 sm:px-6 lg:px-8">
          <span className="font-semibold text-lg">Podcast</span>
          <LuMenu size={24} className="text-neutral-50" />
        </div>
      </Topbar>

      {/* Page content */}
      <div className="max-w-[750px] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-56 flex-grow py-8 flex flex-col gap-2">
        {/* Author Section */}
        <div className="w-full flex my-4 items-center justify-between gap-4 mt-8 mb-4">
          <div className="flex gap-2">
            {podcast?.author?.profile_picture ? (
              <img
                src={podcast.author.profile_picture}
                alt={podcast.author.name || 'Author'}
                className="rounded-full w-10 h-10 object-cover"
              />
            ) : (
              <div className="rounded-full w-12 h-12 bg-purple-500 flex items-center justify-center text-white font-bold">
                {podcast?.author?.name?.charAt(0) || 'A'}
              </div>
            )}
            <div className="space-y-2">
              <p className="font-semibold text-[16px]">{podcast?.author?.name || 'Unknown'}</p>
              <p className="text-sm text-neutral-100">{podcast?.author?.bio}</p>
              <p className="text-sm text-neutral-100">{formatDateWithMonth(podcast?.createdAt)}</p>
            </div>
          </div>
          <button
            onClick={handleFollowClick}
            className={`ml-auto px-4 py-2 rounded-full text-sm ${
              isFollowing ? 'bg-neutral-600 text-neutral-50 hover:bg-neutral-700' : 'bg-main-green text-white hover:bg-green-600'
            }`}
          >
            {getFollowStatusText()}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-[26px] md:text-[22px] font-semibold leading-normal lg:leading-tight mb-2 mt-4">
          {podcast?.title}
        </h1>

        {/* Thumbnail */}
        <div className="my-6 w-full max-w-full mx-auto">
          <img
            src={podcast?.thumbnailUrl || 'https://placehold.co/800x400/444444/FFFFFF?text=Podcast+Thumbnail'}
            alt={podcast?.title}
            className="w-full h-auto rounded-lg object-cover max-h-[500px]"
          />
        </div>

        {/* Audio Player */}
        <div className="my-6 w-full">
          <AudioPlayer inline={true} />
        </div>

        {/* Description */}
        <div className="w-full mb-5 text-lg leading-relaxed">
          <h3 className="text-[18px] font-semibold mb-2">Author's notes</h3>
          <p className="text-neutral-300 text-[16px]">{podcast?.description || 'No description provided.'}</p>
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-800 rounded-full shadow-lg p-2 flex gap-4 items-center justify-center md:bottom-6">
        <div className="flex items-center">
          <button onClick={handleLike} title="Like" className="p-2 rounded-full flex items-center text-neutral-50 hover:bg-neutral-700">
            <LuHeart size={20} className={podcast?.likesCount && podcast.likesCount > 0 ? 'text-red-500' : ''} />
          </button>
          <span className="ml-1 text-sm">{podcast?.likesCount || 0}</span>
        </div>
        <button onClick={handleComment} title="Comment" className="p-2 rounded-full hover:bg-neutral-700 text-neutral-50">
          <LuMessageSquare size={20} />
        </button>
        <button
          onClick={handleBookmark}
          title={isBookmarked ? 'Unsave' : 'Save'}
          className={`p-2 rounded-full hover:bg-neutral-700 text-neutral-50 ${isBookmarked ? 'fill-current text-yellow-500' : ''}`}
        >
          <LuBookmark size={20} />
        </button>
        <button onClick={handleShare} title="Share" className="p-2 rounded-full hover:bg-neutral-700 text-neutral-50">
          <LuShare2 size={20} />
        </button>
      </div>

      {/* Comment Sidebar */}
      <PodcastCommentSidebar
        isOpen={isCommentSidebarOpen}
        onClose={() => setIsCommentSidebarOpen(false)}
        podcastId={id || ''}
        podcastAuthor={podcast?.author}
        podcast={podcast}
      />
    </div>
  );
};

export default PodcastDetail;
