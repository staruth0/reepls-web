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

const uploadUserProfile = async (userId: string, file: File): Promise<string> => {
  console.log('userid present in edit profile',userId)
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('asset_folder', 'profiles');
  // formData.append('overwrite', 'true');
  formData.append('folder', `profiles`);
  // formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data.secure_url;
};
const uploadUserBanner = async (userId: string, file: File): Promise<string> => {
  console.log('userid present in edit profile',userId)
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('asset_folder', 'banners');
  formData.append('folder', 'banners');
  // formData.append('overwrite', 'true');
  // formData.append('filename_override', userId);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data.secure_url;
};

const uploadPostImage = async (userId: string, file: File): Promise<string> => {

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('asset_folder', `images/${userId}`);
  formData.append('folder', 'images');

  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data.secure_url;
};

const uploadPostVideo = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', 'videos');
  formData.append('asset_folder', `videos/${userId}`);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.video}/upload`, formData);
  return response.data.secure_url;
};

const uploadArticleThumbnail = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles`);
  formData.append('asset_folder', `articles/${userId}`);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data.secure_url;
};

const uploadArticleImage = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('asset_folder', `articles/${userId}`);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.image}/upload`, formData);
  return response.data.secure_url;
};

const uploadArticleVideo = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('asset_folder', `articles/${userId}`);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.video}/upload`, formData);
  return response.data.secure_url;
};

const uploadArticleGif = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('asset_folder', `articles/${userId}`);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.gif}/upload`, formData);
  return response.data.secure_url;
};

const uploadArticleDocument = async (userId: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('cloud_name', cloudName as string);
  formData.append('folder', `articles/${userId}`);
  formData.append('asset_folder', `articles/${userId}`);
  const response = await axiosStorageClient.post(`/${cloudinaryResourceTypes.document}/upload`, formData);
  return response.data.secure_url;
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
