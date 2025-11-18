import { motion } from "framer-motion";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { useNavigate } from "react-router-dom";

const ReeplsSolutionSection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 40, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const glowVariants = {
    animate: {
      opacity: [0.3, 0.6, 0.3],
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-primary-700">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px]">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left Content */}
          <motion.div className="flex-1 space-y-6" variants={itemVariants}>
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
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="flex-1 max-w-xl w-full relative"
            variants={imageVariants}
          >
            {/* Glowing effect */}
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReeplsSolutionSection;

