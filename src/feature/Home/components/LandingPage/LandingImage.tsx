import { ImgHTMLAttributes } from "react";

/**
 * Image that hides itself on load error to avoid showing the broken-image icon
 * when the asset path is missing or fails to load.
 */
export function LandingImage({
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const handleError: ImgHTMLAttributes<HTMLImageElement>["onError"] = (e) => {
    e.currentTarget.style.display = "none";
    onError?.(e);
  };
  return <img {...props} onError={handleError} />;
}
