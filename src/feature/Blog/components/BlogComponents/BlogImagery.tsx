import React from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MediaItem, MediaType } from '../../../../models/datamodels';

interface BlogImageryProps {
  media: MediaItem[];
}

const BlogImagery: React.FC<BlogImageryProps> = ({ media }) => {
  console.log('Verifying media', media);
  return (
    <div className="relative w-full sm:max-w-[300px] md:max-w-[500px] lg:max-w-[700px] mx-auto transition-all duration-300">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
        className="rounded-sm absolute w-full z-0">
        {media?.map((mediaItem, index) => {
          return (
            <SwiperSlide key={index} className="flex justify-center">
              {mediaItem.type === MediaType.Image ? (
                <img
                  src={mediaItem.url}
                  alt={`Blog Visual ${index}`}
                  className="w-full h-96 object-cover rounded-sm"
                  loading="lazy"
                />
              ) : (
                <video
                  src={mediaItem.url}
                  className="w-full h-96 object-cover rounded-sm"
                  controls
                  muted
                  autoPlay={false}
                  loop
                  playsInline
                  controlsList="nodownload"
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BlogImagery;
