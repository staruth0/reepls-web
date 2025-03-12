import axios from 'axios';
import config from '../../config';

const cloudName = config.cloudinary.cloudName;
const uploadPreset = config.cloudinary.uploadPreset;
const cloudinaryResourceTypes = {
  image: 'image',
  video: 'video',
  document: 'document',
  gif: 'gif',
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
  formData.append('folder', `profiles`);
  formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
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
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data;
};

const uploadPostImage = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('asset_folder', `images/${userId}`);
  formData.append('folder', 'images');

  try {
    const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const uploadPostVideo = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', 'videos');
  formData.append('asset_folder', `videos/${userId}`);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.video}/upload`, formData);
  return response.data;
};

const uploadArticleThumbnail = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles`);
  formData.append('asset_folder', 'images');
  formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data;
};

const uploadArticleImage = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data;
};

const uploadArticleVideo = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.video}/upload`, formData);
  return response.data;
};

const uploadArticleGif = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.gif}/upload`, formData);
  return response.data;
};

const uploadArticleDocument = async (userId: string, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.document}/upload`, formData);
  return response.data;
};

const fetchUserMedia = async (userId: string): Promise<string[]> => {
  const reponse = await axios.get(`https://res.cloudinary.com/${cloudName}/image/list/${userId}.json`);
  return (reponse?.data?.resources as any[]) || [];
};

export {
  fetchUserMedia,
  uploadArticleDocument,
  uploadArticleGif,
  uploadArticleImage,
  uploadArticleThumbnail,
  uploadArticleVideo,
  uploadPostImage,
  uploadPostVideo,
  uploadUserBanner,
  uploadUserProfile,
};
