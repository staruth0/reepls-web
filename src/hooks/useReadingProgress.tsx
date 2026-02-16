import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  calculateReadingProgress, 
  getScrollMetrics, 
  estimateArticleReadTime,
  ReadingProgressResult
} from '../utils/readingProgressCalculator';

interface UseReadingProgressOptions {
  articleId: string;
  content: string;
  isLoggedIn: boolean;
  isPreview?: boolean;
  onProgressChange?: (progress: ReadingProgressResult) => void;
  saveInterval?: number; // in milliseconds, default 30000 (30 seconds)
  scrollThrottle?: number; // in milliseconds, default 100
}

interface UseReadingProgressReturn {
  progress: ReadingProgressResult;
  isTracking: boolean;
  startTracking: () => void;
  stopTracking: () => void;
  resetProgress: () => void;
  saveProgress: () => void;
}

export const useReadingProgress = ({
  articleId,
  content,
  isLoggedIn,
  isPreview = false,
  onProgressChange,
  saveInterval = 30000,
  scrollThrottle = 100
}: UseReadingProgressOptions): UseReadingProgressReturn => {
  const [isTracking, setIsTracking] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScrollPosition, setMaxScrollPosition] = useState(0);
  const [progress, setProgress] = useState<ReadingProgressResult>({
    progress: 0,
    progressPercentage: 0,
    timeRatio: 0,
    scrollRatio: 0,
    isTimeLimited: false,
    isScrollLimited: false
  });

  const startTimeRef = useRef<number | null>(null);
  const lastSaveTimeRef = useRef<number>(0);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate article read time
  const articleReadTime = estimateArticleReadTime(content);

  // Calculate current progress
  const calculateCurrentProgress = useCallback((): ReadingProgressResult => {
    if (!isTracking || articleReadTime <= 0 || maxScrollPosition <= 0) {
      return {
        progress: 0,
        progressPercentage: 0,
        timeRatio: 0,
        scrollRatio: 0,
        isTimeLimited: false,
        isScrollLimited: false
      };
    }

    return calculateReadingProgress({
      timeSpent,
      articleReadTime,
      currentScrollPosition: scrollPosition,
      maxScrollPosition,
      weightMin: 0.7
    });
  }, [isTracking, timeSpent, articleReadTime, scrollPosition, maxScrollPosition]);

  // Update progress when dependencies change
  useEffect(() => {
    const newProgress = calculateCurrentProgress();
    setProgress(newProgress);
    onProgressChange?.(newProgress);
  }, [calculateCurrentProgress, onProgressChange]);

  // Start tracking
  const startTracking = useCallback(() => {
    if (isTracking || isPreview || !isLoggedIn) return;

    setIsTracking(true);
    startTimeRef.current = Date.now();
    lastSaveTimeRef.current = Date.now();

    // Set up periodic save
    saveIntervalRef.current = setInterval(() => {
      if (isTracking) {
        // This will be handled by the saveProgress function
      }
    }, saveInterval);
  }, [isTracking, isPreview, isLoggedIn, saveInterval]);

  // Stop tracking
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    startTimeRef.current = null;

    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
      saveIntervalRef.current = null;
    }
  }, []);

  // Reset progress
  const resetProgress = useCallback(() => {
    setTimeSpent(0);
    setScrollPosition(0);
    setMaxScrollPosition(0);
    setProgress({
      progress: 0,
      progressPercentage: 0,
      timeRatio: 0,
      scrollRatio: 0,
      isTimeLimited: false,
      isScrollLimited: false
    });
  }, []);

  // Save progress (to be implemented with API calls)
  const saveProgress = useCallback(() => {
    if (!isTracking || !isLoggedIn || isPreview) return;

    const currentProgress = calculateCurrentProgress();
    console.log('Saving reading progress:', {
      articleId,
      progress: currentProgress,
      timeSpent,
      scrollPosition,
      maxScrollPosition
    });

    // TODO: Implement actual API save here
    // This would call your existing reading progress API
  }, [isTracking, isLoggedIn, isPreview, articleId, calculateCurrentProgress, timeSpent, scrollPosition, maxScrollPosition]);

  // Update time spent
  useEffect(() => {
    if (!isTracking || !startTimeRef.current) return;

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        setTimeSpent(elapsed);
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isTracking]);

  // Handle scroll tracking
  useEffect(() => {
    if (!isTracking) return;

    const handleScroll = () => {
      const articleElement = document.getElementById('article-content');
      if (!articleElement) return;

      const metrics = getScrollMetrics(articleElement);
      setScrollPosition(metrics.currentScrollPosition);
      setMaxScrollPosition(metrics.maxScrollPosition);

      // Throttle scroll events
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        // Scroll handling is complete
      }, scrollThrottle);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isTracking, scrollThrottle]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    progress,
    isTracking,
    startTracking,
    stopTracking,
    resetProgress,
    saveProgress
  };
};
