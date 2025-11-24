import { Link } from "react-router-dom";

// Figma asset URLs
const imgLogo = "https://www.figma.com/api/mcp/asset/21159628-825b-4386-a2c4-0ae9c334e8aa";
const imgInstagramLogo = "https://www.figma.com/api/mcp/asset/06804870-2605-4545-af11-48e589c30a02";
const imgFacebookLogo = "https://www.figma.com/api/mcp/asset/a968664d-99d7-4217-b93e-e3480d66f5cd";
const imgYoutubeLogo = "https://www.figma.com/api/mcp/asset/c1ffdb17-4292-47dd-a77b-b23065fe004f";

const LandingPageFooter = () => {
  return (
    <footer className="bg-[#373737] py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-5 md:px-16 lg:px-[80px]">
        <div className="flex flex-col gap-12 lg:gap-[48px]">
          {/* Top Section */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-0">
            {/* Left - Logo */}
            <div className="flex items-center gap-2.5 pr-0 lg:pr-[120px]">
              <div className="relative w-[38.208px] h-[38.208px] overflow-hidden">
                <img alt="Reepls Logo" className="block max-w-none size-full" src={imgLogo} />
              </div>
              <div className="flex items-center justify-center p-2.5">
                <p className="font-semibold text-[22px] leading-[28px] text-[#cccccc] tracking-[0px] whitespace-nowrap">
                  Reepls
                </p>
              </div>
            </div>

            {/* Center - Navigation Links */}
            <div className="flex flex-1 font-medium gap-12 items-center justify-center text-[16px] text-[#737373] tracking-[-0.75px] whitespace-nowrap">
              <Link
                to="/feed"
                className="hover:text-[#cccccc] transition-colors"
              >
                Get the app
              </Link>
              <Link
                to="/Terms&Policies"
                className="hover:text-[#cccccc] transition-colors"
              >
                Help center
              </Link>
              <button
                onClick={() => window.open('https://donations-ashy.vercel.app/', '_blank')}
                className="hover:text-[#cccccc] transition-colors cursor-pointer"
              >
                Donate to Reepls
              </button>
            </div>

            {/* Right - Customer Support */}
            <div className="flex flex-1 flex-col items-start lg:items-end">
              <p className="font-medium text-[16px] leading-[24px] text-[#737373] tracking-[-0.75px] text-left lg:text-right whitespace-pre-wrap">
                <span className="font-bold">Customer Support:</span>
                <span>{` (+237) 677 77 77 77  `}</span>
                <span className="font-bold">Email:</span>
                <span>{` info@reepls.com`}</span>
              </p>
            </div>
          </div>

          {/* Separator Line */}
          <div className="bg-[#737373] h-px w-full" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="font-medium text-[16px] leading-[24px] text-[#737373] tracking-[-0.75px] whitespace-nowrap">
              Reepls 1.0. Copyright 2025. All rights reserved
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-8 items-center justify-center">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-8 h-8 hover:opacity-80 transition-opacity"
              >
                <img alt="Instagram" className="block max-w-none size-full" src={imgInstagramLogo} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-8 h-8 hover:opacity-80 transition-opacity"
              >
                <img alt="Facebook" className="block max-w-none size-full" src={imgFacebookLogo} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative w-8 h-8 hover:opacity-80 transition-opacity"
              >
                <img alt="YouTube" className="block max-w-none size-full" src={imgYoutubeLogo} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
