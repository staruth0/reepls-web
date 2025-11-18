import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CurateKnowledgeSection = () => {
  const navigate = useNavigate();

  const topics = [
    "education",
    "tech",
    "art",
    "history",
    "business",
    "agriculture",
    "productivity",
    "science",
    "health",
    "politics",
    "data",
    "entrepreneurship",
    "relationship",
    "international affairs",
    "marketing",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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

  const tagVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
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
          {/* Left - Tag Cloud */}
          <motion.div
            className="max-w-lg w-full relative h-[300px] md:h-[350px] lg:h-[400px]"
            variants={imageVariants}
          >
            <div className="relative w-full h-full">
              {topics.map((topic, index) => {
                const isEven = index % 2 === 0;
                // Better distribution - keep tags more centered, not too far right
                // On mobile, keep tags more centered
                const x = 5 + ((index * 29) % 75); // Start at 5%, max at 80% (more centered on mobile)
                const y = 5 + ((index * 27) % 85); // Start at 5%, max at 90%
                
                return (
                  <motion.div
                    key={topic}
                    custom={index}
                    className={`absolute px-3 py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 rounded-full text-xs md:text-sm lg:text-base font-medium ${
                      isEven
                        ? "bg-white text-foreground"
                        : "bg-foreground text-white"
                    }`}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                    }}
                    variants={tagVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    animate={{
                      y: [0, -10, 0],
                      transition: {
                        duration: 2 + index * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.1,
                      },
                    }}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                  >
                    {topic}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div className="flex-1 space-y-4 md:space-y-6 w-full" variants={itemVariants}>
            {/* Notification-like element */}
            <motion.div
              className="bg-white rounded-lg p-3 md:p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-xs md:text-sm text-foreground">From OnTheGround by Tanbe Loaly</span>
              <motion.button
                className="px-2.5 py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 bg-primary-400 text-white text-xs md:text-sm font-semibold rounded-full hover:bg-primary-500 transition-colors whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </motion.div>

            <motion.h3
              className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground"
              variants={itemVariants}
            >
              Curate Your Knowledge
            </motion.h3>
            
            <motion.p
              className="text-base md:text-lg lg:text-xl text-neutral-100 leading-relaxed"
              variants={itemVariants}
            >
              Take control of your reading experience and eliminate digital clutter. You can customize your feed by your preferred topics and save articles for offline reading. This ensures you only consume the authentic insights and narratives that matter most to your interests.
            </motion.p>

            <motion.div variants={itemVariants} className="flex justify-center md:justify-start">
              <motion.button
                onClick={() => navigate("/auth")}
                className="px-5 py-2.5 md:px-6 md:py-3 lg:px-8 lg:py-4 bg-white text-foreground text-xs md:text-sm lg:text-base font-semibold rounded-full hover:bg-neutral-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CurateKnowledgeSection;

