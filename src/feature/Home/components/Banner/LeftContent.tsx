import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../hooks/useUser";

const LeftContent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { authUser } = useUser();

  // Animation variants for text and buttons
  const textVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Heading */}
      <motion.h1
        className="text-3xl md:text-6xl font-bold text-plain-a text-center md:text-left"
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        {t("Drop your thoughts and let them")}{" "}
        <span className="text-primary-400 font-light">reepl</span>
      </motion.h1>

      {/* Description */}
      <motion.p
        className="text-base md:text-lg text-neutral-100 text-center md:text-left"
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
      >
        {t("Explore, write, and share insightful stories and heartfelt reflections. Stay informed, engaged, and part of a thoughtful community.")}
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex justify-center md:justify-start gap-4"
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 1 }}
      >
        <motion.button
          className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-primary-400 text-white hover:bg-primary-300 transition-colors text-sm md:text-base"
          onClick={() => navigate(`${authUser?.id ? "posts/create" : "/auth"}`)}
        >
          {t("Start a Reepl")}
        </motion.button>

        <motion.button
          className="px-4 py-2 md:px-6 md:py-3 rounded-full border border-plain-a text-plain-a hover:text-primary-400 hover:border-primary-400 transition-colors text-sm md:text-base"
          onClick={() => navigate(`${authUser?.id ? "feed" : "/auth"}`)}
        >
          {t("Explore Stories")}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LeftContent;