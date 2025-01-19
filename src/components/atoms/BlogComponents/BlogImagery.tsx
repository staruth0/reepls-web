import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BlogImageryProps {
  PostImages: string[];
}

const BlogImagery: React.FC<BlogImageryProps> = ({ PostImages }) => {
  return (
    <div className="relative w-full max-w-[300px] md:max-w-[500px] lg:max-w-[700px] mx-auto z-0 transition-all duration-300  ">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
        className="rounded-sm absolute w-full z-0"
      >
        {PostImages.map((image, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <img
              src={image}
              alt={`Blog Visual ${index}`}
              className="w-full h-96 object-cover rounded-sm  z-0"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogImagery;
