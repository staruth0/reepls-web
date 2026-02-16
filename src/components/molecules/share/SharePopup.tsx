import React, { useEffect, useState } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  FacebookIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";
import { IoCopyOutline, IoCheckmarkCircle } from "react-icons/io5"; 
import { t } from "i18next";
import { MediaItem, MediaType } from "../../../models/datamodels";

interface SharePopupProps {
  url: string; // URL of the post to share
  title: string; // Title of the post
  subtitle?: string; // Subtitle of the post
  thumbnail?: string; // Thumbnail image URL (for articles)
  media?: MediaItem[]; // Media array (for posts)
  isArticle?: boolean; // Whether this is an article or post
  description?: string; // Description for social media previews
  onClose: () => void; // Function to close the popup
}

const SharePopup: React.FC<SharePopupProps> = ({ 
  url, 
  title, 
  subtitle, 
  thumbnail, 
  media,
  isArticle,
  description, 
  onClose 
}) => {
  const [copied, setCopied] = useState(false);

  // Handle copy link functionality
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  // Create a comprehensive description for sharing
  const shareDescription = description || subtitle || title;
  
  // Determine which image to use for sharing
  // For articles: use thumbnail
  // For posts: use first image from media array, or thumbnail if no media
  const getShareImage = (): string => {
    if (isArticle) {
      // For articles, use thumbnail
      return thumbnail || '';
    } else {
      // For posts, use first image from media array
      if (media && media.length > 0) {
        const firstImage = media.find(item => item.type === MediaType.Image);
        if (firstImage) {
          return firstImage.url;
        }
      }
      // Fallback to thumbnail if no media images
      return thumbnail || '';
    }
  };
  
  // Use thumbnail or fallback to favicon
  // Ensure the image URL is absolute
  const getAbsoluteImageUrl = (imageUrl: string) => {
    if (!imageUrl) return `${window.location.origin}/favicon.png`;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${window.location.origin}${imageUrl}`;
    return `${window.location.origin}/${imageUrl}`;
  };
  
  const shareImage = getAbsoluteImageUrl(getShareImage());

  useEffect(() => {
    // Update meta tags for better social media previews
    const updateMetaTags = () => {
      // Update or create Open Graph meta tags
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Update or create Twitter Card meta tags
      const updateTwitterMetaTag = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      // Set Open Graph tags
      updateMetaTag('og:title', title);
      updateMetaTag('og:description', shareDescription);
      updateMetaTag('og:image', shareImage);
      updateMetaTag('og:url', url);
      updateMetaTag('og:type', 'article');

      // Set Twitter Card tags
      updateTwitterMetaTag('twitter:card', 'summary_large_image');
      updateTwitterMetaTag('twitter:title', title);
      updateTwitterMetaTag('twitter:description', shareDescription);
      updateTwitterMetaTag('twitter:image', shareImage);
    };

    updateMetaTags();
  }, [url, title, shareDescription, shareImage, isArticle, media, thumbnail]);

  return (
    <>
      {/* Dark Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[999] backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Share Popup */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-neutral-900 rounded-2xl shadow-2xl p-6 z-[1100] w-[90%] max-w-md sm:max-w-lg transition-all duration-300">
        <h3 className="text-neutral-50 text-xl font-bold mb-6 tracking-tight">
          {t("Share this post")}
        </h3>
        <div className="flex flex-nowrap gap-6 overflow-x-auto justify-start pb-4">
          {/* Facebook Share */}
          <div className="flex flex-col items-center min-w-[70px]">
            <FacebookShareButton 
              url={url} 
              hashtag="#reepls"
            >
              <FacebookIcon
                size={40}
                round
                className="hover:scale-110 transition-transform duration-200"
              />
            </FacebookShareButton>
            <span className="text-neutral-400 text-sm mt-2 font-medium">Facebook</span>
          </div>

          {/* WhatsApp Share */}
          <div className="flex flex-col items-center min-w-[70px]">
            <WhatsappShareButton 
              url={url} 
              title={title} 
              separator=": "
            >
              <WhatsappIcon
                size={40}
                round
                className="hover:scale-110 transition-transform duration-200"
              />
            </WhatsappShareButton>
            <span className="text-neutral-400 text-sm mt-2 font-medium">WhatsApp</span>
          </div>

          {/* X (Twitter) Share */}
          <div className="flex flex-col items-center min-w-[70px]">
            <TwitterShareButton 
              url={url} 
              title={title}
              via="reepls"
              hashtags={["reepls"]}
            >
              <XIcon
                size={40}
                round
                className="hover:scale-110 transition-transform duration-200"
              />
            </TwitterShareButton>
            <span className="text-neutral-400 text-sm mt-2 font-medium">X</span>
          </div>

          {/* Instagram Note */}
          <div className="flex flex-col items-center min-w-[70px]">
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
                className="w-10 h-10 rounded-full hover:scale-110 transition-transform duration-200"
              />
            </button>
            <span className="text-neutral-400 text-sm mt-2 font-medium">Instagram</span>
          </div>

          {/* Copy Link */}
          <div className="flex flex-col items-center min-w-[70px]">
            <button
              onClick={handleCopyLink}
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                copied ? "bg-green-500" : "bg-neutral-700"
              } hover:bg-neutral-600 transition-colors duration-200 focus:outline-none`}
            >
              {copied ? (
                <IoCheckmarkCircle className="text-neutral-50 w-6 h-6" />
              ) : (
                <IoCopyOutline className="text-neutral-50 w-6 h-6" />
              )}
            </button>
            <span className="text-neutral-400 text-sm mt-2 font-medium">
              {copied ? t("Copied") : t("Copy Link")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default SharePopup;