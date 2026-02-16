import { useNavigate } from "react-router-dom";
import { LandingPageImages } from "../../../../assets/images/landingpage";
import { LandingImage } from "./LandingImage";
import { SECTION_CONTENT_CLASS, SECTION_PADDING_Y } from "./sectionLayout";

const PLAY_STORE_URL = "https://play.google.com/store/apps";

function Playstore({ className }: { className?: string }) {
  return (
    <a
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block ${className ?? ""}`}
      aria-label="Get Reepls on Google Play"
    >
      <LandingImage
        src={LandingPageImages.playstore}
        alt="Get it on Google Play"
        className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
      />
    </a>
  );
}

const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className={`${SECTION_PADDING_Y} bg-background`}>
      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-[48px] items-center">
          <div className="flex flex-col gap-3 items-center max-w-[600px] text-center">
            <h2 className="font-medium leading-tight text-foreground text-xl sm:text-2xl md:text-3xl lg:text-4xl min-[900px]:text-[45px] tracking-[0px]">
              Reepls was built to be the online space that feels original—made for Africa, made for you
            </h2>
            <p className="font-medium text-sm sm:text-base md:text-lg lg:text-[20px] leading-relaxed text-neutral-100 tracking-[-0.75px]">
              The dedicated cross-platform space (web and mobile) built for everyday Africans to authentically share their personal truths, ensuring every story is published and heard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-3">
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-12 sm:h-14 md:h-[64px] px-6 md:px-[24px] hover:bg-primary-500 transition-colors w-full sm:w-auto"
              >
                <span className="font-medium text-plain-b text-sm sm:text-base md:text-[18px] leading-[20px] text-center whitespace-nowrap">
                  Get Started
                </span>
              </button>
              <Playstore className="h-12 sm:h-14 md:h-[64px] w-[180px] sm:w-[200px] md:w-[214px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
