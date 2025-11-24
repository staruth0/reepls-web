// import { motion } from "framer-motion";

// Figma asset URLs
const imgVector = "https://www.figma.com/api/mcp/asset/714b0c3c-e93a-44a2-9cc1-e9b02b1ab54e";
const imgVector1 = "https://www.figma.com/api/mcp/asset/e314eec6-51ea-496b-b527-c543283cb90e";
const imgGroup = "https://www.figma.com/api/mcp/asset/6f81ccdb-d74f-4a8b-b351-30c4a19b779f";
const imgVector2 = "https://www.figma.com/api/mcp/asset/2d5755d9-5890-4a29-8f8d-d421fcb8aaab";
const imgVector3 = "https://www.figma.com/api/mcp/asset/be4b29c0-6387-4f92-96e1-5ed12ee32d7a";

const ProblemSection = () => {
  // Commented out animation variants
  // const textVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.8,
  //       ease: "easeOut",
  //     },
  //   },
  // };

  return (
    <section className="py-16 md:py-24 bg-[#373737] relative overflow-hidden min-h-[400px]">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px] relative h-full">
        {/* Background decorative elements - Hidden on mobile, visible on larger screens */}
        <div className="hidden lg:block absolute top-[35.78%] right-[1.46%] bottom-[23.37%] left-[91.96%] opacity-30">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(134, 134, 134, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" src={imgVector} />
          </div>
        </div>
        <div className="hidden lg:block absolute top-[59.91%] right-[82.43%] bottom-[15.09%] left-[13.54%] opacity-30">
          <div className="absolute inset-0" style={{ "--fill-0": "rgba(134, 134, 134, 1)" } as React.CSSProperties}>
            <img alt="" className="block max-w-none size-full" src={imgVector1} />
          </div>
        </div>
        <div className="hidden lg:flex absolute top-[48.71%] right-[10.56%] bottom-[-27.69%] left-[76.71%] items-center justify-center opacity-20">
          <div className="flex-none h-[134.031px] rotate-[45.391deg] w-[125.181px]">
            <div className="relative size-full">
              <img alt="" className="block max-w-none size-full" src={imgGroup} />
            </div>
          </div>
        </div>
        <div className="hidden lg:flex absolute top-[-12.93%] right-[86.46%] bottom-[12.88%] left-[0.76%] items-center justify-center opacity-20">
          <div className="flex-none h-[205.06px] rotate-[335.953deg] w-[110.06px]">
            <div className="relative size-full">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(134, 134, 134, 1)" } as React.CSSProperties}>
                <img alt="" className="block max-w-none size-full" src={imgVector2} />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex absolute top-[15.1%] right-[35.57%] bottom-[3.33%] left-[48.28%] items-center justify-center opacity-20">
          <div className="flex-none h-[205.06px] rotate-[63.819deg] w-[110.06px]">
            <div className="relative size-full">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(134, 134, 134, 1)" } as React.CSSProperties}>
                <img alt="" className="block max-w-none size-full" src={imgVector3} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-[12px] items-center relative z-10 py-16">
          <div className="font-medium leading-[52px] text-3xl md:text-4xl lg:text-[45px] text-center tracking-[0px]">
            <p className="mb-0">
              <span className="text-[#57c016]">The Problem:</span>{" "}
              <span className="text-[#868686]">Your stories are scattered.</span>
            </p>
            <p className="text-[#868686]">Your voice is consumed, not published.</p>
          </div>
        </div>

        {/* Commented out - Old implementation */}
        {/* <motion.h2
          className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary-400 text-center"
          variants={textVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          The Problem: Your stories are scattered. Your voice is consumed, not published.
        </motion.h2> */}
      </div>
    </section>
  );
};

export default ProblemSection;

