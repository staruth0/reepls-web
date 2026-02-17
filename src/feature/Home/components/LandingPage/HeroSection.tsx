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
      className={`block ${className ?? ""}`}
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
    <section className="pt-16 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-primary-50 border-b border-neutral-600 relative overflow-hidden">
      <div className={`${SECTION_CONTENT_CLASS} relative z-10`}>
        <div className="flex flex-col min-[900px]:flex-row gap-6 min-[900px]:gap-8 items-center min-[900px]:items-center w-full">
          <div className="flex flex-1 flex-col items-center min-[900px]:items-start gap-3 w-full min-w-0 min-[900px]:max-w-[520px] text-center min-[900px]:text-left">
            <h1 className="font-medium leading-tight min-[900px]:leading-[1.18] text-foreground text-2xl sm:text-3xl md:text-4xl lg:text-5xl min-[900px]:text-[57px] tracking-[-0.75px]">
              <span className="block min-[900px]:hidden">
                Start the Reepl. Amplify Your African Voice.
              </span>
              <span className="hidden min-[900px]:block">
                Start the Reepl.<br />
                Amplify Your<br />
                African Voice.
              </span>
            </h1>

            <p className="font-medium leading-snug text-sm sm:text-base md:text-lg lg:text-[20px] text-neutral-100 tracking-[-0.75px]">
              Reepls is the dedicated platform where Africa's thought leaders, storytellers, and innovators share, publish, and watch their influence spread.
            </p>

            {/* Buttons */}
            <div className="flex flex-row gap-3 items-center justify-center min-[900px]:justify-start mt-3 w-full max-w-[420px] min-[900px]:max-w-none">
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-400 cursor-pointer flex-1 flex items-center justify-center rounded-full h-12 sm:h-14 md:h-[64px] px-5 md:px-[20px] hover:bg-primary-500 transition-colors"
              >
                <span className="font-medium text-plain-b text-sm sm:text-base md:text-[18px] leading-[20px] text-center whitespace-nowrap">
                  Get Started
                </span>
              </button>
              <Playstore className="flex-1 h-12 sm:h-14 md:h-[64px]" />
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

