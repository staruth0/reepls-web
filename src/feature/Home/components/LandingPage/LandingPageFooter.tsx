import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { logoOnDark, logoOnWhite } from "../../../../assets/icons";
import { SECTION_CONTENT_CLASS } from "./sectionLayout";
import useTheme from "../../../../hooks/useTheme";

const LandingPageFooter = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-[#373737] py-12 sm:py-14 md:py-16 lg:py-20">
      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex flex-col gap-10 min-[900px]:gap-12">
          <div className="flex flex-col min-[900px]:flex-row items-start justify-between gap-8 min-[900px]:gap-0">
            <Link
              to="/"
              className="flex items-center pr-0 lg:pr-[120px]"
              aria-label="Reepls home"
            >
              <img
                src={theme === "light" ? logoOnDark : logoOnWhite}
                alt="Reepls"
                className="h-8 md:h-9 w-auto object-contain shrink-0"
              />
            </Link>

            <div className="flex flex-1 font-medium gap-6 sm:gap-8 md:gap-12 items-center justify-center text-sm sm:text-[16px] text-[#737373] tracking-[-0.75px] flex-wrap">
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
            <div className="flex flex-1 flex-col items-start min-[900px]:items-end">
              <p className="font-medium text-sm sm:text-base leading-[24px] text-[#737373] tracking-[-0.75px] text-left min-[900px]:text-right">
                <span className="font-bold block mb-1">Customer Support:</span>
                <span className="block">(+237) 677 77 77 77</span>
                <span className="font-bold block mt-1">Email:</span>
                <span className="block">info@reepls.com</span>
              </p>
            </div>
          </div>

          {/* Separator Line */}
          <div className="bg-[#737373] h-px w-full" />

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="font-medium text-sm sm:text-base leading-[24px] text-[#737373] tracking-[-0.75px]">
              © 2025. All rights reserved.
            </p>

            <div className="flex gap-6 md:gap-8 items-center justify-center">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#737373] hover:text-[#cccccc] transition-colors p-1"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#737373] hover:text-[#cccccc] transition-colors p-1"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#737373] hover:text-[#cccccc] transition-colors p-1"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
