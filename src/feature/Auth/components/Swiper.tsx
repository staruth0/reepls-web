import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LuCircleArrowLeft, LuCircleArrowRight } from "react-icons/lu";
import { Pics } from "../../../assets/images";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import { logoOnDark, logoOnWhite } from "../../../assets/icons";
import useTheme from "../../../hooks/useTheme";

const slides = [
  {
    image: Pics.maleAuth,
    text: t("swiper.slide1.text"),
    description: t("swiper.slide1.desc"),
  },
  {
    image: Pics.femaleAuth,
    text: t("swiper.slide2.text"),
    description: t("swiper.slide2.desc"),
  },
];

function Swiper() {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Functions to handle DOM events
  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleCurrentSlide = (index: number) => {
    setActiveSlide(index);
  };

  const navigate = useNavigate();

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(handleNextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  // Transition variants for the swipe effect
  const swipeVariants = {
    hiddenLeft: { opacity: 0, x: -100 },
    // hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    // exitLeft: { opacity: 0, x: -100 },
    exitRight: { opacity: 0, x: 100 },
  };
const {theme} = useTheme()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-neutral-50 p-4 relative">
      {/* Logo */}
      <div onClick={()=>navigate('/')} className="cursor-pointer absolute top-5 left-5 self-start text-2xl flex gap-2 items-center font-semibold text-plain-a mb-4">
        <img src={`${theme === 'dark' ? logoOnWhite:logoOnDark }`} alt="" className="w-36" />
      
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center w-[80%]">
        
        {/* Image Container */}
        <div className="relative flex justify-center items-center w-full mb-5">
          {/* Navigation Buttons */}
          <div className="absolute flex justify-between w-full px-4 z-10">
            <button
              onClick={handlePrevSlide}
              className="text-primary-200 transition-colors"
            >
              <LuCircleArrowLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNextSlide}
              className="text-primary-200 transition-colors"
            >
              <LuCircleArrowRight className="w-8 h-8" />
            </button>
          </div>

          {/* Image with Swipe Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial="hiddenLeft"
              animate="visible"
              exit="exitRight"
              variants={swipeVariants}
              transition={{ duration: 0.7 }}
              className="relative w-[300px] h-[300px] flex justify-center items-center"
            >
              {/* Background Decorative Elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 border-8 border-yellow-400 rounded-full translate-y-8 -translate-x-10"></div>

              {/* Image */}
              <img
                src={slides[activeSlide].image}
                alt="slide"
                className="w-[18rem] h-[18rem] object-cover rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial="hiddenLeft"
            animate="visible"
            exit="exitRight"
            variants={swipeVariants}
            transition={{ duration: 0.7 }}
            className="text-center mt-6"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-plain-a mb-3">
              {slides[activeSlide].text}
            </h2>
            <p className="text-sm md:text-base text-plain-a max-w-md mx-auto">
              {slides[activeSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`w-16 h-1 rounded-full cursor-pointer ${
                index === activeSlide ? "bg-primary-400" : "bg-primary-600"
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
