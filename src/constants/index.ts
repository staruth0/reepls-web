const MAX_IMAGE_COUNT = 4;
const MAX_VIDEO_COUNT = 1;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const SHORT_POST_LENGTH = 500;

const PREVIEW_SLUG = 'preview';

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const allowedVideoTypes = [
  'video/quicktime',
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/wmv',
  'video/flv',
  'video/webm',
  'video/mkv',
  'video/mpg',
  'video/mpeg',
  'video/m4v',
  'video/3gp',
  'video/3g2',
  'video/m3u8',
  'video/ts',
  'video/mxf',
  'video/roq',
  'video/webm',
  'video/ogv',
  'video/ogg',
  'video/mts',
  'video/m2ts',
  'video/m3u8',
  'video/ismv',
  'video/f4v',
  'video/f4p',
  'video/f4a',
  'video/f4b',
];

// All about the api
const API_BASE_URL = 'https://saah-server.vercel.app';
const API_VERSION = '/api-v1';
const API_URL = `${API_BASE_URL}${API_VERSION}`;

const AUTH_TOKEN_KEY = 'AuthToken';
const ACCESS_TOKEN_KEY = 'AccessToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';

export {
  ACCESS_TOKEN_KEY,
  allowedImageTypes,
  allowedVideoTypes,
  API_BASE_URL,
  API_URL,
  AUTH_TOKEN_KEY,
  MAX_IMAGE_COUNT,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_COUNT,
  MAX_VIDEO_SIZE,
  PREVIEW_SLUG,
  REFRESH_TOKEN_KEY,
  SHORT_POST_LENGTH,
};
