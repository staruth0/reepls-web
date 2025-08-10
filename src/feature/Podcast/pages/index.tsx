import React, { useState, useRef } from 'react';
import { LuImagePlus, LuMic, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import axios from 'axios';


import Topbar from '../../../components/atoms/Topbar/Topbar';
import HamburgerMenu from '../components/HamburgerMenupopup';
import AddTagsModal from '../components/AddTagModal';
import AddCategoryModal from '../components/AddCategoryModal';
import PodcastPreviewModal from '../components/PodcastPreview';
import { apiClient } from '../../../services/apiClient';

const Podcast: React.FC = () => {
  // Your original state management
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);
 
  // State for modals
  const [showTagsModal, setShowTagsModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // New state for handling upload process
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for file inputs to reset them
  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file for the thumbnail.');
        toast.error('Please upload a valid image file for the thumbnail.');
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        return;
      }
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      toast.success('Thumbnail image selected!');
    }
  };

  const handleAudioFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('audio/')) {
        setError('Please upload a valid audio file.');
        toast.error('Please upload a valid audio file.');
        if (audioInputRef.current) audioInputRef.current.value = '';
        return;
      }
      // Add a file size check for audio
      if (file.size > 50 * 1024 * 1024) {
        setError('Audio file size must be less than 50MB.');
        toast.error('Audio file size must be less than 50MB.');
        if (audioInputRef.current) audioInputRef.current.value = '';
        return;
      }
      setAudioFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAudioPreview(e.target?.result as string);
      reader.onerror = () => {
        setError('Error reading audio file.');
        toast.error('Error reading audio file.');
      };
      reader.readAsDataURL(file);
      toast.success('Audio file selected!');
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    toast.info('Thumbnail removed');
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioPreview('');
    if (audioInputRef.current) audioInputRef.current.value = '';
    toast.info('Audio file removed');
  };

  // The main function to handle submission with detailed error handling and progress tracking
  const handlePost = async () => {
  
    if (!title.trim()) {
      const err = 'Podcast title cannot be empty.';
      setError(err);
      toast.error(err);
      return;
    }
    if (!description.trim()) {
      const err = 'Podcast description cannot be empty.';
      setError(err);
      toast.error(err);
      return;
    }
    if (!audioFile) {
      const err = 'Please upload an audio file for your podcast.';
      setError(err);
      toast.error(err);
      return;
    }

    setIsPosting(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('title', title);
    if (subtitle.trim()) {
      formData.append('subtitle', subtitle.trim());
    }
    formData.append('description', description);
    formData.append('isPublic', isPublic.toString());

    if (tags.length > 0) {
      formData.append('tags', JSON.stringify(tags));
    }
    if (category.trim()) {
      formData.append('category', category.trim());
    }

    if (audioFile) {
      formData.append('audio', audioFile);
    }
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }

    try {
      const { data } = await apiClient.post(
        '/podcasts/standalone',
        formData,
        {
         
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? 0)
            );
            setUploadProgress(percentCompleted);
          },
        }
      );
   console.log('data', data)

      toast.success('Podcast posted successfully!');
      // Reset form fields upon success
      setTitle('');
      setSubtitle('');
      setDescription('');
      setThumbnailFile(null);
      setThumbnailPreview('');
      setAudioFile(null);
      setAudioPreview('');
      setTags([]);
      setCategory('');
      setIsPublic(true);
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';

    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Upload failed';
      let errorDetails = '';

      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        errorMessage = `Upload failed: ${status} ${err.response.statusText}`;
        if (err.response.data) {
          errorDetails = typeof err.response.data === 'string'
            ? err.response.data
            : err.response.data.message || err.response.data.error || 'Unknown server error';
        }

        if (status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (status === 400) {
          errorMessage = 'Invalid request data.';
        }
      } else if (axios.isAxiosError(err) && err.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      }

      const fullError = errorDetails ? `${errorMessage}: ${errorDetails}` : errorMessage;
      setError(fullError);
      toast.error(fullError);
    } finally {
      setIsPosting(false);
      setUploadProgress(0);
    }
  };

  const handleSaveTags = (newTags: string[]) => {
    setTags(newTags);
    toast.success('Tags updated!');
  };

  const handleSaveCategory = (newCategory: string) => {
    setCategory(newCategory);
    toast.success(`Category set to: ${newCategory}`);
  };

  const handlePreview = () => {
    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-neutral-50 flex flex-col relative">
      <Topbar>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-50">New Podcast</h1>
          <div className="flex items-center gap-4">
            <HamburgerMenu
              onPreviewClick={handlePreview}
              onAddTagsClick={() => setShowTagsModal(true)}
              onAddCategoryClick={() => setShowCategoryModal(true)}
            />
            <button
              onClick={handlePost}
              disabled={isPosting}
              className="bg-primary-400 text-white font-bold text-md py-2 px-6 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </Topbar>

      <div className="flex-1 px-8 md:px-20 py-10 p-6 overflow-y-auto">
        <div className="flex gap-4 mb-8">
          <label htmlFor="thumbnail-upload" className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md cursor-pointer transition-colors duration-200">
            <LuImagePlus className="size-5 text-neutral-50" />
            <span className="text-sm font-medium">Add Thumbnail Image</span>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
              ref={thumbnailInputRef}
              disabled={isPosting}
            />
          </label>
          <label className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md cursor-pointer transition-colors duration-200">
            <LuMic className="size-5 text-neutral-50" />
            <span className="text-sm font-medium">Add Audio</span>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleAudioFileSelect}
              className="hidden"
              ref={audioInputRef}
              disabled={isPosting}
            />
          </label>
        </div>

        {thumbnailPreview && (
          <div className="mb-6">
            <div className="relative inline-block">
              <img
                src={thumbnailPreview}
                alt="Podcast thumbnail"
                className="max-w-xs max-h-48 rounded-lg shadow-lg"
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                title="Remove thumbnail"
              >
                <LuX className="size-4" />
              </button>
            </div>
          </div>
        )}

        {audioPreview && (
          <div className="mb-6">
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-300">
                  {audioFile?.name || 'Audio File'}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveAudio}
                  className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  title="Remove audio"
                >
                  <LuX className="size-4" />
                </button>
              </div>
              <audio
                controls
                className="w-full"
                src={audioPreview}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Title of Podcast here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl font-semibold"
            disabled={isPosting}
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Subtitle here (optional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            disabled={isPosting}
          />
        </div>

        <div className="mb-6">
          <textarea
            placeholder="Description of your podcast here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
            disabled={isPosting}
          ></textarea>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 text-neutral-300 text-sm">
          {tags.length > 0 && (
            <div className="bg-neutral-700 px-3 py-1 rounded-full">
              Tags: {tags.join(', ')}
            </div>
          )}
          {category && (
            <div className="bg-neutral-700 px-3 py-1 rounded-full">
              Category: {category}
            </div>
          )}
        </div>

        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out bg-neutral-700 border-neutral-600 rounded"
            disabled={isPosting}
          />
          <label htmlFor="isPublic" className="text-neutral-300">
            Make Public
          </label>
        </div>

        {isPosting && (
          <div className="progress-container my-4">
            <div className="w-full bg-neutral-700 rounded-full h-2.5">
              <div
                className="bg-green-500 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <span className="progress-text text-sm mt-2 block">
              Uploading... {uploadProgress}%
            </span>
          </div>
        )}

        {error && (
          <div className="error-message bg-red-800 text-white p-3 rounded-md my-4">
            <span className="error-icon">⚠️</span>
            <span className="error-text ml-2">{error}</span>
          </div>
        )}
      </div>

      <AddTagsModal
        isOpen={showTagsModal}
        onClose={() => setShowTagsModal(false)}
        onSave={handleSaveTags}
        initialTags={tags}
      />
      <AddCategoryModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        onSave={handleSaveCategory}
        initialCategory={category}
      />
      
      <PodcastPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        data={{
          title,
          subtitle,
          description,
          thumbnailFile,
          audioFile,
          tags,
          category,
        }}
      />
    </div>
  );
};

export default Podcast;