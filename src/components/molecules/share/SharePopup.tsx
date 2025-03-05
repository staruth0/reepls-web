import React, { useEffect } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";
import { IoShareOutline } from "react-icons/io5"; 

interface SharePopupProps {
  url: string; // URL of the post to share
  title: string; // Title of the post
  onClose: () => void; // Function to close the popup
}

const SharePopup: React.FC<SharePopupProps> = ({ url, title, onClose }) => {
  // Handle in-app sharing 
  const handleInAppShare = () => {
    console.log("Sharing in-app:", { url, title });
   
    onClose(); 
  };

  useEffect(() => {
    console.log({url,title})
  },[url,title])
  return (
    <>
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-[999]"
        onClick={onClose}
      ></div>

      {/* Share Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-lg shadow-lg p-6 z-[1100] w-[40%]">
        <h3 className="text-neutral-50 text-lg font-semibold mb-4">Share this post</h3>
        <div className="flex flex-wrap gap-4 justify-between">
          {/* Facebook Share */}
          <div className="flex flex-col items-center">
            <FacebookShareButton url={url} title={title}>
              <FacebookIcon size={40} round />
            </FacebookShareButton>
            <span className="text-neutral-300 text-sm mt-1">Facebook</span>
          </div>

          {/* WhatsApp Share */}
          <div className="flex flex-col items-center">
            <WhatsappShareButton url={url} title={title} separator=": ">
              <WhatsappIcon size={40} round />
            </WhatsappShareButton>
            <span className="text-neutral-300 text-sm mt-1">WhatsApp</span>
          </div>

          {/* X (Twitter) Share */}
          <div className="flex flex-col items-center">
            <TwitterShareButton url={url} title={title}>
              <XIcon size={40} round />
            </TwitterShareButton>
            <span className="text-neutral-300 text-sm mt-1">X</span>
          </div>

          {/* Instagram Note */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                // Instagram doesn't have a direct share API via react-share, so we can open a URL or prompt
                alert("Copy the URL to share on Instagram: " + url);
                onClose();
              }}
              className="focus:outline-none"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                alt="Instagram"
                className="w-10 h-10 rounded-full"
              />
            </button>
            <span className="text-neutral-300 text-sm mt-1">Instagram</span>
          </div>

          {/* In-App Share */}
          <div className="flex flex-col items-center">
            <button onClick={handleInAppShare} className="focus:outline-none">
              <IoShareOutline className="text-neutral-50 w-10 h-10" />
            </button>
            <span className="text-neutral-300 text-sm mt-1">In-App</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharePopup;