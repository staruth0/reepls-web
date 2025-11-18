import { motion } from "framer-motion";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { useNavigate } from "react-router-dom";

const NarrativeGapSection = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-primary-800">
      <div className="max-w-5xl mx-auto px-5 md:px-16 lg:px-[100px]">
        <motion.div
          className="flex flex-col  items-center gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Top Content */}
          <motion.div className="flex-1  flex flex-col  items-center space-y-6" variants={itemVariants}>
            <motion.h2
              className="text-2xl md:text-2xl lg:text-4xl font-bold text-foreground text-center"
              variants={itemVariants}
            >
              The Narrative Gap: From Consumers to Creators
            </motion.h2>
            
            <motion.p
              className="text-md md:text-lg text-neutral-100 leading-relaxed text-center"
              variants={itemVariants}
            >
              Africa has a rapidly growing digital landscape, with over 400 million social media users. Yet, the space for high-quality, in-depth African-centric content and long-form thought leadership remains fragmented across global platforms not built for our context.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.button
                onClick={() => navigate("/auth")}
                className="px-8 py-4 bg-primary-400 text-white font-semibold rounded-full hover:bg-primary-500 transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Try Reepls
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Map Image */}
          <motion.div
            className="flex-1 max-w-3xl w-full"
            variants={mapVariants}
          >
            <img
              src={LandingPageImages.map}
              alt="Africa Map"
              className="w-full h-auto max-w-[700px] mx-auto"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NarrativeGapSection;

