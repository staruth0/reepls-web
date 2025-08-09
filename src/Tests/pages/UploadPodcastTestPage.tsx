import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useUser } from '../../hooks/useUser';
import { apiClient } from '../../services/apiClient';

// Define the shape of the form data
interface IFormData {
  title: string;
  description: string;
  tags: string;
  isPublic: boolean;
  authorId: string;
}

const UploadPodcastTestPage: React.FC = () => {

  const {authUser} = useUser()
  // State for form data
  const [formData, setFormData] = useState<IFormData>({
    title: '',
    description: '',
    tags: '',
    isPublic: true,
    authorId: authUser?.id || '',
  });

  // State for the selected audio file
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // State for UI feedback
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // Base URL for the API
  const API_BASE_URL = 'https://reepls-api.onrender.com/api-v1';

  // Handle changes in text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for the 'isPublic' checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    } else {
      setAudioFile(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setIsError(false);

    if (!audioFile || !formData.title || !formData.authorId) {
      setMessage('Please fill out all required fields (Title, Author ID) and select an audio file.');
      setIsError(true);
      setIsLoading(false);
      return;
    }

    // Create a FormData object to send the multipart/form-data
    const data = new FormData();
    data.append('podcast_audio_file', audioFile);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('authorId', formData.authorId);
    data.append('isPublic', formData.isPublic.toString());
    
    // Add tags only if they are not empty
    if (formData.tags) {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim());
      tagsArray.forEach(tag => data.append('tags', tag));
    }

    try {
      // Make the API call to the upload endpoint
      const response = await apiClient.post(`/podcasts/standalone`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle a successful response
      setMessage(`Success! Podcast uploaded with ID: ${response.data.id}`);
      setIsError(false);
      
      // Optionally, reset the form after successful upload
      setFormData({
        title: '',
        description: '',
        tags: '',
        isPublic: true,
        authorId: '',
      });
      setAudioFile(null);

    } catch (error: unknown) {
      // Handle errors
      setIsError(true);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        const errorMessage = (axiosError.response?.data as { message?: string })?.message || 'An unknown error occurred.';
        setMessage(`Error: ${errorMessage}`);
      } else {
        setMessage('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Upload New Podcast</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Podcast Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              required
            />
          </div>

          {/* Author ID Input */}
          <div>
            <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">
              Author ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="authorId"
              name="authorId"
              value={formData.authorId}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          {/* Tags Input */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            />
          </div>

          {/* Is Public Checkbox */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                checked={formData.isPublic}
                onChange={handleCheckboxChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isPublic" className="font-medium text-gray-700">
                Public Podcast
              </label>
              <p className="text-gray-500">
                If checked, the podcast will be publicly available immediately.
              </p>
            </div>
          </div>
          
          {/* Audio File Input */}
          <div>
            <label htmlFor="podcast_audio_file" className="block text-sm font-medium text-gray-700">
              Audio File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="podcast_audio_file"
              name="podcast_audio_file"
              accept="audio/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              required
            />
          </div>
          
          {/* Submission Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? 'Uploading...' : 'Upload Podcast'}
            </button>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`mt-4 p-4 rounded-md ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              <p>{message}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadPodcastTestPage;