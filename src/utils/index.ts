import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to merge Tailwind and clsx classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Debounce function with proper typing for any function and its arguments
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  wait: number
) {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Convert base64 string to Blob with proper typing
export function convertBase64ToBlob(base64: string) {
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid base64 string: missing MIME type");
  }
  const mime = mimeMatch[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

// Utility to update meta tags for social media sharing
export function updateMetaTags(params: {
  title: string;
  description: string;
  image: string;
  url: string;
}) {
  const { title, description, image, url } = params;

  // Helper to update or create meta tag
  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Helper to update or create Twitter meta tag
  const updateTwitterMetaTag = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imageUrl: string) => {
    if (!imageUrl) return `${window.location.origin}/favicon.png`;
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/')) return `${window.location.origin}${imageUrl}`;
    return `${window.location.origin}/${imageUrl}`;
  };

  const absoluteImageUrl = getAbsoluteImageUrl(image);

  // Set Open Graph tags
  updateMetaTag('og:title', title);
  updateMetaTag('og:description', description);
  updateMetaTag('og:image', absoluteImageUrl);
  updateMetaTag('og:url', url);
  updateMetaTag('og:type', 'article');

  // Set Twitter Card tags
  updateTwitterMetaTag('twitter:card', 'summary_large_image');
  updateTwitterMetaTag('twitter:title', title);
  updateTwitterMetaTag('twitter:description', description);
  updateTwitterMetaTag('twitter:image', absoluteImageUrl);
}