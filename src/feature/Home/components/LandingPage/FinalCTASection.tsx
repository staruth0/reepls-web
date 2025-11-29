import { useNavigate } from "react-router-dom";

// Figma asset URLs for Google Play button
const imgVector = "https://www.figma.com/api/mcp/asset/812c72f4-96ea-41d9-b95a-b4cfc8372975";
const imgVector1 = "https://www.figma.com/api/mcp/asset/4f85d33d-b833-449f-baca-27d236b4b7fa";
const imgVector2 = "https://www.figma.com/api/mcp/asset/951ceb77-0fbb-47d6-8069-9791c65403e0";
const imgVector3 = "https://www.figma.com/api/mcp/asset/4e1fb585-9102-4b9b-adef-e3a67801c660";
const imgVector4 = "https://www.figma.com/api/mcp/asset/cedb4486-3580-48b5-8472-b08a2eccf800";
const imgVector5 = "https://www.figma.com/api/mcp/asset/2158dedd-637d-49f7-996b-3d2305b53b4b";

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

const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 bg-[#f9fff5]">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[80px]">
        <div className="flex flex-col gap-12 lg:gap-[48px] items-center">
          {/* Text and Buttons Section */}
          <div className="flex flex-col gap-3 items-center max-w-[600px] text-center">
            <p className="font-medium leading-[52px] text-[#373737] text-3xl md:text-4xl lg:text-[45px] tracking-[0px] whitespace-pre-wrap">
              Reepls was built to be the online space that feels original- made for Africa, made for you
            </p>
            <div className="flex flex-col font-medium justify-center leading-[28px] text-[20px] text-[#737373] tracking-[-0.75px]">
              <p className="leading-[28px] whitespace-pre-wrap">
                The dedicated cross-platform space (web and mobile) built for everyday Africans to authentically share their personal truths, ensuring every story is published and heard.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 items-center mt-3">
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-400 cursor-pointer flex items-center justify-center rounded-full h-[64px] px-[24px] hover:bg-primary-500 transition-colors"
              >
                <span className="font-medium text-[#fefefe] text-[18px] leading-[20px] text-center whitespace-nowrap">
                  Start a Reepl
                </span>
              </button>
              <Playstore className="bg-[#373737] h-[64px] w-[214px] cursor-pointer hover:opacity-90 transition-opacity" />
            </div>
          </div>

          {/* Image Placeholder */}

          {/* <div className="bg-[#d9d9d9] h-[400px] md:h-[500px] lg:h-[540px] rounded-2xl w-full max-w-[1254px]">
           
          </div> */}

          
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
