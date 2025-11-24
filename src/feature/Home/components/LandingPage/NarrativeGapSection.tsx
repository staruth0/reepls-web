// import { motion } from "framer-motion";
// import { LandingPageImages } from "../../../../assets/images/landingpage";
import { useNavigate } from "react-router-dom";

// Figma asset URLs
const imgGroup = "https://www.figma.com/api/mcp/asset/88050457-340e-4f16-98e7-dcda30a959cd";
const imgVector = "https://www.figma.com/api/mcp/asset/53772611-0a11-43a0-8d55-1bbf1ac886d6";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/ceb103a1-5184-4f44-ad0e-df539c6ed186";
const imgGroup2 = "https://www.figma.com/api/mcp/asset/ee2586f7-5bb7-412b-82dd-8a0204bca1ff";

const NarrativeGapSection = () => {
  const navigate = useNavigate();

  // Commented out animation variants
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.3,
  //       delayChildren: 0.2,
  //     },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 40 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.8,
  //       ease: "easeOut",
  //     },
  //   },
  // };

  // const mapVariants = {
  //   hidden: { opacity: 0, scale: 0.8 },
  //   visible: {
  //     opacity: 1,
  //     scale: 1,
  //     transition: {
  //       duration: 1,
  //       ease: "easeOut",
  //     },
  //   },
  // };

  return (
    <section className="py-16 md:py-24 bg-[#f9fff5]">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[80px]">
        <div className="flex flex-col items-center gap-[10px] py-[64px]">
          {/* Top Content */}
          <div className="flex flex-col items-center gap-[12px]">
            {/* Title - Split into 2 lines as per Figma design */}
            <div className="font-medium leading-[52px] text-[#373737] text-3xl md:text-4xl lg:text-[45px] text-center tracking-[0px]">
              <p className="mb-0">The Narrative Gap:</p>
              <p>From Consumers to Creators</p>
            </div>
            
            {/* Description */}
            <div className="flex flex-col font-medium justify-center leading-[28px] text-[20px] text-[#737373] text-center tracking-[-0.75px] max-w-4xl">
              <p className="leading-[28px] whitespace-pre-wrap">
                Africa has a rapidly growing digital landscape, with over 400 million social media users. Yet, the space for high-quality, in-depth African-centric content and long-form thought leadership remains fragmented across global platforms not built for our context.
              </p>
            </div>

            {/* Button */}
            <div className="mt-3">
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-[40px] px-[24px] hover:bg-primary-500 transition-colors"
              >
                <span className="font-medium text-[#fefefe] text-[14px] leading-[20px] text-center whitespace-nowrap">
                  Try Reepls
                </span>
              </button>
            </div>
          </div>

          {/* Map Image - Using Figma assets */}
          <div className="h-[300px] md:h-[400px] lg:h-[510.2px] overflow-hidden relative w-full max-w-[1067px] mt-10">
            <div className="absolute bottom-0 left-[-0.08%] right-0 top-0">
              <img alt="" className="block max-w-none size-full" src={imgGroup} />
            </div>
            <div className="absolute inset-[72.29%_38.99%_20.5%_59.06%]">
              <div className="absolute inset-0" style={{ "--fill-0": "rgba(255, 205, 41, 1)" } as React.CSSProperties}>
                <img alt="" className="block max-w-none size-full" src={imgVector} />
              </div>
            </div>
            <div className="absolute contents inset-[41.98%_37%_10.93%_41.59%]">
              <div 
                className="absolute inset-[26.78%_17.35%_15.29%_42.62%]" 
                style={{ 
                  maskImage: `url('${imgGroup1}')`,
                  WebkitMaskImage: `url('${imgGroup1}')`,
                  maskRepeat: 'no-repeat',
                  WebkitMaskRepeat: 'no-repeat',
                  maskPosition: '-10.977px 77.581px',
                  WebkitMaskPosition: '-10.977px 77.581px',
                  maskSize: '228.369px 240.245px',
                  WebkitMaskSize: '228.369px 240.245px'
                } as React.CSSProperties}
              >
                <img alt="" className="block max-w-none size-full" src={imgGroup2} />
              </div>
            </div>
          </div>

          {/* Commented out - Old Map Image */}
          {/* <motion.div
            className="flex-1 max-w-3xl w-full"
            variants={mapVariants}
          >
            <img
              src={LandingPageImages.map}
              alt="Africa Map"
              className="w-full h-auto max-w-[700px] mx-auto"
            />
          </motion.div> */}
        </div>
      </div>
    </section>
  );
};

export default NarrativeGapSection;

