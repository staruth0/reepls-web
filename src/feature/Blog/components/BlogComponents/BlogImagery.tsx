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

const BlogImagery: React.FC<BlogImageryProps> = ({ media, article }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = ''; // Re-enable scrolling
  };

  // Close modal on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Thumbnail Gallery */}
      <div className="relative w-full sm:max-w-[300px] md:max-w-[500px] lg:max-w-[700px] mx-auto transition-all duration-300">
        {displayMedia.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            loop={true}
            spaceBetween={20}
            slidesPerView={1}
            className="rounded-sm absolute w-full z-0 cursor-pointer"
          >
            {displayMedia.map((mediaItem, index) => (
              <SwiperSlide 
                key={index} 
                className="flex justify-center"
                onClick={() => openModal(index)}
              >
                {mediaItem.type === MediaType.Image ? (
                  <img
                    src={mediaItem.url}
                    alt={`Blog Visual ${index}`}
                    className="w-full max-h-[80vh] object-cover rounded-sm"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={mediaItem.url}
                    className="w-full max-h-[80vh] object-cover rounded-sm"
                    controls
                    muted
                    autoPlay={false}
                    loop
                    playsInline
                    controlsList="nodownload"
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <>
          {/* Custom Overlay */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-[1000] p-4">
            <div className="relative bg-background rounded-lg md:max-w-[80vw] w-full max-h-[90vh] overflow-hidden">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Close gallery"
              >
                <X size={24} />
              </button>

              <div className="w-full h-full p-4 flex items-center justify-center">
                <Swiper
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={{ clickable: true }}
                  initialSlide={activeIndex}
                  loop={true}
                  spaceBetween={20}
                  slidesPerView={1}
                  className="h-full w-full"
                >
                  {displayMedia.map((mediaItem, index) => (
                    <SwiperSlide key={index} className="flex items-center justify-center h-full">
                      <div className="relative w-full h-full flex items-center justify-center">
                        {mediaItem.type === MediaType.Image ? (
                          <img
                            src={mediaItem.url}
                            alt={`Blog Visual ${index}`}
                            className="max-w-full max-h-[80vh] object-contain"
                          />
                        ) : (
                          <video
                            src={mediaItem.url}
                            className="max-w-full max-h-[80vh] object-contain"
                            controls
                            autoPlay
                            muted
                            loop
                            playsInline
                            controlsList="nodownload"
                          />
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BlogImagery;