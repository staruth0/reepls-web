import { motion } from "framer-motion";

const ProblemSection = () => {
  const textVariants = {
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

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px]">
        <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-400 text-center"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          The Problem: Your stories are scattered. Your voice is consumed, not published.
        </motion.h2>
      </div>
    </section>
  );
};

export default ProblemSection;

