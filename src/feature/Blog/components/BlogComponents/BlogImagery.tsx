import React, { useState, useEffect } from 'react';
import { Article, MediaItem, MediaType } from '../../../../models/datamodels';
import { X } from 'lucide-react';

interface BlogImageryProps {
  media: MediaItem[];
  article: Article;
}

const BlogImagery: React.FC<BlogImageryProps> = ({ media, article }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const displayMedia = article.thumbnail
    ? [{ url: article.thumbnail, type: MediaType.Image }, ...media.filter(item => item.url !== article.thumbnail)]
    : media;

  const openModal = (index: number) => {
    setActiveIndex(index);
    setIsModalOpen(true);
    setImageLoading(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

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

  const renderImage = (mediaItem: MediaItem, index: number, className: string = "", isSingleImage: boolean = false, borderRadiusClass: string = "") => (
    <div 
      key={index} 
      className={`relative cursor-pointer ${className} bg-neutral-800 overflow-hidden group hover:opacity-95 transition-opacity duration-200 w-full ${borderRadiusClass}`}
      onClick={() => openModal(index)}
      style={isSingleImage ? { aspectRatio: "16 / 9" } : { aspectRatio: "1 / 1" }}
    >
      {mediaItem.type === MediaType.Image ? (
        <img
          src={mediaItem.url}
          alt={`Blog Visual ${index}`}
          className={isSingleImage ? "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" : "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"}
          loading="lazy"
        />
      ) : (
        <video
          src={mediaItem.url}
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
  );

  const renderImageWithOverlay = (mediaItem: MediaItem, index: number, className: string = "", remainingCount: number, borderRadiusClass: string = "") => (
    <div 
      key={index} 
      className={`relative cursor-pointer ${className} bg-neutral-800 overflow-hidden group hover:opacity-95 transition-opacity duration-200 w-full ${borderRadiusClass}`}
      onClick={() => openModal(index)}
      style={{ aspectRatio: "1 / 1" }}
    >
      {mediaItem.type === MediaType.Image ? (
        <img
          src={mediaItem.url}
          alt={`Blog Visual ${index}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      ) : (
        <video
          src={mediaItem.url}
          className="w-full h-full object-cover"
          controls
          muted
          autoPlay={false}
          loop
          playsInline
          controlsList="nodownload"
        />
      )}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        <span className="text-white text-2xl font-bold">+{remainingCount}</span>
      </div>
    </div>
  );

  const renderImageGallery = () => {
    if (displayMedia.length === 0) return null;
    switch (displayMedia.length) {
      case 1:
        return (
          <div className="w-full mx-auto">
            <div className="w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/9]">
              {renderImage(displayMedia[0], 0, "", true, "rounded-lg")}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="w-full mx-auto">
            <div className="grid grid-cols-2 gap-1 sm:gap-2 aspect-[2/1] sm:aspect-[2/1] min-h-[120px] sm:min-h-[150px]">
              {renderImage(displayMedia[0], 0, "", false, "rounded-tl-lg rounded-bl-lg")}
              {renderImage(displayMedia[1], 1, "", false, "rounded-tr-lg rounded-br-lg")}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="w-full mx-auto">
            <div className="grid grid-cols-2 gap-1 sm:gap-2 aspect-[4/3] sm:aspect-square min-h-[150px] sm:min-h-[200px]">
              {renderImage(displayMedia[0], 0, "", false, "rounded-tl-lg")}
              {renderImage(displayMedia[1], 1, "", false, "rounded-tr-lg")}
              {renderImageWithOverlay(displayMedia[2], 2, "col-span-2", 1, "rounded-bl-lg rounded-br-lg")}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="w-full mx-auto">
            <div className="grid grid-cols-2 gap-1 sm:gap-2 aspect-[4/3] sm:aspect-square min-h-[150px] sm:min-h-[200px]">
              {renderImage(displayMedia[0], 0, "", false, "rounded-tl-lg")}
              {renderImage(displayMedia[1], 1, "", false, "rounded-tr-lg")}
              {renderImage(displayMedia[2], 2, "", false, "rounded-bl-lg")}
              {renderImage(displayMedia[3], 3, "", false, "rounded-br-lg")}
            </div>
          </div>
        );
      default: {
        const remainingCount = displayMedia.length - 4;
        return (
          <div className="w-full mx-auto">
            <div className="grid grid-cols-2 gap-1 sm:gap-2 aspect-[4/3] sm:aspect-square min-h-[150px] sm:min-h-[200px]">
              {renderImage(displayMedia[0], 0, "", false, "rounded-tl-lg")}
              {renderImage(displayMedia[1], 1, "", false, "rounded-tr-lg")}
              {renderImage(displayMedia[2], 2, "", false, "rounded-bl-lg")}
              {renderImageWithOverlay(displayMedia[3], 3, "", remainingCount, "rounded-br-lg")}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <>
      {/* Image Gallery */}
      <div className="mt-4 w-full">
        {renderImageGallery()}
      </div>
      {isModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2">
            <div className="relative bg-black/95 backdrop-blur-sm rounded-xl w-full h-full max-w-[95vw] max-h-[95vh] overflow-hidden shadow-2xl flex items-center justify-center">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-[10000] p-3 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200"
                aria-label="Close gallery"
              >
                <X size={20} />
              </button>
              {displayMedia.length > 1 && (
                <div className="absolute top-4 left-4 z-[10000] px-3 py-1 rounded-full bg-black/60 text-white text-sm">
                  {activeIndex + 1} / {displayMedia.length}
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
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
                      onLoadedData={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                    />
                  )}
                  {displayMedia.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveIndex(prev => prev > 0 ? prev - 1 : displayMedia.length - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200"
                        aria-label="Previous image"
                      >
                        ←
                      </button>
                      <button
                        onClick={() => setActiveIndex(prev => prev < displayMedia.length - 1 ? prev + 1 : 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-all duration-200"
                        aria-label="Next image"
                      >
                        →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BlogImagery;
