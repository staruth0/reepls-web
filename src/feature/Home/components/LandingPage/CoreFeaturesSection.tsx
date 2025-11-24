// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Figma asset URLs - These would need to be exported from Figma as PNGs
// For now, I'll use placeholder structure that matches the design
const imgAvatar1 = "https://www.figma.com/api/mcp/asset/cc191be5-3a41-4930-bb0e-0677c5f15f7a";
const imgFrame26080055 = "https://www.figma.com/api/mcp/asset/82fcf7d9-2459-48f1-9512-fa11c6b5558a";
const imgAvatarImage48 = "https://www.figma.com/api/mcp/asset/d89134fa-e55a-4b15-845a-68b7804d0593";
const imgFrame26080160 = "https://www.figma.com/api/mcp/asset/ad89d26c-e36a-4ce6-8389-6fd4519d5a14";
const imgWaveTradPattern = "https://www.figma.com/api/mcp/asset/e0d68118-a3a1-4bba-969f-5b110bfd0af5";
const imgGroup13 = "https://www.figma.com/api/mcp/asset/dca3e6de-3209-4eb8-bd81-29721a5f4cd1";
const imgGroup6 = "https://www.figma.com/api/mcp/asset/9e2d7c53-989e-4843-8ca9-113e4c32f8ca";

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

  const topics = [
    "education", "tech", "art", "history", "business", "agriculture",
    "productivity", "science", "health", "politics", "data",
    "entrepreneurship", "relationship", "international affairs", "marketing"
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[80px]">
        <div className="flex flex-col gap-20 lg:gap-32 items-center py-12 lg:py-16">
          {/* Header */}
          <div className="flex flex-col gap-3 items-center max-w-[600px] text-center">
            <p className="font-medium leading-tight text-[#373737] text-2xl md:text-3xl lg:text-4xl tracking-[0px]">
              Core Features (The How)
            </p>
            <div className="flex flex-col font-medium justify-center leading-snug text-base md:text-lg text-[#737373] tracking-[-0.75px]">
              <p className="leading-relaxed whitespace-pre-wrap">
                Where Ideas Flow: Structured Content & Diverse Media
              </p>
            </div>
          </div>

          {/* Main Content Grid - In-Depth Posts & Podcasts */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center w-full">
            {/* Left side - Article and Podcast Cards */}
            <div className="flex-1 relative w-full max-w-md lg:max-w-lg flex justify-center lg:justify-start">
              {/* Article Card */}
              <div className="bg-white rounded-xl shadow-lg p-3 w-full max-w-sm scale-90 lg:scale-100">
                {/* User Profile Section */}
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex gap-2 items-center">
                    <div className="relative rounded-full w-10 h-10">
                      <img alt="" className="absolute inset-0 object-cover rounded-full size-full" src={imgAvatar1} />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex gap-1 items-center">
                        <span className="font-medium text-sm text-[#373737] leading-tight">Egbe Mercy</span>
                        <div className="h-3 w-3">
                          <img alt="" className="block size-full" src="https://www.figma.com/api/mcp/asset/5f147d20-1bb2-49a8-8806-90ece859c015" />
                        </div>
                        <span className="text-[8px]">•</span>
                        <span className="font-bold text-sm text-[#57c016] leading-tight">Follow</span>
                      </div>
                      <span className="font-normal text-xs text-[#373737] leading-tight">Writer @ CMR FA magazine...</span>
                      <span className="font-normal text-[10px] text-[#373737] leading-tight">20 Oct</span>
                    </div>
                  </div>
                  <div className="w-4 h-4">
                    <img alt="" className="block size-full" src="https://www.figma.com/api/mcp/asset/f95848b9-26f1-452d-a08b-43c38fc74df2" />
                  </div>
                </div>

                {/* Article Content */}
                <div className="flex flex-col gap-3 px-3">
                  <div className="bg-[#fcfcfc] border border-[#eeeeee] rounded-lg h-[280px] flex flex-col">
                    <div className="flex-1 flex items-center justify-center rounded-t-lg overflow-hidden relative">
                      <img alt="" className="absolute inset-0 object-cover rounded-t-lg size-full" src={imgFrame26080055} />
                    </div>
                    <div className="flex flex-col gap-1 p-3">
                      <div className="px-2">
                        <p className="font-normal text-base text-[#373737] leading-snug tracking-tight">
                          What October's presidential election results means for young Cameroonians.
                        </p>
                      </div>
                      <div className="px-2">
                        <p className="font-normal text-sm text-[#868686] leading-snug">
                          A wave of protests in and around the nation's most important city- Douala, portrays the disposition of the young people about the results
                        </p>
                      </div>
                      <div className="flex gap-2 items-center px-2">
                        <span className="font-normal text-xs text-[#373737] leading-tight">2 min read</span>
                      </div>
                    </div>
                  </div>

                  {/* Interaction Buttons */}
                  <div className="flex items-center justify-between w-full px-2">
                    <div className="flex h-5 items-center gap-2">
                      <div className="flex gap-1 items-center px-2 py-1">
                        <img alt="" className="w-4 h-4" src="https://www.figma.com/api/mcp/asset/21b62980-052e-41a3-9ba7-6b2f27d956fb" />
                        <span className="font-medium text-[10px] text-[#373737] leading-tight">321</span>
                      </div>
                      <div className="flex gap-1 items-center px-2 py-1">
                        <img alt="" className="w-4 h-4" src="https://www.figma.com/api/mcp/asset/7be441a9-76e7-4d73-aff4-cff87783d290" />
                        <span className="font-medium text-[10px] text-[#373737] leading-tight">24</span>
                      </div>
                    </div>
                    <div className="flex h-5 items-center gap-2">
                      <div className="flex gap-1 items-center px-2">
                        <img alt="" className="w-4 h-4" src="https://www.figma.com/api/mcp/asset/2a234f87-9d50-4236-8bc6-1a554873d150" />
                        <span className="font-normal text-[10px] text-[#373737] leading-tight">7</span>
                      </div>
                      <div className="flex items-center px-2">
                        <img alt="" className="w-4 h-4" src="https://www.figma.com/api/mcp/asset/95a9a050-3c71-499b-8fd9-f28c69a7d0b3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Podcast Card - Positioned overlapping */}
              <div className="bg-[#262626] rounded-xl shadow-lg p-2 w-[280px] absolute top-[240px] left-[240px] scale-90 lg:scale-100">
                <div className="flex flex-col gap-1">
                  <div className="flex gap-4 items-start">
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5">
                        <div className="relative rounded-full w-7 h-7">
                          <img alt="" className="absolute inset-0 object-cover rounded-full size-full" src={imgAvatarImage48} />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-xs text-[#d4d4d4] leading-tight">Ndifor Icha</span>
                            <div className="h-3 w-3">
                              <img alt="" className="block size-full" src="https://www.figma.com/api/mcp/asset/5ea302cb-262a-4e4d-a685-2bc0f026ed54" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-bold text-sm text-[#d4d4d4] leading-snug max-h-[36px] overflow-hidden">
                          The New Africa: As Seen from these Eyes
                        </p>
                        <p className="font-normal text-xs text-[#d4d4d4] leading-tight max-h-[24px] overflow-hidden">
                          'The Tangue', alongside a number of other historic artwork from the fatherland have not found home yet.
                        </p>
                      </div>
                    </div>
                    <div className="h-[70px] rounded-lg w-[90px]">
                      <img alt="" className="absolute inset-0 object-cover rounded-lg size-full" src={imgFrame26080160} />
                    </div>
                  </div>
                  <div className="flex h-6 items-end justify-between">
                    <div className="flex-1 flex gap-2 items-center">
                      <span className="font-bold text-[10px] text-[#707070] leading-tight">Jun 26</span>
                      <span className="text-[5px]">•</span>
                      <span className="font-bold text-[10px] text-[#707070] leading-tight">32 min</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex gap-1 items-center px-1 py-1">
                        <img alt="" className="w-3.5 h-3.5" src="https://www.figma.com/api/mcp/asset/21b62980-052e-41a3-9ba7-6b2f27d956fb" />
                        <span className="font-medium text-[10px] text-[#d4d4d4] leading-tight">63</span>
                      </div>
                      <div className="flex items-center px-1">
                        <img alt="" className="w-4 h-4" src="https://www.figma.com/api/mcp/asset/95a9a050-3c71-499b-8fd9-f28c69a7d0b3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Microphone Button */}
              <div className="bg-[#57c016] rounded-full shadow-lg w-16 h-16 flex items-center justify-center absolute top-[280px] left-[460px] scale-90 lg:scale-100">
                <img alt="" className="w-5 h-7" src="https://www.figma.com/api/mcp/asset/5d9fef1b-9574-4050-8af2-d5d0f2ab4173" />
              </div>

              {/* Wave Pattern */}
              <div className="absolute top-[25%] left-[35%] w-[280px] h-[80px] opacity-60">
                <img alt="" className="block size-full" src={imgWaveTradPattern} />
              </div>
            </div>

            {/* Right side - Text Content */}
            <div className="flex-1 flex flex-col gap-3 items-start max-w-[500px] mx-auto lg:mx-0">
              <p className="font-medium leading-tight text-[#373737] text-2xl md:text-3xl lg:text-4xl tracking-[0px] whitespace-pre-wrap">
                In-Depth Posts & Podcasts:
              </p>
              <div className="flex flex-col font-medium justify-center leading-relaxed text-base md:text-lg text-[#737373] tracking-[-0.75px]">
                <p className="leading-relaxed whitespace-pre-wrap">
                  Go beyond the comment thread. Share written articles or launch your voice with integrated audio posts, which we call Podcasts, a format perfect for Africa's mobile-first user.
                </p>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate("/feed")}
                  className="border border-[#79747e] border-solid cursor-pointer rounded-full h-9 px-5 hover:bg-neutral-100 transition-colors"
                >
                  <span className="font-medium text-[#373737] text-sm leading-tight text-center whitespace-nowrap">
                    Explore Stories
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Streams Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
            <div className="flex-1 flex flex-col gap-3 items-start max-w-[500px] mx-auto lg:mx-0">
              <p className="font-medium leading-tight text-[#373737] text-2xl md:text-3xl lg:text-4xl tracking-[0px] whitespace-pre-wrap">
                Streams (Centralized Publications)
              </p>
              <div className="flex flex-col font-medium justify-center leading-relaxed text-base md:text-lg text-[#737373] tracking-[-0.75px]">
                <p className="leading-relaxed whitespace-pre-wrap">
                  Elevate your content. Join or create Streams—centralized hubs where writers and experts collaborate and curate stories around specific topics, driving collective influence and quality.
                </p>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="border border-[#79747e] border-solid cursor-pointer rounded-full h-9 px-5 hover:bg-neutral-100 transition-colors"
                >
                  <span className="font-medium text-[#373737] text-sm leading-tight text-center whitespace-nowrap">
                    Start a Stream
                  </span>
                </button>
              </div>
            </div>

            {/* Stream Cards */}
            <div className="flex-1 relative w-full max-w-md lg:max-w-lg flex justify-center lg:justify-end">
              {/* Stream Card */}
              <div className="bg-white rounded-xl shadow-lg w-full max-w-sm scale-90 lg:scale-100">
                <div className="h-[120px] relative">
                  <div className="absolute flex gap-2 items-start justify-center top-0 left-0 h-[70px] w-full overflow-hidden">
                    <img alt="" className="absolute inset-0 object-cover size-full" src="https://www.figma.com/api/mcp/asset/5e89323e-a518-4be0-90e8-25ff5306eb3b" />
                  </div>
                  <div className="absolute left-3 top-8 p-0.5 rounded-xl w-20">
                    <div className="border-2 border-[#fcfcfc] border-solid flex-1 rounded-xl">
                      <img alt="" className="absolute inset-0 object-cover rounded-xl size-full" src="https://www.figma.com/api/mcp/asset/0cea8d02-c214-4247-9e89-4675677e14b7" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between px-3 py-0">
                        <div className="flex-1 flex gap-2 items-center">
                          <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-sm text-[#373737] leading-tight">String value</span>
                              <div className="h-3 w-3">
                                <img alt="" className="block size-full" src="https://www.figma.com/api/mcp/asset/5f147d20-1bb2-49a8-8806-90ece859c015" />
                              </div>
                              <span className="text-[8px]">•</span>
                              <span className="font-bold text-sm text-[#57c016] leading-tight">Follow</span>
                            </div>
                            <div className="flex gap-1.5 items-start px-2 py-0">
                              <span className="font-normal text-xs text-[#868686] leading-tight">#tech</span>
                              <span className="font-normal text-xs text-[#868686] leading-tight">#machinelearning</span>
                            </div>
                            <p className="font-normal text-xs text-[#373737] leading-tight">
                              Setting the standard for young Cameroonian data engineers. Community + action.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 items-center px-3 py-0">
                        <span className="font-normal text-xs text-[#373737] leading-tight">
                          <span className="font-bold">3</span> Authors
                        </span>
                        <span className="text-[8px]">•</span>
                        <span className="font-normal text-xs text-[#373737] leading-tight">
                          <span className="font-bold">89</span> Subscribers
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="bg-[#57c016] rounded-full h-8 px-4">
                    <span className="font-medium text-[#fefefe] text-xs leading-tight">String value</span>
                  </button>
                </div>
                <div className="border-t border-[#eeeeee] flex items-center justify-between px-3 py-1.5">
                  <div className="flex gap-2 items-center px-0 py-1">
                    <span className="font-semibold text-xs text-[#868686] leading-tight">Posts</span>
                  </div>
                  <div className="border-b-[2px] border-[#57c016] flex gap-2 items-center px-0 py-1">
                    <span className="font-semibold text-xs text-[#373737] leading-tight">Posts</span>
                  </div>
                  <div className="flex gap-2 items-center px-0 py-1">
                    <span className="font-semibold text-xs text-[#868686] leading-tight">Posts</span>
                  </div>
                  <div className="flex gap-2 items-center px-0 py-1">
                    <span className="font-semibold text-xs text-[#868686] leading-tight">Posts</span>
                  </div>
                </div>
              </div>

              {/* Stream Article Card */}
              <div className="bg-[#1f1f1f] rounded-lg shadow-lg h-[70px] p-3 absolute top-[280px] left-[45px] w-[360px] scale-90 lg:scale-100">
                <div className="flex gap-16 items-center px-3 py-0">
                  <div className="flex gap-2 items-center">
                    <div className="flex items-center self-stretch">
                      <div className="flex flex-col gap-1.5 h-full items-start overflow-hidden rounded-lg w-9">
                        <div className="flex items-center justify-center w-full">
                          <div className="flex-none scale-y-[-100%] w-full">
                            <div className="aspect-square relative size-full">
                              <img alt="" className="block size-full" src={imgGroup6} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex gap-1 items-center">
                        <div className="flex gap-1 items-center">
                          <span className="font-normal text-sm text-[#d4d4d4] leading-tight">From</span>
                          <span className="font-semibold text-sm text-[#d4d4d4] leading-tight">OntheGround</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <span className="font-normal text-sm text-[#d4d4d4] leading-tight">by</span>
                          <span className="font-semibold text-sm text-[#d4d4d4] leading-tight">Tambe Loxly</span>
                          <div className="h-3 w-3">
                            <img alt="" className="block size-full" src="https://www.figma.com/api/mcp/asset/31574f4b-97da-44e0-8122-ce25fd4041ac" />
                          </div>
                        </div>
                        <span className="text-[8px]">•</span>
                        <span className="font-bold text-sm text-[#408415] leading-tight">Subscribe</span>
                      </div>
                      <span className="font-normal text-[9px] text-[#d4d4d4] leading-tight">30 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Pattern */}
              <div className="h-[120px] absolute top-[45%] left-0 w-[260px] opacity-40">
                <img alt="" className="block size-full" src={imgGroup13} />
              </div>
            </div>
          </div>

          {/* Curate Your Knowledge Section */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full">
            {/* Left - Topic Tags */}
            <div className="h-[300px] md:h-[350px] relative w-full max-w-md lg:max-w-lg flex justify-center lg:justify-start">
              {topics.map((topic, index) => {
                const positions = [
                  { x: 3, y: -14, rotate: 347.016 },
                  { x: 140, y: 0, rotate: 0 },
                  { x: 230, y: -7, rotate: 348.49 },
                  { x: 280, y: 22, rotate: 11.93 },
                  { x: 32, y: 62, rotate: 0 },
                  { x: 155, y: 42, rotate: 19.42 },
                  { x: 210, y: 118, rotate: 351.839 },
                  { x: 10, y: 99, rotate: 345.486 },
                  { x: 136, y: 102, rotate: 0 },
                  { x: 286, y: 68, rotate: 55.431 },
                  { x: 2, y: 187, rotate: 0 },
                  { x: 80, y: 169, rotate: 0 },
                  { x: 286, y: 174, rotate: 349.083 },
                  { x: 68, y: 201, rotate: 343.905 },
                  { x: 222, y: 203, rotate: 18.535 },
                ];
                const pos = positions[index] || { x: 0, y: 0, rotate: 0 };
                const isSelected = topic === "history" || topic === "politics" || topic === "international affairs";
                
                return (
                  <div
                    key={topic}
                    className="absolute flex items-center justify-center"
                    style={{
                      left: `${pos.x}px`,
                      top: `${pos.y}px`,
                      transform: `rotate(${pos.rotate}deg)`,
                    }}
                  >
                    <button
                      className={`px-6 py-3 rounded-full text-sm md:text-base leading-tight ${
                        isSelected
                          ? "bg-[#373737] text-[#fefefe]"
                          : "bg-[#f9fff5] border border-[#868686] text-[#868686]"
                      }`}
                    >
                      {topic}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right - Text Content */}
            <div className="flex-1 flex flex-col gap-3 items-start max-w-[500px] mx-auto lg:mx-0">
              <p className="font-medium leading-tight text-[#373737] text-2xl md:text-3xl lg:text-4xl tracking-[0px] whitespace-pre-wrap">
                Curate Your Knowledge
              </p>
              <div className="flex flex-col font-medium justify-center leading-relaxed text-base md:text-lg text-[#737373] tracking-[-0.75px]">
                <p className="leading-relaxed whitespace-pre-wrap">
                  Take control of your reading experience and eliminate digital clutter. You can customize your feed by your preferred topics and save articles for offline reading. This ensures you only consume the authentic insights and narratives that matter most to your interests.
                </p>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => navigate("/auth")}
                  className="border border-[#79747e] border-solid cursor-pointer rounded-full h-9 px-5 hover:bg-neutral-100 transition-colors"
                >
                  <span className="font-medium text-[#373737] text-sm leading-tight text-center whitespace-nowrap">
                    Get Started
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

