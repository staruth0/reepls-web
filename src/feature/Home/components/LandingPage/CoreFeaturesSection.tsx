import { motion } from "framer-motion";

const CoreFeaturesSection = () => {
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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 md:py-24 bg-primary-700">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px]">
        <motion.div
          className="text-center space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground"
            variants={itemVariants}
          >
            Core Features (The How)
          </motion.h2>
          
          <motion.p
            className="text-lg md:text-xl text-neutral-100 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Where Ideas Flow: Structured Content & Diverse Media
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;

