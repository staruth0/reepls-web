import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCircleArrowLeft, LuCircleArrowRight } from 'react-icons/lu';
import { slides } from '../../../data';
import '../styles/swiper.scss';

function Swiper() {
  // states
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const { t } = useTranslation();

  // functions to handle DOM EVENTS
  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleCurrentSlide = (index: number) => {
    setActiveSlide(index);
  };

  // useEffects
  useEffect(() => {
    const interval = setInterval(handleNextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  const transitionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="swiper__welcome">
      <div className="swiper__logo">REEPLS</div>
      <div className='flex flex-col'>
        <div className="swiper__image__container">
          <div className="swiper__buttons">
            <div className="swiper__button" onClick={handlePrevSlide}>
              <LuCircleArrowLeft className="size-6 transition-all cursor-pointer duration-300 hover:text-primary-400" />
            </div>
            <div className="swiper__button" onClick={handleNextSlide}>
              <LuCircleArrowRight className="size-6 transition-all cursor-pointer duration-300 hover:text-primary-400" />
            </div>
          </div>

          <div className="swiper__image__wrapper"></div>
        </div>

        <motion.div
          key={activeSlide}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={transitionVariants}
          transition={{ duration: 0.9 }}
          className="content"
        >
          <div className="swiper__text">
            <h2>{t(slides[activeSlide].text)}</h2>
            <p>{t(slides[activeSlide].description)}</p>
          </div>
        </motion.div>

        <div className="swiper__indicators">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`swiper__indicator ${
                index === activeSlide ? "active" : ""
              }`}
              onClick={() => handleCurrentSlide(index)}
              animate={{
                scale: index === activeSlide ? 1.1 : 1,
                opacity: index === activeSlide ? 1 : 0.6,
              }}
              transition={{ duration: 0.7 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Swiper;
