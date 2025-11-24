// import { motion } from "framer-motion";
// import { LandingPageImages } from "../../../../assets/images/landingpage";
import { useNavigate } from "react-router-dom";

// Figma asset URL
const imgFrame = "https://www.figma.com/api/mcp/asset/546484fd-8693-4925-aff8-8b134a8355f6";

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
    <section className="py-16 md:py-24 bg-[#f9fff5]">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-[24px]">
          {/* Left Content */}
          <div className="flex flex-col gap-[12px] items-start max-w-[600px] flex-1">
            {/* Title - Split into multiple lines as per Figma design */}
            <div className="font-medium leading-[52px] text-[#373737] text-3xl md:text-4xl lg:text-[45px] tracking-[0px]">
              <p className="mb-0">
                <span className="text-[#373737]">The Reepls Solution:</span>{" "}
              </p>
              <p className="mb-0 text-neutral-500">A centralized ecosystem built</p>
              <p className="mb-0 text-neutral-500">to give your ideas the gravity</p>
              <p className="text-neutral-500">they deserve.</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-3">
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-[40px] px-[24px] hover:bg-primary-500 transition-colors"
              >
                <span className="font-medium text-[#fefefe] text-[14px] leading-[20px] text-center whitespace-nowrap">
                  Start a Reepl
                </span>
              </button>
              
              <button
                onClick={() => navigate("/feed")}
                className="border border-[#79747e] border-solid cursor-pointer rounded-full h-[40px] px-[24px] hover:bg-neutral-100 transition-colors"
              >
                <span className="font-medium text-[#373737] text-[14px] leading-[20px] text-center whitespace-nowrap">
                  Explore Stories
                </span>
              </button>
            </div>
          </div>

          {/* Right Image - Using Figma asset */}
          <div className="flex-1 h-[400px] md:h-[500px] lg:h-[738px] relative w-full lg:w-auto">
            <img 
              alt="Reepls Ecosystem" 
              className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" 
              src={imgFrame} 
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

