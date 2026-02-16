/**
 * Reading Progress Calculator
 * 
 * Implements the sophisticated reading progress formula that combines temporal engagement
 * (time spent) and spatial engagement (scroll position) to create a fair and balanced
 * estimate of reading progress.
 * 
 * Formula: RP = (Weight_min × min(Rt, Rs)) + (Weight_max × max(Rt, Rs))
 * Where:
 * - Rt = Time spent / Article Read Time
 * - Rs = Current Scroll Position / Maximum Scroll Position
 * - Weight_min (α) = 0.7 (penalizes skimming or leaving page idle)
 * - Weight_max (β) = 1 - α = 0.3
 */

export interface ReadingProgressParams {
  timeSpent: number; // in seconds
  articleReadTime: number; // in seconds
  currentScrollPosition: number; // in pixels or any unit
  maxScrollPosition: number; // in pixels or any unit
  weightMin?: number; // default 0.7
}

export interface ReadingProgressResult {
  progress: number; // 0-1 (0% to 100%)
  progressPercentage: number; // 0-100
  timeRatio: number; // Rt
  scrollRatio: number; // Rs
  isTimeLimited: boolean; // true if time spent >= article read time
  isScrollLimited: boolean; // true if scroll position >= max scroll
}

/**
 * Calculate reading progress using the sophisticated formula
 */
export function calculateReadingProgress(params: ReadingProgressParams): ReadingProgressResult {
  const {
    timeSpent,
    articleReadTime,
    currentScrollPosition,
    maxScrollPosition,
    weightMin = 0.7
  } = params;

  // Validate inputs
  if (articleReadTime <= 0 || maxScrollPosition <= 0) {
    return {
      progress: 0,
      progressPercentage: 0,
      timeRatio: 0,
      scrollRatio: 0,
      isTimeLimited: false,
      isScrollLimited: false
    };
  }

  // Apply boundaries to prevent infinity bugs
  const boundedTimeSpent = Math.min(timeSpent, articleReadTime);
  const boundedScrollPosition = Math.min(currentScrollPosition, maxScrollPosition);

  // Calculate ratios
  const timeRatio = boundedTimeSpent / articleReadTime;
  const scrollRatio = boundedScrollPosition / maxScrollPosition;

  // Ensure ratios are between 0 and 1
  const clampedTimeRatio = Math.max(0, Math.min(1, timeRatio));
  const clampedScrollRatio = Math.max(0, Math.min(1, scrollRatio));

  // Calculate weights
  const weightMax = 1 - weightMin;

  // Apply the formula: RP = (Weight_min × min(Rt, Rs)) + (Weight_max × max(Rt, Rs))
  const minRatio = Math.min(clampedTimeRatio, clampedScrollRatio);
  const maxRatio = Math.max(clampedTimeRatio, clampedScrollRatio);

  const progress = (weightMin * minRatio) + (weightMax * maxRatio);

  // Ensure progress is between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return {
    progress: clampedProgress,
    progressPercentage: Math.round(clampedProgress * 100),
    timeRatio: clampedTimeRatio,
    scrollRatio: clampedScrollRatio,
    isTimeLimited: timeSpent >= articleReadTime,
    isScrollLimited: currentScrollPosition >= maxScrollPosition
  };
}

/**
 * Calculate article read time based on content
 * This is a simple estimation - you might want to use a more sophisticated method
 */
export function estimateArticleReadTime(content: string, wordsPerMinute: number = 200): number {
  // Remove HTML tags and count words
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').filter(word => word.length > 0).length;
  
  // Convert to seconds
  return Math.ceil((wordCount / wordsPerMinute) * 60);
}

/**
 * Get scroll metrics for an element
 */
export function getScrollMetrics(element: HTMLElement): {
  currentScrollPosition: number;
  maxScrollPosition: number;
  scrollRatio: number;
} {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const elementTop = element.offsetTop;
  const elementHeight = element.offsetHeight;
  const windowHeight = window.innerHeight;

  // Calculate how much of the element has been scrolled through
  const scrolled = Math.max(0, scrollTop - elementTop);
  const maxScroll = Math.max(0, elementHeight - windowHeight);

  return {
    currentScrollPosition: scrolled,
    maxScrollPosition: maxScroll,
    scrollRatio: maxScroll > 0 ? scrolled / maxScroll : 0
  };
}

/**
 * Format time in a human-readable way
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

/**
 * Format progress as a readable string
 */
export function formatProgress(result: ReadingProgressResult): string {
  const { progressPercentage, isTimeLimited, isScrollLimited } = result;
  
  let status = `${progressPercentage}% complete`;
  
  if (isTimeLimited && isScrollLimited) {
    status += ' (fully read)';
  } else if (isTimeLimited) {
    status += ' (time limit reached)';
  } else if (isScrollLimited) {
    status += ' (scrolled to end)';
  }
  
  return status;
}
