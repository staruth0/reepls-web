import { useNavigate } from "react-router-dom";
import { LandingImage } from "./LandingImage";
import { SECTION_CONTENT_CLASS, SECTION_PADDING_Y } from "./sectionLayout";
import { LandingPageImages } from "../../../../assets/images/landingpage";

// Hero image: only this file (src/assets/images/landingpage/phone-herosection.png)
import heroImage from "../../../../assets/images/landingpage/phone-herosection.png";

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


const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className={`${SECTION_PADDING_Y} bg-background border-b border-neutral-600 relative overflow-hidden`}>
      <div className={`${SECTION_CONTENT_CLASS} relative z-10`}>
        <div className="flex flex-col min-[900px]:flex-row gap-6 min-[900px]:gap-8 items-start min-[900px]:items-center w-full">
          <div className="flex flex-1 flex-col items-start gap-3 w-full min-w-0 min-[900px]:max-w-[520px]">
            <div className="font-medium leading-tight text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl min-[900px]:text-[57px] tracking-[-0.75px]">
              <p className="mb-0">Start the Reepl.</p>
              <p className="mb-0">Amplify Your</p>
              <p>African Voice.</p>
            </div>

            <div className="flex flex-col font-medium justify-center leading-snug text-sm sm:text-base md:text-lg lg:text-[20px] text-neutral-100 tracking-[-0.75px] whitespace-pre-wrap">
              <p className="mb-0">
                {`Reepls is the dedicated platform where Africa's thought leaders, storytellers, and innovators share, publish, and watch `}
              </p>
              <p>their influence spread.</p>
            </div>

            {/* Buttons */}
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

          <div className="flex flex-[1.15] items-center justify-start min-[900px]:justify-end w-full min-w-0 mt-6 min-[900px]:mt-0">
            <LandingImage
              src={heroImage}
              alt="Reepls on mobile"
              className="w-full h-auto object-contain object-left min-[900px]:object-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

