import { useNavigate } from "react-router-dom";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { LandingImage } from "./LandingImage";
import { SECTION_CONTENT_CLASS, SECTION_PADDING_Y } from "./sectionLayout";

const CoreFeaturesSection = () => {
  const navigate = useNavigate();

  // Commented out animation variants
  // const containerVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     transition: {
  //       staggerChildren: 0.2,
  //       delayChildren: 0.1,
  //     },
  //   },
  // };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 30 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.6,
  //       ease: "easeOut",
  //     },
  //   },
  // };

  return (
    <section className={`${SECTION_PADDING_Y} bg-primary-50 border-b border-neutral-600`}>
      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex flex-col gap-14 sm:gap-16 md:gap-20 lg:gap-24 items-start min-[900px]:items-center w-full">
          <div className="flex flex-col gap-3 items-center w-full min-[900px]:max-w-[600px] text-center">
            <h2 className="font-semibold leading-tight text-foreground text-2xl sm:text-3xl md:text-3xl lg:text-4xl tracking-[0px]">
              Core Features (The How)
            </h2>
            <p className="font-medium leading-snug text-base sm:text-base md:text-lg text-neutral-100 tracking-[-0.75px]">
              Where Ideas Flow: Structured Content & Diverse Media
            </p>
          </div>

          {/* First feature: full width / left on single col; image column slightly larger than text on 2-col */}
          <div className="flex flex-col min-[900px]:flex-row gap-8 min-[900px]:gap-12 items-stretch min-[900px]:items-center w-full">
            <div className="flex-[1.15] w-full min-w-0 flex justify-start min-[900px]:justify-start order-2 min-[900px]:order-1">
              <LandingImage
                src={LandingPageImages.coreFeaturesImage}
                alt="In-Depth Posts & Podcasts"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3 items-start min-w-0 max-w-[500px] mx-0 min-[900px]:mx-0 order-1 min-[900px]:order-2">
              <p className="font-medium leading-tight text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0px] whitespace-pre-wrap">
                In-Depth Posts & Podcasts:
              </p>
              <div className="flex flex-col font-medium justify-center leading-relaxed text-sm sm:text-base md:text-lg text-neutral-100 tracking-[-0.75px]">
                <p className="leading-relaxed whitespace-pre-wrap">
                  Go beyond the comment thread. Share written articles or launch your voice with integrated audio posts, which we call Podcasts, a format perfect for Africa's mobile-first user.
                </p>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate("/feed")}
                  className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-9 px-5 hover:bg-primary-500 transition-colors"
                >
                  <span className="font-medium text-plain-b text-sm leading-tight text-center whitespace-nowrap">
                    Explore stories
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Streams Section */}
          <div className="flex flex-col min-[900px]:flex-row items-stretch min-[900px]:items-center gap-8 min-[900px]:gap-12 w-full">
            <div className="flex-1 flex flex-col gap-3 items-start max-w-[500px] mx-0 min-[900px]:mx-0 order-1">
              <p className="font-medium leading-tight text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0px] whitespace-pre-wrap">
                Streams (Centralized Publications)
              </p>
              <div className="flex flex-col font-medium justify-center leading-relaxed text-sm sm:text-base md:text-lg text-neutral-100 tracking-[-0.75px]">
                <p className="leading-relaxed whitespace-pre-wrap">
                  Elevate your content. Join or create Streams—centralized hubs where writers and experts collaborate and curate stories around specific topics, driving collective influence and quality.
                </p>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-9 px-5 hover:bg-primary-500 transition-colors"
                >
                  <span className="font-medium text-plain-b text-sm leading-tight text-center whitespace-nowrap">
                    Start a stream
                  </span>
                </button>
              </div>
            </div>
            <div className="flex-[1.15] w-full min-w-0 flex justify-start min-[900px]:justify-end order-2">
              <LandingImage
                src={LandingPageImages.streamsCentralisedPublicationImage}
                alt="Streams - Centralized Publications"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Curate Your Knowledge: image column slightly larger */}
          <div className="flex flex-col min-[900px]:flex-row items-stretch min-[900px]:items-center gap-8 min-[900px]:gap-12 w-full">
            <div className="flex-[1.15] w-full min-w-0 flex justify-start min-[900px]:justify-start order-2 min-[900px]:order-1">
              <LandingImage
                src={LandingPageImages.curatedKnowledgeImage}
                alt="Curate Your Knowledge"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
            <div className="flex-1 flex flex-col gap-3 items-start min-w-0 max-w-[500px] mx-0 min-[900px]:mx-0 order-1 min-[900px]:order-2">
              <p className="font-medium leading-tight text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-[0px] whitespace-pre-wrap">
                Curate Your Knowledge
              </p>
              <div className="flex flex-col font-medium justify-center leading-relaxed text-sm sm:text-base md:text-lg text-neutral-100 tracking-[-0.75px]">
                <p className="leading-relaxed whitespace-pre-wrap">
                  Take control of your reading experience and eliminate digital clutter. You can customize your feed by your preferred topics and save articles for offline reading. This ensures you only consume the authentic insights and narratives that matter most to your interests.
                </p>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-9 px-5 hover:bg-primary-500 transition-colors"
                >
                  <span className="font-medium text-plain-b text-sm leading-tight text-center whitespace-nowrap">
                    Get started
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreFeaturesSection;

