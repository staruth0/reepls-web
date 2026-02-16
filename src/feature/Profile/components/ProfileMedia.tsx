import React, { useEffect, useRef } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useGetUserMedia } from '../hooks';
import ProfileMediaSkeleton from './ProfileMediaSkeleton';
import MediaItem from './MediaItemComponent';
import { MediaItemType, PostMedia } from '../../../models/datamodels';
import { t } from 'i18next';


interface ProfileMediaProps {
  userId: string;
}

const ProfileMedia: React.FC<ProfileMediaProps> = ({ userId }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetUserMedia(userId);

  // Auto-fetch next page when scrolling to the bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: '800px',
        threshold: 0.5,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Friendly error messages
  const getFriendlyErrorMessage = (error: Error | null): string => {
    if (!error) return 'Something went wrong. Please try again later.';
    if (error.message.includes('Network Error')) {
      return 'Oops! You seem to be offline. Check your connection.';
    }
    if (error.message.includes('404')) {
      return 'No media found for this user.';
    }
    if (error.message.includes('500')) {
      return 'Server issue. Please try again soon.';
    }
    if (error.message.includes('429')) {
      return 'Too many requests. Slow down a bit!';
    }
    return 'Unexpected error. We’re on it!';
  };

  // Flatten mediaData to get all media items
  const mediaItems: MediaItemType[] = data?.pages.flatMap((page: { mediaData: PostMedia[] }) =>
    page.mediaData.flatMap((post: PostMedia) => post.media)
  ) || [];

  return (
    <div className="">
      {isLoading ? (
        <ProfileMediaSkeleton />
      ) : (
        <div className="p-4">
          {mediaItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mediaItems.map((media, index) => (
                <MediaItem key={`${media.url}-${index}`} media={media} />
              ))}
            </div>
          ) : (
            <div className="text-neutral-50 text-center py-4">
             {error?'': t('No media available.')}
            </div>
          )}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center mt-8">
          <LuLoader className="animate-spin text-primary-400 size-10" />
        </div>
      )}
       {error && (
        <div className="text-neutral-50 text-center ">
          {getFriendlyErrorMessage(error)}
        </div>
      )}

      <div ref={bottomRef} style={{ height: '100px' }} />

     
    </div>
  );
};

export default ProfileMedia;