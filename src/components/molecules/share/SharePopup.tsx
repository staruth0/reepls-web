import React, { useEffect } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";
// import { IoShareOutline } from "react-icons/io5";

interface SharePopupProps {
  url: string; // URL of the post to share
  title: string; // Title of the post
  onClose: () => void; // Function to close the popup
}

const SharePopup: React.FC<SharePopupProps> = ({ url, title, onClose }) => {
  // Handle in-app sharing
  // const handleInAppShare = () => {
  //   console.log("Sharing in-app:", { url, title });
  //   onClose();
  // };

  useEffect(() => {
    console.log({ url, title });
  }, [url, title]);

  return (
    <>
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-[999]"
        onClick={onClose}
      ></div>

      {/* Share Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-lg shadow-lg p-4 sm:p-6 z-[1100] w-[90%] max-w-md sm:max-w-xl">
        <h3 className="text-neutral-50 text-lg font-semibold mb-4">Share this post</h3>
        <div className="flex flex-nowrap gap-4 sm:gap-6 overflow-x-auto justify-start pb-2">
          {/* Facebook Share */}
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <FacebookShareButton url={url} title={title}>
              <FacebookIcon size={32} round className="sm:w-10 sm:h-10" />
            </FacebookShareButton>
            <span className="text-neutral-300 text-xs sm:text-sm mt-1">Facebook</span>
          </div>

          {/* WhatsApp Share */}
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <WhatsappShareButton url={url} title={title} separator=": ">
              <WhatsappIcon size={32} round className="sm:w-10 sm:h-10" />
            </WhatsappShareButton>
            <span className="text-neutral-300 text-xs sm:text-sm mt-1">WhatsApp</span>
          </div>

          {/* X (Twitter) Share */}
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <TwitterShareButton url={url} title={title}>
              <XIcon size={32} round className="sm:w-10 sm:h-10" />
            </TwitterShareButton>
            <span className="text-neutral-300 text-xs sm:text-sm mt-1">X</span>
          </div>

          {/* Instagram Note */}
          <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <button
              onClick={() => {
                alert("Copy the URL to share on Instagram: " + url);
                onClose();
              }}
              className="focus:outline-none"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
              />
            </button>
            <span className="text-neutral-300 text-xs sm:text-sm mt-1">Instagram</span>
          </div>

          {/* In-App Share */}
          {/* <div className="flex flex-col items-center min-w-[60px] sm:min-w-[80px]">
            <button onClick={handleInAppShare} className="focus:outline-none">
              <IoShareOutline className="text-neutral-50 w-8 h-8 sm:w-10 sm:h-10" />
            </button>
            <span className="text-neutral-300 text-xs sm:text-sm mt-1">In-App</span>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default SharePopup;