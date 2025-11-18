import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { favicon } from "../../../../assets/icons";

const LandingPageFooter = () => {
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
    hidden: { opacity: 0, y: 20 },
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
    <footer className="bg-neutral-50 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px]">
        <motion.div
          className="flex flex-col md:flex-row justify-between gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Left - Logo */}
          <motion.div
            className="flex items-center gap-2"
            variants={itemVariants}
          >
            <img
              src={favicon}
              alt="Reepls Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-white">Reepls</span>
          </motion.div>

          {/* Center - Navigation Links */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
            variants={itemVariants}
          >
            <Link
              to="/feed"
              className="text-white hover:text-primary-400 transition-colors"
            >
              Get the app
            </Link>
            <Link
              to="/Terms&Policies"
              className="text-white hover:text-primary-400 transition-colors"
            >
              Help center
            </Link>
            <button
              onClick={() => window.open('https://donations-ashy.vercel.app/', '_blank')}
              className="text-white hover:text-primary-400 transition-colors cursor-pointer"
            >
              Donate to Reepls
            </button>
          </motion.div>

          {/* Right - Social Media Icons */}
          <motion.div
            className="flex items-center gap-4 justify-center md:justify-end"
            variants={itemVariants}
          >
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary-400 transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram className="text-2xl" />
            </motion.a>
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary-400 transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaFacebook className="text-2xl" />
            </motion.a>
            <motion.a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-primary-400 transition-colors"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaYoutube className="text-2xl" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-neutral-400"
          variants={containerVariants}
        >
          <motion.p
            className="text-sm text-neutral-200"
            variants={itemVariants}
          >
            Reepls 1.0. Copyright 2023. All rights reserved.
          </motion.p>

          <motion.div
            className="text-sm text-neutral-200 text-center md:text-right"
            variants={itemVariants}
          >
            <p>122 Innovation Drive, Suite 500</p>
            <p>San Francisco, CA 94107</p>
            <p>Customer Support: (800) 555-1213</p>
            <p>Email: info@reepls.com</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;

