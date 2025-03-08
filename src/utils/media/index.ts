import axios from 'axios';
import config from '../../config';

const cloudName = config.cloudinary.cloudName;
const uploadPreset = config.cloudinary.uploadPreset;
const cloudinaryResourceTypes = {
  image: 'image',
  video: 'video',
};
const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}/`;

console.log({ config });
const axiosStorageClient = axios.create({
  baseURL: baseUrl,
});

const uploadUserProfile = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('asset_folder', 'profile');
  formData.append('overwrite', 'true');
  formData.append('folder', 'profile');
  formData.append('filename_override', userId);
  const response = await axios.post('/api/media/upload', formData);
  return response.data;
};
const uploadUserBanner = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('asset_folder', 'banner');
  formData.append('folder', 'banner');
  formData.append('overwrite', 'true');
  formData.append('filename_override', userId);
  const response = await axios.post('/api/media/upload', formData);
  return response.data;
};

const uploadPostImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('asset_folder', 'images');
  formData.append('folder', 'images');

  try {
    const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const uploadPostVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  const response = await axios.post(`/${cloudinaryResourceTypes.video}/upload`, formData);
  return response.data;
};

export { uploadPostImage, uploadPostVideo, uploadUserBanner, uploadUserProfile };
