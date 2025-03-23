// import config from '../config';

import config from '../config';

const MAX_IMAGE_COUNT = 10;
const MAX_VIDEO_COUNT = 4;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

const SHORT_POST_LENGTH = 2500;

const PREVIEW_SLUG = 'preview'; //'preview';

const allowedImageTypes = ['jpeg', 'png', 'jpg', 'webp'];
const allowedVideoTypes = [
  'quicktime',
  'mp4',
  'avi',
  'mov',
  'wmv',
  'flv',
  'webm',
  'mkv',
  'mpg',
  'mpeg',
  'm4v',
  '3gp',
  '3g2',
  'm3u8',
  'ts',
  'mxf',
  'roq',
  'webm',
  'ogv',
  'ogg',
  'mts',
  'm2ts',
  'ismv',
  'f4v',
  'f4p',
  'f4a',
  'f4b',
];

// All about the api
const API_BASE_URL = config.api.baseUrl;
const API_VERSION = config.api.version || '/api-v1';
const API_URL = `${API_BASE_URL}${API_VERSION}`;

const AUTH_TOKEN_KEY = 'AuthToken';
const ACCESS_TOKEN_KEY = 'AccessToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';

// Key for storing in localStorage
const STORAGE_KEY = 'encryptedLoginData';

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
  STORAGE_KEY,
};
