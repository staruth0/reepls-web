import React, { useState, useRef } from 'react';
import { LuImagePlus, LuMic, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import axios from 'axios';

import Topbar from '../../../components/atoms/Topbar/Topbar';
import HamburgerMenu from '../components/HamburgerMenupopup';
import AddTagsModal from '../components/AddTagModal';
import AddCategoryModal from '../components/AddCategoryModal';
import PodcastPreviewModal from '../components/PodcastPreview';
import { apiClient1 } from '../../../services/apiClient';
import { useUser } from '../../../hooks/useUser';
import { t } from 'i18next';
import { cn } from '../../../utils';
import { uploadPodcastThumbnail } from '../../../utils/media';
import UploadProgressModal from '../components/UploadProgressModal';
import { 
  validatePodcastTitle, 
  validatePodcastSubtitle, 
  validatePodcastDescription,
  getCharacterCountDisplay,
  getCharacterCountColor,
  LIMITS
} from '../../../utils/validation';

const Podcast: React.FC = () => {
  // State for form fields
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(true);

  // State for modals
  const [showTagsModal, setShowTagsModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // State for upload process
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Refs for file inputs
  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const { authUser, isLoggedIn } = useUser();

  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file for the thumbnail.');
        toast.error('Please upload a valid image file for the thumbnail.');
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        setError('Thumbnail image must be less than 5MB.');
        toast.error('Thumbnail image must be less than 5MB.');
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        return;
      }

      try {
        setIsUploadingThumbnail(true);
        setShowUploadModal(true);
        setThumbnailPreview(URL.createObjectURL(file));
 
        
        // Upload to Cloudinary
        const url = await uploadThumbnail(file);
        setThumbnailUrl(url);
        
        toast.success('Thumbnail uploaded successfully!');
      } catch (error) {
        console.error('Thumbnail upload failed:', error);
        setError('Failed to upload thumbnail');
        toast.error('Failed to upload thumbnail');
        setThumbnailPreview('');
   
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      } finally {
        setIsUploadingThumbnail(false);
        setShowUploadModal(false);
      }
    }
  };

  const uploadThumbnail = async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("User not authenticated"));
      throw new Error("User not authenticated");
    }
    return await uploadPodcastThumbnail(authUser.id, file);
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
    setThumbnailUrl('');
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

  const handlePost = async () => {
    // Validate title
    const titleValidation = validatePodcastTitle(title);
    if (!titleValidation.isValid) {
      setError(titleValidation.message || '');
      toast.error(titleValidation.message, { autoClose: 3000 });
      return;
    }
    
    // Validate subtitle (optional but with character limit)
    if (subtitle) {
      const subtitleValidation = validatePodcastSubtitle(subtitle);
      if (!subtitleValidation.isValid) {
        setError(subtitleValidation.message || '');
        toast.error(subtitleValidation.message, { autoClose: 3000 });
        return;
      }
    }
    
    // Validate description
    const descriptionValidation = validatePodcastDescription(description);
    if (!descriptionValidation.isValid) {
      setError(descriptionValidation.message || '');
      toast.error(descriptionValidation.message, { autoClose: 3000 });
      return;
    }
    
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
    setShowUploadModal(true);
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
    if (thumbnailUrl) {
      formData.append('thumbnailUrl', thumbnailUrl);
    }

    try {
      await apiClient1.post(
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

      toast.success('Podcast posted successfully!');
      // Reset form
      setTitle('');
      setSubtitle('');
      setDescription('');

      setThumbnailPreview('');
      setThumbnailUrl('');
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
      setShowUploadModal(false);
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
              disabled={isPosting || isUploadingThumbnail || !isLoggedIn}
              className={cn(
                'py-3 px-10 rounded-full border',
                isLoggedIn && !isPosting && !isUploadingThumbnail
                  ? 'border-primary-300 cursor-pointer hover:bg-primary-50 focus:bg-primary-50'
                  : 'border-neutral-500 text-neutral-500 cursor-not-allowed',
                'transition-all duration-300 ease-in-out'
              )}
            >
              Publish
            </button>
          </div>
        </div>
      </Topbar>

      <div className="flex-1 px-8 md:px-20 py-10 p-6 overflow-y-auto">
        {/* File upload section */}
        <div className="flex gap-4 mb-8">
          <label htmlFor="thumbnail-upload" className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors duration-200 ${
            isUploadingThumbnail ? 'bg-neutral-600' : 'bg-neutral-700 hover:bg-neutral-600'
          }`}>
            <LuImagePlus className="size-5 text-neutral-50" />
            <span className="text-sm font-medium">
              {isUploadingThumbnail ? 'Uploading...' : 'Add Thumbnail Image'}
            </span>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              onChange={handleThumbnailUpload}
              className="hidden"
              ref={thumbnailInputRef}
              disabled={isUploadingThumbnail || isPosting}
            />
          </label>
          <label htmlFor="audio-upload" className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md cursor-pointer transition-colors duration-200">
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

        {/* Thumbnail preview */}
        {(thumbnailPreview || thumbnailUrl) && (
          <div className="mb-6">
            <div className="relative inline-block">
              <img
                src={thumbnailPreview || thumbnailUrl}
                alt="Podcast thumbnail"
                className="max-w-xs max-h-48 rounded-lg shadow-lg"
              />
              <button
                type="button"
                onClick={handleRemoveThumbnail}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                title="Remove thumbnail"
                disabled={isUploadingThumbnail}
              >
                <LuX className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Audio preview */}
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

        {/* Form fields */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Title of Podcast here"
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= LIMITS.PODCAST.TITLE_MAX_CHARS) {
                  setTitle(e.target.value);
                }
              }}
              className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl font-semibold pr-16"
              maxLength={LIMITS.PODCAST.TITLE_MAX_CHARS}
              disabled={isPosting}
            />
            <div className="absolute bottom-2 right-3 text-xs">
              <span className={getCharacterCountColor(title, LIMITS.PODCAST.TITLE_MAX_CHARS)}>
                {getCharacterCountDisplay(title, LIMITS.PODCAST.TITLE_MAX_CHARS)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Subtitle here (optional)"
              value={subtitle}
              onChange={(e) => {
                if (e.target.value.length <= LIMITS.PODCAST.SUBTITLE_MAX_CHARS) {
                  setSubtitle(e.target.value);
                }
              }}
              className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg pr-16"
              maxLength={LIMITS.PODCAST.SUBTITLE_MAX_CHARS}
              disabled={isPosting}
            />
            <div className="absolute bottom-2 right-3 text-xs">
              <span className={getCharacterCountColor(subtitle, LIMITS.PODCAST.SUBTITLE_MAX_CHARS)}>
                {getCharacterCountDisplay(subtitle, LIMITS.PODCAST.SUBTITLE_MAX_CHARS)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <textarea
              placeholder="Description of your podcast here..."
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= LIMITS.PODCAST.DESCRIPTION_MAX_CHARS) {
                  setDescription(e.target.value);
                }
              }}
              rows={8}
              className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y pr-3 md:pr-32"
              maxLength={LIMITS.PODCAST.DESCRIPTION_MAX_CHARS}
              disabled={isPosting}
            ></textarea>
            {/* Desktop: Show count inside textarea */}
            <div className="absolute bottom-3 right-4 text-xs hidden md:block">
              <div className="text-right">
                <div className={getCharacterCountColor(description, LIMITS.PODCAST.DESCRIPTION_MAX_CHARS)}>
                  {getCharacterCountDisplay(description, LIMITS.PODCAST.DESCRIPTION_MAX_CHARS)} chars
                </div>
              </div>
            </div>
          </div>
          {/* Mobile: Show count below textarea */}
          <div className="flex justify-end mt-2 text-xs md:hidden">
            <div className="text-right">
              <div className={getCharacterCountColor(description, LIMITS.PODCAST.DESCRIPTION_MAX_CHARS)}>
                {getCharacterCountDisplay(description, LIMITS.PODCAST.DESCRIPTION_MAX_CHARS)} chars
              </div>
            </div>
          </div>
        </div>

        {/* Tags and category */}
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

        {/* Privacy toggle */}
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

        {/* Error message */}
        {error && (
          <div className="error-message bg-red-800 text-white p-3 rounded-md my-4">
            <span className="error-icon">⚠️</span>
            <span className="error-text ml-2">{error}</span>
          </div>
        )}
      </div>

      {/* Modals */}
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
          thumbnailUrl,
          audioFile,
          tags,
          category,
        }}
      />
      <UploadProgressModal
        isOpen={showUploadModal}
        progress={uploadProgress}
        message={isUploadingThumbnail ? "Uploading thumbnail..." : "Publishing podcast..."}
      />
    </div>
  );
};

export default Podcast;