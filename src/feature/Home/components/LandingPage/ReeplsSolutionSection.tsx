import { useNavigate } from "react-router-dom";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { LandingImage } from "./LandingImage";
import { SECTION_CONTENT_CLASS, SECTION_PADDING_Y } from "./sectionLayout";

const ReeplsSolutionSection = () => {
  const navigate = useNavigate();

  // Commented out animation variants
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.2,
  //       delayChildren: 0.1,
  //     },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { opacity: 0, x: -40 },
  //   visible: {
  //     opacity: 1,
  //     x: 0,
  //     transition: {
  //       duration: 0.8,
  //       ease: "easeOut",
  //     },
  //   },
  // };

  // const imageVariants = {
  //   hidden: { opacity: 0, x: 40, scale: 0.9 },
  //   visible: {
  //     opacity: 1,
  //     x: 0,
  //     scale: 1,
  //     transition: {
  //       duration: 1,
  //       ease: "easeOut",
  //     },
  //   },
  // };

  // const glowVariants = {
  //   animate: {
  //     opacity: [0.3, 0.6, 0.3],
  //     scale: [1, 1.1, 1],
  //     transition: {
  //       duration: 3,
  //       repeat: Infinity,
  //       ease: "easeInOut",
  //     },
  //   },
  // };

  return (
    <section className={`${SECTION_PADDING_Y} bg-background`}>
      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex flex-col min-[900px]:flex-row items-stretch min-[900px]:items-center gap-8 min-[900px]:gap-12 w-full">
          <div className="flex flex-col gap-3 items-center min-[900px]:items-start min-w-0 max-w-[600px] mx-auto min-[900px]:mx-0 flex-1 w-full text-center min-[900px]:text-left order-1 min-[900px]:order-1">
            <div className="space-y-2">
              <h2 className="font-medium leading-tight text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-[45px] tracking-[0px]">
                The Reepls Solution
              </h2>
              <p className="font-medium leading-tight text-neutral-100 text-2xl sm:text-3xl md:text-4xl lg:text-[45px] tracking-[0px]">
                A centralized ecosystem built to give your ideas the gravity they deserve.
              </p>
            </div>

            <div className="flex flex-row flex-wrap gap-3 items-center justify-center min-[900px]:justify-start mt-2">
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-10 md:h-[44px] px-6 md:px-[24px] hover:bg-primary-500 transition-colors"
              >
                <span className="font-medium text-plain-b text-sm md:text-[14px] leading-[20px] text-center whitespace-nowrap">
                  Start a Reepl
                </span>
              </button>
              <button
                onClick={() => navigate("/feed")}
                className="border border-neutral-50 cursor-pointer flex items-center justify-center rounded-full h-10 md:h-[44px] px-6 md:px-[24px] hover:bg-neutral-700/20 transition-colors"
              >
                <span className="font-medium text-foreground text-sm md:text-[14px] leading-[20px] text-center whitespace-nowrap">
                  Explore
                </span>
              </button>
            </div>
          </div>
          <div className="flex-[1.15] w-full min-w-0 flex items-center justify-start min-[900px]:justify-center order-2 min-[900px]:order-2">
            <LandingImage
              src={LandingPageImages.manWithLaptopGirlWithPhone}
              alt="Reepls Ecosystem - centralized space for your ideas"
              className="w-full h-auto object-contain object-left min-[900px]:object-center"
            />
          </div>

          {/* Commented out - Old implementation */}
          {/* <motion.div className="flex-1 space-y-6" variants={itemVariants}>
            <motion.h2
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground"
              variants={itemVariants}
            >
              The Reepls Solution: A centralized ecosystem built to give your ideas the gravity they deserve.
            </motion.h2>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <motion.button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 bg-primary-400 text-white font-semibold rounded-full hover:bg-primary-500 transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Reepl
              </motion.button>
              
              <motion.button
                onClick={() => navigate("/feed")}
                className="px-8 py-4 bg-white text-foreground font-semibold rounded-full hover:bg-neutral-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Stories
              </motion.button>
            </motion.div>
          </motion.div> */}

          {/* <motion.div
            className="flex-1 max-w-xl w-full relative"
            variants={imageVariants}
          >
            <motion.div
              className="absolute inset-0 bg-primary-400 rounded-full blur-3xl opacity-20"
              variants={glowVariants}
              animate="animate"
            />
            
            <img
              src={LandingPageImages.manWithLaptopGirlWithPhone}
              alt="Reepls Ecosystem"
              className="relative z-10 w-full h-auto max-w-[500px] mx-auto"
            />
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};

export default ReeplsSolutionSection;

