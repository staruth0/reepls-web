import { MediaItem } from "../../models/datamodels";


const calculateReadTime = (content: string, images: MediaItem[]): number => {
  // Constants based on Medium's approach
  const WORDS_PER_MINUTE = 265;
  const FIRST_IMAGE_TIME = 12; // seconds
  const IMAGE_DECREMENT = 1; // seconds per image after the first
  const MIN_IMAGE_TIME = 3; // minimum time per image after 10th

  // Split content into words and count them
  const words = content.trim().split(/\s+/).length;

  // Get image count from the images array
  const imageCount = Array.isArray(images) ? images.length : 0;

  // Calculate base reading time in minutes
  const readTimeMinutes = words / WORDS_PER_MINUTE;

  // Calculate image time in seconds
  let imageTimeSeconds = 0;
  for (let i = 0; i < imageCount; i++) {
    if (i === 0) {
      imageTimeSeconds += FIRST_IMAGE_TIME;
    } else if (i < 10) {
      imageTimeSeconds += (FIRST_IMAGE_TIME - (i * IMAGE_DECREMENT));
    } else {
      imageTimeSeconds += MIN_IMAGE_TIME;
    }
  }

  // Convert total time to seconds and round up
  const totalSeconds = Math.ceil(readTimeMinutes * 60 + imageTimeSeconds);

  // Convert back to minutes and round up
  const totalMinutes = Math.ceil(totalSeconds / 60);

  return totalMinutes;
};

export {calculateReadTime};