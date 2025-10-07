import { calculateReadingProgress, estimateArticleReadTime } from '../utils/readingProgressCalculator';

describe('Reading Progress Calculator', () => {
  describe('calculateReadingProgress', () => {
    it('should calculate progress correctly for normal reading', () => {
      const result = calculateReadingProgress({
        timeSpent: 50, // 50 seconds
        articleReadTime: 240, // 4 minutes
        currentScrollPosition: 30, // 30 pixels
        maxScrollPosition: 60, // 60 pixels
        weightMin: 0.7
      });

      // Time ratio: 50/240 = 0.208
      // Scroll ratio: 30/60 = 0.5
      // Min ratio: 0.208, Max ratio: 0.5
      // Expected: (0.7 * 0.208) + (0.3 * 0.5) = 0.1456 + 0.15 = 0.2956
      expect(result.progress).toBeCloseTo(0.2956, 3);
      expect(result.progressPercentage).toBe(30); // 29.56% rounded
      expect(result.timeRatio).toBeCloseTo(0.208, 3);
      expect(result.scrollRatio).toBeCloseTo(0.5, 3);
    });

    it('should handle time-limited reading (user spent more time than needed)', () => {
      const result = calculateReadingProgress({
        timeSpent: 300, // 5 minutes
        articleReadTime: 240, // 4 minutes
        currentScrollPosition: 30,
        maxScrollPosition: 60,
        weightMin: 0.7
      });

      expect(result.isTimeLimited).toBe(true);
      expect(result.timeRatio).toBe(1); // Should be capped at 1
    });

    it('should handle scroll-limited reading (user scrolled to end)', () => {
      const result = calculateReadingProgress({
        timeSpent: 50,
        articleReadTime: 240,
        currentScrollPosition: 80, // More than max
        maxScrollPosition: 60,
        weightMin: 0.7
      });

      expect(result.isScrollLimited).toBe(true);
      expect(result.scrollRatio).toBe(1); // Should be capped at 1
    });

    it('should handle edge cases', () => {
      // Zero article read time
      const result1 = calculateReadingProgress({
        timeSpent: 50,
        articleReadTime: 0,
        currentScrollPosition: 30,
        maxScrollPosition: 60,
        weightMin: 0.7
      });
      expect(result1.progress).toBe(0);

      // Zero max scroll position
      const result2 = calculateReadingProgress({
        timeSpent: 50,
        articleReadTime: 240,
        currentScrollPosition: 30,
        maxScrollPosition: 0,
        weightMin: 0.7
      });
      expect(result2.progress).toBe(0);
    });

    it('should penalize skimming (high scroll, low time)', () => {
      const skimResult = calculateReadingProgress({
        timeSpent: 10, // Very little time
        articleReadTime: 240,
        currentScrollPosition: 50, // High scroll
        maxScrollPosition: 60,
        weightMin: 0.7
      });

      const normalResult = calculateReadingProgress({
        timeSpent: 120, // Normal time
        articleReadTime: 240,
        currentScrollPosition: 30, // Normal scroll
        maxScrollPosition: 60,
        weightMin: 0.7
      });

      // Skimming should result in lower progress due to weight penalty
      expect(skimResult.progress).toBeLessThan(normalResult.progress);
    });

    it('should penalize lingering (high time, low scroll)', () => {
      const lingerResult = calculateReadingProgress({
        timeSpent: 200, // High time
        articleReadTime: 240,
        currentScrollPosition: 10, // Low scroll
        maxScrollPosition: 60,
        weightMin: 0.7
      });

      const normalResult = calculateReadingProgress({
        timeSpent: 120, // Normal time
        articleReadTime: 240,
        currentScrollPosition: 30, // Normal scroll
        maxScrollPosition: 60,
        weightMin: 0.7
      });

      // Lingering should result in lower progress due to weight penalty
      expect(lingerResult.progress).toBeLessThan(normalResult.progress);
    });
  });

  describe('estimateArticleReadTime', () => {
    it('should estimate read time correctly', () => {
      const content = 'This is a test article with multiple words to count for reading time estimation.';
      const readTime = estimateArticleReadTime(content, 200); // 200 WPM
      
      // Content has about 15 words, so 15/200 * 60 = 4.5 seconds
      expect(readTime).toBe(5); // Rounded up
    });

    it('should handle HTML content', () => {
      const htmlContent = '<p>This is <strong>HTML</strong> content with <em>tags</em>.</p>';
      const readTime = estimateArticleReadTime(htmlContent, 200);
      
      // Should strip HTML and count only text words
      expect(readTime).toBeGreaterThan(0);
    });

    it('should handle empty content', () => {
      const readTime = estimateArticleReadTime('', 200);
      expect(readTime).toBe(0);
    });
  });
});
