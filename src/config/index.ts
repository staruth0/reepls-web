const config = {
  cloudinary: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    version: import.meta.env.VITE_API_VERSION,
  },
};

export default config;
