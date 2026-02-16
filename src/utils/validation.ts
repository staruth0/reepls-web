// Utility functions for character and word counting validation

export const countWords = (text: string): number => {
  if (!text || text.trim() === '') return 0;
  return text.trim().split(/\s+/).length;
};

export const countCharacters = (text: string): number => {
  return text ? text.length : 0;
};

// Validation limits
export const LIMITS = {
  ARTICLE: {
    TITLE_MAX_CHARS: 80,
    SUBTITLE_MAX_CHARS: 120,
    CONTENT_MAX_WORDS: 2700,
  },
  PODCAST: {
    TITLE_MAX_CHARS: 80,
    SUBTITLE_MAX_CHARS: 120,
    DESCRIPTION_MAX_WORDS: 500,
    DESCRIPTION_MAX_CHARS: 2000,
  },
  PROFILE: {
    NAME_MAX_CHARS: 50,
    USERNAME_MAX_CHARS: 30,
    BIO_MAX_CHARS: 160,
    ABOUT_MAX_CHARS: 1000,
    LOCATION_MAX_CHARS: 100,
  }
} as const;

// Validation functions
export const validateArticleTitle = (title: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(title);
  if (charCount > LIMITS.ARTICLE.TITLE_MAX_CHARS) {
    return {
      isValid: false,
      message: `Title must be ${LIMITS.ARTICLE.TITLE_MAX_CHARS} characters or less (${charCount}/${LIMITS.ARTICLE.TITLE_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validateArticleSubtitle = (subtitle: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(subtitle);
  if (charCount > LIMITS.ARTICLE.SUBTITLE_MAX_CHARS) {
    return {
      isValid: false,
      message: `Subtitle must be ${LIMITS.ARTICLE.SUBTITLE_MAX_CHARS} characters or less (${charCount}/${LIMITS.ARTICLE.SUBTITLE_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validateArticleContent = (content: string): { isValid: boolean; message?: string } => {
  const wordCount = countWords(content);
  if (wordCount > LIMITS.ARTICLE.CONTENT_MAX_WORDS) {
    return {
      isValid: false,
      message: `Content must be ${LIMITS.ARTICLE.CONTENT_MAX_WORDS} words or less (${wordCount}/${LIMITS.ARTICLE.CONTENT_MAX_WORDS})`
    };
  }
  return { isValid: true };
};

export const validatePodcastTitle = (title: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(title);
  if (charCount > LIMITS.PODCAST.TITLE_MAX_CHARS) {
    return {
      isValid: false,
      message: `Title must be ${LIMITS.PODCAST.TITLE_MAX_CHARS} characters or less (${charCount}/${LIMITS.PODCAST.TITLE_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validatePodcastSubtitle = (subtitle: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(subtitle);
  if (charCount > LIMITS.PODCAST.SUBTITLE_MAX_CHARS) {
    return {
      isValid: false,
      message: `Subtitle must be ${LIMITS.PODCAST.SUBTITLE_MAX_CHARS} characters or less (${charCount}/${LIMITS.PODCAST.SUBTITLE_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validatePodcastDescription = (description: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(description);
  
  if (charCount > LIMITS.PODCAST.DESCRIPTION_MAX_CHARS) {
    return {
      isValid: false,
      message: `Description must be ${LIMITS.PODCAST.DESCRIPTION_MAX_CHARS} characters or less (${charCount}/${LIMITS.PODCAST.DESCRIPTION_MAX_CHARS})`
    };
  }
  
  return { isValid: true };
};

// Profile validation functions
export const validateProfileName = (name: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(name);
  if (charCount > LIMITS.PROFILE.NAME_MAX_CHARS) {
    return {
      isValid: false,
      message: `Name must be ${LIMITS.PROFILE.NAME_MAX_CHARS} characters or less (${charCount}/${LIMITS.PROFILE.NAME_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validateProfileUsername = (username: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(username);
  if (charCount > LIMITS.PROFILE.USERNAME_MAX_CHARS) {
    return {
      isValid: false,
      message: `Username must be ${LIMITS.PROFILE.USERNAME_MAX_CHARS} characters or less (${charCount}/${LIMITS.PROFILE.USERNAME_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validateProfileBio = (bio: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(bio);
  if (charCount > LIMITS.PROFILE.BIO_MAX_CHARS) {
    return {
      isValid: false,
      message: `Bio must be ${LIMITS.PROFILE.BIO_MAX_CHARS} characters or less (${charCount}/${LIMITS.PROFILE.BIO_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validateProfileAbout = (about: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(about);
  if (charCount > LIMITS.PROFILE.ABOUT_MAX_CHARS) {
    return {
      isValid: false,
      message: `About must be ${LIMITS.PROFILE.ABOUT_MAX_CHARS} characters or less (${charCount}/${LIMITS.PROFILE.ABOUT_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

export const validateProfileLocation = (location: string): { isValid: boolean; message?: string } => {
  const charCount = countCharacters(location);
  if (charCount > LIMITS.PROFILE.LOCATION_MAX_CHARS) {
    return {
      isValid: false,
      message: `Location must be ${LIMITS.PROFILE.LOCATION_MAX_CHARS} characters or less (${charCount}/${LIMITS.PROFILE.LOCATION_MAX_CHARS})`
    };
  }
  return { isValid: true };
};

// Character/word count display helpers
export const getCharacterCountDisplay = (text: string, maxChars: number): string => {
  const count = countCharacters(text);
  return `${count}/${maxChars}`;
};

export const getWordCountDisplay = (text: string, maxWords: number): string => {
  const count = countWords(text);
  return `${count}/${maxWords}`;
};

export const getCharacterCountColor = (text: string, maxChars: number): string => {
  const count = countCharacters(text);
  const percentage = (count / maxChars) * 100;
  
  if (percentage >= 100) return 'text-red-500';
  if (percentage >= 80) return 'text-yellow-500';
  return 'text-gray-400';
};

export const getWordCountColor = (text: string, maxWords: number): string => {
  const count = countWords(text);
  const percentage = (count / maxWords) * 100;
  
  if (percentage >= 100) return 'text-red-500';
  if (percentage >= 80) return 'text-yellow-500';
  return 'text-gray-400';
};
