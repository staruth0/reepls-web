import { motion } from "framer-motion";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { useNavigate } from "react-router-dom";

const StreamsSection = () => {
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
    hidden: { opacity: 0, x: 40, scale: 0.95 },
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

  const phoneFloatVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-primary-700">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px]">
        <motion.div
          className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left Image */}
          <motion.div
            className="flex-1 max-w-md w-full"
            variants={imageVariants}
          >
            <motion.div
              variants={phoneFloatVariants}
              animate="animate"
            >
              <img
                src={LandingPageImages.streamsCentralisedPublicationImage}
                alt="Streams Centralized Publications"
                className="w-full h-auto max-w-[550px] mx-auto drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div className="flex-1 space-y-6" variants={itemVariants}>
            <motion.h3
              className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground"
              variants={itemVariants}
            >
              Streams (Centralized Publications)
            </motion.h3>
            
            <motion.p
              className="text-lg md:text-xl text-neutral-100 leading-relaxed"
              variants={itemVariants}
            >
              Elevate your content. Join or create Streams—centralized hubs where writers and experts collaborate and curate stories around specific topics, driving collective influence and quality.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 bg-primary-400 text-white font-semibold rounded-full hover:bg-primary-500 transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Stream
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default StreamsSection;

