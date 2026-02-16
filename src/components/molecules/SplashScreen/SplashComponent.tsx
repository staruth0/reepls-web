import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import { Pics } from '../../../assets/images';

interface SplashComponentProps {
  text?: string;
}

const SplashComponent: React.FC<SplashComponentProps> = ({ text }) => {
  // Animation variants for the logo
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  // Animation variants for the text
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut', delay: 0.3 }, // Slight delay for stagger
    },
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      {/* Animated Logo */}
      <motion.img
        src={Pics.Logo}
        alt="Logo"
        className="w-24 h-24"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Animated Text */}
      {text && (
        <motion.p
          className="mt-4 text-lg text-neutral-50"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default SplashComponent;