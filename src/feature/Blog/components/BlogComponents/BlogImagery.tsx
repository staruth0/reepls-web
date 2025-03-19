import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { allowedImageTypes } from '../../../../constants';

interface BlogImageryProps {
  media: string[];
}

const BlogImagery: React.FC<BlogImageryProps> = ({ media }) => {
  // Filter out invalid media items (non-strings or empty strings)
  const validMedia = media?.filter(
    (item) => typeof item === 'string' && item.trim() !== ''
  ) || [];

  return (
    <div className="relative w-full max-w-[300px] md:max-w-[500px] lg:max-w-[700px] mx-auto transition-all duration-300">
      {validMedia.length === 0 ? (
        <p className="text-center text-gray-500">No valid media to display</p>
      ) : (
        <Swiper
          modules={[Navigation, Pagination]}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          className="rounded-sm absolute w-full z-0"
        >
          {validMedia.map((mediaItem, index) => {
            // Extract the file extension safely
            const extension = mediaItem.split('.').pop()?.toLowerCase() || '';

            return (
              <SwiperSlide key={index} className="flex justify-center">
                {allowedImageTypes.includes(extension) ? (
                  <img
                    src={mediaItem}
                    alt={`Blog Visual ${index}`}
                    className="w-full h-96 object-cover rounded-sm z-0"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={mediaItem}
                    className="w-full h-96 object-cover rounded-sm z-0"
                    controls
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default BlogImagery;