import { motion } from "framer-motion";
import LeftContent from "./LeftContent";

const Banner = () => {
 

  const imageVariants = {
    hidden: { opacity: 0, x: 200, rotate: 20 },
    visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <div className="banner bg-neutral-700 py-20 px-5 rounded-3xl mx-5 md:mx-20 my-5">
      <div className="">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10">
          <motion.div
            className="flex-1"
          >
            <LeftContent />
          </motion.div>

          <motion.div
            className="flex-1 max-w-[450px]"
            initial="hidden"
            animate="visible"
            variants={imageVariants}
            transition={{ delay: 0.4 }}
          >
            <motion.img
              src="/src/assets/images/HEROIMAGE.png"
              alt="Hero Image"
              className="rounded-lg w-full h-auto"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner;