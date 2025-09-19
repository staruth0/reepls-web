import React, { useEffect } from 'react';
import { Publication } from '../../../models/datamodels';
import { useGetPublicationMedia } from '../Hooks';
import MediaSkeleton from './MediaSkeleton';

interface MediaItem {
  _id: string;
  article_id: string;
  article_slug: string | null;
  article_title: string;
  author: string | null;
  author_name: string | null;
  createdAt: string;
  is_publication_cover: boolean;
  media_type: 'image' | 'video';
  media_url: string;
}

interface streamprops {
  stream: Publication;
}

const MediaTab: React.FC<streamprops> = ({ stream }) => {
  const { data: mediaData, isLoading, error } = useGetPublicationMedia(stream._id || '');

  useEffect(() => {
    console.log('mediaData', mediaData);
  }, [mediaData]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="pb-10 space-y-6">
        <MediaSkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="pb-10 space-y-6">
        <div className="text-center py-8 text-red-500">Error loading media</div>
      </div>
    );
  }

  // Extract media from the response data
  const mediaItems: MediaItem[] = mediaData?.data || [];

  return (
    <div className="pb-10 space-y-6">
      {mediaItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No media found for this publication</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((media) => (
            <div key={media._id} className="relative group">
              {media.media_type === 'image' ? (
                <div className="relative p-2 md:p-0 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={media.media_url}
                    alt={media.article_title || 'Media'}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform rounded-lg duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {media.article_title}
                      </h3>
                      {media.is_publication_cover && (
                        <span className="inline-block bg-primary-500 text-white text-xs px-2 py-1 rounded">
                          Cover Image
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <video
                    src={media.media_url}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    controls
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {media.article_title}
                      </h3>
                      {media.is_publication_cover && (
                        <span className="inline-block bg-primary-500 text-white text-xs px-2 py-1 rounded">
                          Cover Video
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaTab;
