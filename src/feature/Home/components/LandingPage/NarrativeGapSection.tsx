import { useNavigate } from "react-router-dom";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { LandingImage } from "./LandingImage";
import { SECTION_CONTENT_CLASS, SECTION_PADDING_Y } from "./sectionLayout";

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
    <section className={`${SECTION_PADDING_Y} bg-background`}>
      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex flex-col items-center gap-4 md:gap-6 py-6 sm:py-8 md:py-12 lg:py-16">
          <div className="flex flex-col items-center gap-3 md:gap-4 max-w-[800px] w-full">
            <h2 className="font-medium leading-tight text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl min-[900px]:text-[45px] text-center tracking-[0px]">
              The Narrative Gap: From Consumers to Creators
            </h2>
            <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed text-neutral-100 text-center tracking-[-0.75px]">
              Africa has a rapidly growing digital landscape, with over 400 million social media users. Yet, the space for high-quality, in-depth African-centric content and long-form thought leadership remains fragmented across global platforms not built for our context.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-10 md:h-[40px] px-6 md:px-[24px] hover:bg-primary-500 transition-colors mt-2"
            >
              <span className="font-medium text-plain-b text-sm md:text-[14px] leading-[20px] text-center whitespace-nowrap">
                Learn More
              </span>
            </button>
          </div>

          <div className="w-full mt-6 sm:mt-8 md:mt-10 flex items-center justify-start overflow-hidden">
            <LandingImage
              src={LandingPageImages.map}
              alt="The Narrative Gap - From Consumers to Creators"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NarrativeGapSection;

