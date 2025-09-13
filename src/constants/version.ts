/**
 * Platform version information
 * This should be updated when releasing new versions
 */
export const PLATFORM_VERSION = 'v1.0.0';

/**
 * Get the current platform version
 * @returns {string} The current platform version
 */
export const getPlatformVersion = (): string => {
  return PLATFORM_VERSION;
};

/**
 * Get version display text for UI components
 * @returns {string} Formatted version text for display
 */
export const getVersionDisplayText = (): string => {
  return `Version ${PLATFORM_VERSION}`;
};
