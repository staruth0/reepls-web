// import React, { useEffect, useRef } from "react";
// import { motion, useAnimation } from "framer-motion";

// interface IconBurstProps { 
//     icon: React.ReactNode; 
//     burstCount?: number; 
//     duration?: number; 
//     size?: number; 
// }

// const IconBurst: React.FC<IconBurstProps> = ({ icon,burstCount = 5,duration = 1}) => {
//   const containerRef = useRef(null);
//   const controls = useAnimation();

//   useEffect(() => {
//     const animate = async () => {
    
//       await controls.start({ scale: 1, opacity: 1 });

      
//       await controls.start({
//         scale: 1.5,
//         opacity: 0,
//         transition: { duration: duration / 2 },
//       });

//       // Create burst icons
//       const burstIcons = Array.from({ length: burstCount }).map((_, index) => {
//         const angle = (360 / burstCount) * index;
//         const distance = 50; 
//         const x = Math.cos((angle * Math.PI) / 180) * distance;
//         const y = Math.sin((angle * Math.PI) / 180) * distance;

//         return (
//           <motion.div
//             key={index}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//             }}
//             initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
//             animate={{
//               x,
//               y,
//               opacity: 0,
//               scale: 0.5,
//               transition: { duration: duration, ease: "easeOut" },
//             }}
//           >
//             {icon}
//           </motion.div>
//         );
//       });

//       // Append burst icons to the container
//       if (containerRef.current) {
//         containerRef?.current?.append(...burstIcons);
//       }
//     };

//     animate();
//   }, [burstCount, duration, controls, icon]);

//   return (
//     <div
//       ref={containerRef}
//       style={{ position: "relative", display: "inline-block" }}
//     >
//       <motion.div animate={controls}>{icon}</motion.div>
//     </div>
//   );
// };

// export default IconBurst;
