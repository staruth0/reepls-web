import React, { useState } from 'react';
import { Home, Search, PlusCircle, Bookmark, User, Pencil, Mic } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { toast } from 'react-toastify';
import { useUser } from '../../hooks/useUser';
import { MAX_IMAGE_COUNT, MAX_VIDEO_COUNT } from '../../constants';
import PostModal from '../../feature/Blog/components/PostModal';
import { Article, MediaItem, MediaType } from '../../models/datamodels';
import { uploadPostImage, uploadPostVideo } from '../../utils/media';
import { useSendNewArticleNotification } from '../../feature/Notifications/hooks/useNotification';
import { getDecryptedUser } from '../../feature/Auth/api/Encryption';

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { authUser: user, isLoggedIn } = useUser();
  const decryptedUser = getDecryptedUser();
  const { mutate: createPost, isPending } = useSendNewArticleNotification();
  const handlePost = async (
    postContent: string,
    postImages: File[],
    postVideos: File[],
    isCommunique: boolean,
    tags: string[]
  ) => {
    if (!decryptedUser?.id) {
      toast.error("You must be logged in to create a post");
      return;
    }
    if (postImages.length > MAX_IMAGE_COUNT) {
      toast.error("You must upload at most " + MAX_IMAGE_COUNT + " images");
      return;
    }
    if (postVideos.length > MAX_VIDEO_COUNT) {
      toast.error("You must upload at most " + MAX_VIDEO_COUNT + " videos");
      return;
    }

    const images: MediaItem[] = [];
    const videos: MediaItem[] = [];
    for (const image of postImages) {
      if (decryptedUser?.id) {
        try {
          const url = await uploadPostImage(decryptedUser.id, image);
          images.push({ url, type: MediaType.Image });
        } catch {
          toast.error(
            "Your images could not be uploaded. Please try again later."
          );
          return;
        }
      }
    }
    for (const video of postVideos) {
      if (decryptedUser?.id) {
        try {
          const url = await uploadPostVideo(decryptedUser.id, video);
          videos.push({ url, type: MediaType.Video });
        } catch {
          toast.error(
            "Your videos could not be uploaded. Please try again later."
          );
          return;
        }
      }
    }

    const post: Article = {
      content: postContent,
      media: [...images, ...videos],
      type: "ShortForm",
      status: "Published",
      isArticle: false,
      is_communiquer: isCommunique,
      tags: tags,
    };

    createPost(post, {
      onSuccess: () => {
        setIsCreatingPost(false);
        navigate("/feed");
      },
      onError: (error: unknown) => {
        const errorMessage = error && typeof error === 'object' && 'response' in error 
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : error && typeof error === 'object' && 'message' in error
          ? (error as { message?: string }).message
          : 'Unknown error occurred';
        toast.error("Error creating post: " + errorMessage);
      },
    });
  };

  return (
    <div className='w-full bg-neutral-800 min-h-screen pb-14'>
      {children}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-neutral-700 p-2 flex md:hidden justify-around items-center z-50 h-20">
        <Link to="/feed" className="flex flex-col items-center text-neutral-100 hover:text-primary-500">
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/search" className="flex flex-col items-center text-neutral-100 hover:text-primary-500">
          <Search size={24} />
          <span className="text-xs mt-1">Search</span>
        </Link>
        
        {/* Create Post Button with Popover */}
        <div className="relative">
          <Popover>
            <PopoverButton className="flex flex-col items-center text-neutral-100 hover:text-primary-500">
              <PlusCircle size={24} />
              <span className="text-xs mt-1">Post</span>
            </PopoverButton>
            
            <PopoverPanel className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
              {({ close }) => (
                <div className="flex flex-col rounded-lg border border-neutral-500 bg-background shadow-lg w-40">
                  <button
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 hover:bg-neutral-700 hover:text-primary-400"
                    onClick={() => {
                      if (!isLoggedIn) {
                        toast.error("Please login to create a post");
                        return;
                      }
                      setIsCreatingPost(true);
                      close();
                    }}
                  >
                    <PlusCircle size={16} />
                    <span className="text-sm">Create Post</span>
                  </button>
                  
                  <hr className="border-neutral-500 w-3/4 mx-auto" />
                  
                  <button
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 hover:bg-neutral-700 hover:text-primary-400"
                    onClick={() => {
                      if (!isLoggedIn) {
                        toast.error("Please login to write an article");
                        return;
                      }
                      navigate("/posts/create");
                      close();
                    }}
                  >
                    <Pencil size={16} />
                    <span className="text-sm">Write Article</span>
                  </button>
                  
                  <hr className="border-neutral-500 w-3/4 mx-auto" />
                  
                  <button
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 hover:bg-neutral-700 hover:text-primary-400"
                    onClick={() => {
                      if (!isLoggedIn) {
                        toast.error("Please login to create a podcast");
                        return;
                      }
                      navigate("/podcast/create");
                      close();
                    }}
                  >
                    <Mic size={16} />
                    <span className="text-sm">Create Podcast</span>
                  </button>
                </div>
              )}
            </PopoverPanel>
          </Popover>
        </div>
        
        <Link to="/bookmarks" className="flex flex-col items-center text-neutral-100 hover:text-primary-500">
          <Bookmark size={24} />
          <span className="text-xs mt-1">Saved</span>
        </Link>
        <Link to={`/profile/${user?.username}`} className="flex flex-col items-center text-neutral-100 hover:text-primary-500">
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>

      {isCreatingPost && (
        <PostModal
          isModalOpen={isCreatingPost}
          setIsModalOpen={setIsCreatingPost}
          handlePost={handlePost}
          isPending={isPending}
        />
      )}
    </div>
  );
};

export default MainContent;
