import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaGooglePlay } from "react-icons/fa";

const FinalCTASection = () => {
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const placeholderVariants = {
    hidden: { opacity: 0, scale: 0.9 },
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
    <section className="py-16 md:py-24 bg-primary-700">
      <div className="max-w-5xl mx-auto px-5 md:px-16 lg:px-[100px]">
        <motion.div
          className="flex flex-col items-center gap-12 lg:gap-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left Content */}
          <motion.div className="flex-1 space-y-6" variants={itemVariants}>
            <motion.h2
              className="text-xl md:text-2xl text-center lg:text-3xl font-bold text-foreground leading-tight"
              variants={itemVariants}
            >
              Reepls was built to be the online  space that feels original- made for Africa, made for you
            </motion.h2>
            
            <motion.p
              className="text-lg md:text-xl text-center text-neutral-100 leading-relaxed"
              variants={itemVariants}
            >
              The dedicated cross-platform space (web and mobile) built for everyday Africans to authentically share their personal truths, ensuring every story is published and heard.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
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
                className="px-8 py-4 bg-foreground text-white font-semibold rounded-full flex items-center gap-3 hover:bg-neutral-50 hover:text-foreground transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaGooglePlay className="text-2xl" />
                <span>GET IT ON Google Play</span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Video Placeholder */}
          <motion.div
            className="w-full max-w-4xl aspect-video bg-neutral-300 rounded-lg flex items-center justify-center"
            variants={placeholderVariants}
          >
            <span className="text-neutral-100 text-lg">Video Placeholder</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;

