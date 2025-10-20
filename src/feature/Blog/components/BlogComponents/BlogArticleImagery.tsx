import React, { useState, useEffect } from 'react';
import { Article, MediaItem, MediaType } from '../../../../models/datamodels';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogImageryProps {
  media: MediaItem[];
  article: Article;
}

const BlogArticleImagery: React.FC<BlogImageryProps> = ({ media, article }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayMedia.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayMedia.length) % displayMedia.length);
  };

  // Touch handling for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && displayMedia.length > 1) {
      nextSlide();
    }
    if (isRightSwipe && displayMedia.length > 1) {
      prevSlide();
    }
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
      {/* Thumbnail Display with Swiper */}
      <div className="relative w-full mx-auto">
        {displayMedia.length > 0 ? (
          displayMedia.length === 1 ? (
            <div 
              className="cursor-pointer w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9] bg-neutral-800 rounded-lg overflow-hidden group hover:opacity-95 transition-opacity duration-200"
              onClick={() => openModal(0)}
            >
              {displayMedia[0].type === MediaType.Image ? (
                <img
                  src={displayMedia[0].url}
                  alt={`Blog Visual`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <video
                  src={displayMedia[0].url}
                  className="w-full h-full object-cover"
                  controls
                  muted
                  autoPlay={false}
                  loop
                  playsInline
                  controlsList="nodownload"
                />
              )}
            </div>
          ) : (
            <div 
              className="relative w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9] rounded-lg overflow-hidden bg-neutral-800 group hover:opacity-95 transition-opacity duration-200"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Main Image/Video */}
              <div 
                className="w-full h-full cursor-pointer"
                onClick={() => openModal(0)}
              >
                {displayMedia[currentSlide].type === MediaType.Image ? (
                  <img
                    src={displayMedia[currentSlide].url}
                    alt={`Blog Visual ${currentSlide}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={displayMedia[currentSlide].url}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    autoPlay={false}
                    loop
                    playsInline
                    controlsList="nodownload"
                  />
                )}
              </div>

              {/* Navigation Arrows */}
              {displayMedia.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevSlide();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextSlide();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {displayMedia.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {displayMedia.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentSlide(index);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentSlide(index);
                      }}
                      className={`w-3 h-3 sm:w-2 sm:h-2 rounded-full transition-all duration-200 touch-manipulation ${
                        index === currentSlide 
                          ? 'bg-white' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )
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
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Main Image/Video */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                      {displayMedia[activeIndex]?.type === MediaType.Image ? (
                        <img
                          src={displayMedia[activeIndex].url}
                          alt={`Blog Visual ${activeIndex}`}
                          className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                          onLoad={() => setImageLoading(false)}
                          onError={() => setImageLoading(false)}
                        />
                      ) : (
                        <video
                          src={displayMedia[activeIndex].url}
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

                    {/* Navigation Arrows */}
                    <button
                      onClick={() => setActiveIndex(prev => prev > 0 ? prev - 1 : displayMedia.length - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => setActiveIndex(prev => prev < displayMedia.length - 1 ? prev + 1 : 0)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>

                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {displayMedia.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === activeIndex 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
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