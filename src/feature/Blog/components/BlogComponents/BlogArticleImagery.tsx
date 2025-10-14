import React, { useState, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Article, MediaItem, MediaType } from '../../../../models/datamodels';
import { X } from 'lucide-react';

interface BlogImageryProps {
  media: MediaItem[];
  article: Article;
}

const BlogArticleImagery: React.FC<BlogImageryProps> = ({ media, article }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // Create media array with thumbnail as first item if it exists
  const displayMedia = article.thumbnail
    ? [
        { url: article.thumbnail, type: MediaType.Image },
        ...media.filter(item => item.url !== article.thumbnail)
      ]
    : media;

  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    setImageLoading(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = ''; // Re-enable scrolling
  };

  // Close modal on ESC key press and handle arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft' && isModalOpen) {
        setActiveIndex(prev => prev > 0 ? prev - 1 : displayMedia.length - 1);
      } else if (e.key === 'ArrowRight' && isModalOpen) {
        setActiveIndex(prev => prev < displayMedia.length - 1 ? prev + 1 : 0);
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, displayMedia.length]);

  return (
    <>
      {/* Thumbnail Display */}
      <div className="relative w-full mx-auto">
        {displayMedia.length > 0 ? (
          <div 
            className="cursor-pointer"
            onClick={() => openModal(0)}
          >
            {displayMedia[0].type === MediaType.Image ? (
              <img
                src={displayMedia[0].url}
                alt={`Blog Visual`}
                className="w-full h-auto object-contain rounded-lg"
                loading="lazy"
              />
            ) : (
              <video
                src={displayMedia[0].url}
                className="w-full h-auto object-contain rounded-lg"
                controls
                muted
                autoPlay={false}
                loop
                playsInline
                controlsList="nodownload"
              />
            )}
          </div>
        ) : null}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <>
          {/* Custom Overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2">
            <div className="relative bg-black/95 backdrop-blur-sm rounded-xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden shadow-2xl">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-[9999] p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200 backdrop-blur-sm"
                aria-label="Close gallery"
              >
                <X size={20} />
              </button>
              
              {/* Image counter */}
              {displayMedia.length > 1 && (
                <div className="absolute top-4 left-4 z-[9999] px-3 py-1 rounded-full bg-black/60 text-white text-sm backdrop-blur-sm">
                  {activeIndex + 1} / {displayMedia.length}
                </div>
              )}

              <div className="w-full h-full flex items-center justify-center">
                {displayMedia.length > 1 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    initialSlide={activeIndex}
                    loop={true}
                    spaceBetween={0}
                    slidesPerView={1}
                    className="h-full w-full"
                  >
                    {displayMedia.map((mediaItem, index) => (
                      <SwiperSlide key={index} className="flex items-center justify-center h-full w-full">
                        <div className="relative w-full h-full flex items-center justify-center">
                          {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            </div>
                          )}
                          {mediaItem.type === MediaType.Image ? (
                            <img
                              src={mediaItem.url}
                              alt={`Blog Visual ${index}`}
                              className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300"
                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                              onLoad={() => setImageLoading(false)}
                              onError={() => setImageLoading(false)}
                            />
                          ) : (
                            <video
                              src={mediaItem.url}
                              className="max-w-full max-h-full w-auto h-auto object-contain"
                              controls
                              autoPlay
                              muted
                              loop
                              playsInline
                              controlsList="nodownload"
                              style={{ maxWidth: '100%', maxHeight: '100%' }}
                              onLoadedData={() => setImageLoading(false)}
                              onError={() => setImageLoading(false)}
                            />
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                    {displayMedia[0]?.type === MediaType.Image ? (
                      <img
                        src={displayMedia[0].url}
                        alt={`Blog Visual`}
                        className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        onLoad={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                      />
                    ) : (
                      <video
                        src={displayMedia[0].url}
                        className="max-w-full max-h-full w-auto h-auto object-contain"
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        controlsList="nodownload"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                        onLoadedData={() => setImageLoading(false)}
                        onError={() => setImageLoading(false)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BlogArticleImagery;