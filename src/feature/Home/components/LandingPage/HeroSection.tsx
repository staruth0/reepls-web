import { motion } from "framer-motion";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { useNavigate } from "react-router-dom";
import { FaGooglePlay } from "react-icons/fa";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [showGlow, setShowGlow] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom easing for smoother animation
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const waveVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const phoneVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const floatingDots = Array.from({ length: 12 }).map((_, i) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDelay = Math.random() * 2;
    const randomSize = Math.random() * 4 + 2;
    const randomMoveX = Math.random() * 20 - 10;
    
    return {
      id: i,
      x: randomX,
      y: randomY,
      delay: randomDelay,
      size: randomSize,
      moveX: randomMoveX,
    };
  });

  // Additional background particles
  const backgroundParticles = Array.from({ length: 20 }).map((_, i) => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomDelay = Math.random() * 3;
    const randomDuration = Math.random() * 4 + 3;
    const randomSize = Math.random() * 3 + 1;
    const randomMoveX = Math.random() * 100 - 50;
    const randomMoveY = Math.random() * 100 - 50;
    
    return {
      id: `particle-${i}`,
      x: randomX,
      y: randomY,
      delay: randomDelay,
      duration: randomDuration,
      size: randomSize,
      moveX: randomMoveX,
      moveY: randomMoveY,
    };
  });

  // Glowing effect on mount and every 10 seconds (like hamburger menu)
  useEffect(() => {
    // Trigger glow immediately on mount
    setShowGlow(true);
    const timeout = setTimeout(() => setShowGlow(false), 2000); // Glow for 2 seconds

    // Set up interval to repeat every 10 seconds
    const interval = setInterval(() => {
      setShowGlow(true);
      setTimeout(() => setShowGlow(false), 2000); // Glow for 2 seconds
    }, 10000); // 10 seconds

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  // Radio waves variants
  const radioWaveVariants = {
    animate: (i: number) => ({
      scale: [1, 2.5, 2.5],
      opacity: [0.6, 0.3, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeOut",
        delay: i * 0.5,
      },
    }),
  };

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-primary-700 relative overflow-hidden">
      {/* Background moving elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary-400 opacity-10"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              x: [0, particle.moveX, 0],
              y: [0, particle.moveY, 0],
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>
      
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px] relative z-10">
        <motion.div
          className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="flex-1 space-y-6 lg:space-y-8 relative">
            {/* Radio Waves behind the title */}
            <div className="absolute -left-8 -top-8 md:-left-12 md:-top-12 w-32 h-32 md:w-48 md:h-48 pointer-events-none">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  custom={i}
                  className="absolute inset-0 rounded-full border-2 border-primary-400"
                  variants={radioWaveVariants}
                  animate="animate"
                  style={{
                    borderColor: showGlow ? 'rgba(126, 240, 56, 0.8)' : 'rgba(87, 192, 22, 0.4)',
                    boxShadow: showGlow ? '0 0 20px rgba(126, 240, 56, 0.5)' : 'none',
                  }}
                />
              ))}
            </div>

            <motion.h1
              className={`text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight relative z-10 transition-all duration-500 ${
                showGlow ? 'drop-shadow-[0_0_12px_rgba(126,240,56,0.6)]' : ''
              }`}
              variants={titleVariants}
              initial="hidden"
              animate="visible"
            >
              Start the Reepl. Amplify Your African Voice.
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-neutral-100 max-w-2xl leading-relaxed"
              variants={textVariants}
              initial="hidden"
              animate="visible"
            >
              Reepls is the dedicated platform where Africa's thought leaders, storytellers, and innovators share, publish, and watch their influence speed.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
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

          {/* Right Content - Waveform with Phone */}
          <motion.div
            className="flex-1 relative max-w-md w-full"
            variants={itemVariants}
          >
            {/* Animated Waveform Background */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={waveVariants}
              animate="animate"
            >
              <svg
                width="100%"
                height="400"
                viewBox="0 0 400 400"
                className="opacity-20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <motion.path
                  d="M 50 200 Q 100 150, 150 200 T 250 200 T 350 200"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#57c016" />
                    <stop offset="100%" stopColor="#7ef038" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Floating Yellow Dots */}
            {floatingDots.map((dot) => (
              <motion.div
                key={dot.id}
                className="absolute bg-secondary-400 rounded-full"
                style={{
                  left: `${dot.x}%`,
                  top: `${dot.y}%`,
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, dot.moveX, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.8, 1],
                }}
                transition={{
                  duration: 4 + dot.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: dot.delay,
                }}
              />
            ))}

            {/* Phone Image */}
            <motion.div
              className="relative z-10"
              variants={phoneVariants}
              animate="animate"
            >
              <img
                src={LandingPageImages.phoneHeroSection}
                alt="Reepls App"
                className="w-full h-auto max-w-[220px] mx-auto drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

