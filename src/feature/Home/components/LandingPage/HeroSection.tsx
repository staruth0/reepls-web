import { useNavigate } from "react-router-dom";

// Figma asset URLs for Google Play button
const imgVector = "https://www.figma.com/api/mcp/asset/a44b66b9-ba27-408f-9b3e-17bad7b8adf0";
const imgVector1 = "https://www.figma.com/api/mcp/asset/83eb8355-7f37-44e4-9fd4-d0a80e7eb000";
const imgVector2 = "https://www.figma.com/api/mcp/asset/29dbfd78-0189-470f-8060-e9cdbe555ea9";
const imgVector3 = "https://www.figma.com/api/mcp/asset/724bf9af-e81a-4885-874c-41bfbf1992be";
const imgVector4 = "https://www.figma.com/api/mcp/asset/13cac21e-d59e-4a02-b927-ce394d8c7545";
const imgVector5 = "https://www.figma.com/api/mcp/asset/f197af99-0135-4cf7-907b-a69a6cef2502";

// Figma asset URLs for phone mockup and wave pattern
const imgRectangle = "https://www.figma.com/api/mcp/asset/b1f72271-1915-4b4e-8b2f-d588f2690279";
const imgWaveTradPattern = "https://www.figma.com/api/mcp/asset/453c3bb4-055d-4ce4-851a-9ff9ae85c412";
const imgIllustrations = "https://www.figma.com/api/mcp/asset/68c705fa-d54e-4da3-a755-5f7de70eddac";

// Google Play Store Button Component
function Playstore({ className }: { className?: string }) {
  return (
    <div className={`${className} relative overflow-hidden rounded-full`}>
      <div className="absolute inset-[22.9%_13.51%_19.86%_33.28%]">
        <div className="absolute inset-[22.9%_42.14%_63.92%_33.48%]">
          <div className="absolute inset-[-7.11%_-1.15%]">
            <img alt="" className="block max-w-none size-full" src={imgVector} />
          </div>
        </div>
        <div className="absolute inset-[44.33%_13.51%_19.86%_33.28%]">
          <img alt="" className="block max-w-none size-full" src={imgVector1} />
        </div>
      </div>
      <div className="absolute inset-[48.78%_76.12%_21.54%_13.6%]">
        <img alt="" className="block max-w-none size-full" src={imgVector2} />
      </div>
      <div className="absolute inset-[39.4%_71.92%_38.72%_20.61%]">
        <img alt="" className="block max-w-none size-full" src={imgVector3} />
      </div>
      <div className="absolute inset-[28.46%_78.93%_27.79%_13.6%]">
        <img alt="" className="block max-w-none size-full" src={imgVector4} />
      </div>
      <div className="absolute inset-[22.21%_76.12%_49.66%_13.6%]">
        <img alt="" className="block max-w-none size-full" src={imgVector5} />
      </div>
    </div>
  );
}

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20 lg:py-24 bg-primary-700 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[100px] relative z-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-4 items-start lg:items-center">
          {/* Left Content - Text and Buttons */}
          <div className="flex flex-1 flex-col items-start gap-3 max-w-[600px]">
            {/* Title - Split into 3 lines as per Figma design */}
            <div className="font-medium leading-[64px] text-[#373737] text-4xl md:text-5xl lg:text-[57px] tracking-[-0.75px]">
              <p className="mb-0">Start the Reepl.</p>
              <p className="mb-0">Amplify Your</p>
              <p>African Voice.</p>
            </div>

            {/* Description */}
            <div className="flex flex-col font-medium justify-center leading-[28px] text-[20px] text-[#737373] tracking-[-0.75px] whitespace-pre-wrap">
              <p className="mb-0">
                {`Reepls is the dedicated platform where Africa's thought leaders, storytellers, and innovators share, publish, and watch `}
              </p>
              <p>their influence spread.</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-3">
              {/* Start a Reepl Button */}
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-[64px] px-[24px] hover:bg-primary-500 transition-colors"
              >
                <span className="font-medium text-[#fefefe] text-[18px] leading-[20px] text-center whitespace-nowrap">
                  Start a Reepl
                </span>
              </button>

              {/* Google Play Store Button */}
              <Playstore className="bg-[#373737] h-[64px] w-[214px] cursor-pointer hover:opacity-90 transition-opacity" />
            </div>
          </div>

          {/* Right Content - Phone Mockup with Wave Pattern */}
          <div className="hidden lg:flex flex-1 gap-2.5 items-center justify-end relative min-h-[520px] w-full lg:w-auto">
            <div className="flex-1 grid grid-cols-[max-content] grid-rows-[max-content] justify-items-start relative w-full max-w-[580px] scale-85 origin-right">
              {/* Wave Pattern */}
              <div className="col-[1] h-[266.621px] ml-0 mt-[37.43%] relative row-[1] w-[664px]">
                <div className="absolute inset-[-3.12%_-1.25%]">
                  <img alt="" className="block max-w-none size-full" src={imgWaveTradPattern} />
                </div>
              </div>

              {/* Phone Mockup */}
              <div className="bg-[#cccccc] border-[5.4px] border-[#868686] border-solid col-[1] h-[770.4px] ml-[293.91px] mt-0 relative rounded-[50.4px] row-[1] w-[341.409px]">
                <div className="h-[770.4px] overflow-hidden relative rounded-[inherit] w-[341.409px]">
                  <div className="absolute bottom-[-5.53%] left-[calc(50%+-1.93px)] top-[-0.39%] translate-x-[-50%] w-[367px]">
                    <img alt="" className="absolute inset-0 max-w-none object-center object-cover pointer-events-none size-full" src={imgRectangle} />
                  </div>
                </div>
              </div>

              {/* Illustrations */}
              <div className="col-[1] h-[150.3px] ml-[249.73px] mt-[511.2px] relative row-[1] w-[114.696px]">
                <img alt="" className="block max-w-none size-full" src={imgIllustrations} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

