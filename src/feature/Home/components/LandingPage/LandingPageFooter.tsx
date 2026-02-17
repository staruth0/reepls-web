import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaYoutube } from "react-icons/fa";
import { logoOnDark, logoOnWhite } from "../../../../assets/icons";
import { SECTION_CONTENT_CLASS } from "./sectionLayout";
import useTheme from "../../../../hooks/useTheme";
import ThemeSwitcher from "../ThemeSwitcher";

const LandingPageFooter = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-[#373737] py-10 sm:py-12 md:py-14 lg:py-16">
      <div className={SECTION_CONTENT_CLASS}>
        <div className="flex flex-col gap-10 min-[900px]:gap-12">
          {/* Top: 3 equal-width sections on large screens; wrap as needed */}
          <div className="grid grid-cols-1 min-[700px]:grid-cols-2 min-[950px]:grid-cols-3 gap-8 min-[950px]:gap-x-10 items-start">
            <Link
              to="/"
              className="flex items-center min-w-0"
              aria-label="Reepls home"
            >
              <img
                src={theme === "light" ? logoOnDark : logoOnWhite}
                alt="Reepls"
                className="h-8 md:h-9 w-auto object-contain shrink-0"
              />
            </Link>

            {/* Links: must never wrap; keep one long line of 3 items */}
            <div className="flex font-medium gap-4 sm:gap-5 md:gap-6 items-start min-[950px]:items-center justify-start min-[950px]:justify-center text-sm sm:text-[16px] text-[#737373] tracking-[-0.75px] flex-nowrap whitespace-nowrap min-w-0 overflow-x-auto">
              <Link
                to="/feed"
                className="hover:text-[#cccccc] transition-colors"
              >
                Get the app
              </Link>
              <button
                onClick={() => window.open('https://donations-ashy.vercel.app/', '_blank')}
                className="hover:text-[#cccccc] transition-colors cursor-pointer"
              >
                Donate to Reepls
              </button>
            </div>

            {/* Right - Customer Support */}
            <div className="flex flex-col items-start min-[950px]:items-end min-w-0">
              <div className="font-medium text-sm sm:text-base leading-[24px] text-[#737373] tracking-[-0.75px] text-left min-[950px]:text-right space-y-1">
                <p>
                  <span className="font-bold">Contact:</span>{" "}
                  <span>(+237) 677 77 77 77</span>
                </p>
                <p>
                  <span className="font-bold">Email:</span> <span>info@reepls.com</span>
                </p>
              </div>
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

            <div className="flex gap-4 md:gap-6 items-center justify-center">
              {/* Desktop theme switcher lives in footer */}
              <div className="hidden md:block">
                <ThemeSwitcher variant="footer" />
              </div>
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
