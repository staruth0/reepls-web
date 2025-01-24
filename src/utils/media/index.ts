import axios from 'axios';

const cloudName = 'd-id';
const uploadPreset = 'media';
const baseUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const axiosStorageInstance = axios.create({
  baseURL: baseUrl,
});

const uploadUserProfile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);
  const response = await axios.post('/api/media/upload', formData);
  return response.data;
};
const uploadUserBanner = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);
  const response = await axios.post('/api/media/upload', formData);
  return response.data;
};

const uploadPostImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);
  const response = await axios.post('/api/media/upload', formData);
  return response.data;
};

const uploadPostVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);
  const response = await axios.post('/api/media/upload', formData);
  return response.data;
};

export { axiosStorageInstance, uploadPostImage, uploadPostVideo, uploadUserBanner, uploadUserProfile };
