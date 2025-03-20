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
  return (
    <div className="relative w-full max-w-[300px] md:max-w-[500px] lg:max-w-[700px] mx-auto transition-all duration-300  ">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
        className="rounded-sm absolute w-full z-0">
        {media?.map((mediaItem, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            {allowedImageTypes.includes(mediaItem.split('.').pop()!) ? (
              <img
                src={mediaItem}
                alt={`Blog Visual ${index}`}
                className="w-full h-96 object-cover rounded-sm  z-0"
                loading="lazy"
              />
            ) : (
              <video src={mediaItem} className="w-full h-96 object-cover rounded-sm  z-0" />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogImagery;
