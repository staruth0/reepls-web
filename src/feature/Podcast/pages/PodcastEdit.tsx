import React, { useState, useRef, useEffect } from 'react';
import { LuImagePlus, LuMic, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import HamburgerMenu from '../components/HamburgerMenupopup';
import AddTagsModal from '../components/AddTagModal';
import AddCategoryModal from '../components/AddCategoryModal';
import PodcastPreviewModal from '../components/PodcastPreview';
import UploadProgressModal from '../components/UploadProgressModal';

import { apiClient1 } from '../../../services/apiClient';
import { useUser } from '../../../hooks/useUser';
import { cn } from '../../../utils';
import { uploadPodcastThumbnail } from '../../../utils/media';
import { useGetPodcastById, useUpdatePodcastMetadata } from '../hooks';
import { useParams } from 'react-router-dom';
import { 
  validatePodcastTitle, 
  validatePodcastSubtitle, 
  validatePodcastDescription,
  getCharacterCountDisplay,
  getCharacterCountColor,
  LIMITS
} from '../../../utils/validation';



const EditPodcast: React.FC= () => {
  const { authUser, isLoggedIn } = useUser();
  const { id } = useParams<{ id: string }>();

  // Fetch podcast data
  const { data: podcastData, isLoading, isError } = useGetPodcastById(id || "");

  // State for form fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  // const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreview, setAudioPreview] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  // Modals
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload states
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  // const [isPosting, setIsPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const audioInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const updateMetadata = useUpdatePodcastMetadata();

  // Prefill form when podcast data loads
  useEffect(() => {
    if (podcastData?.success && podcastData.data) {
      const p = podcastData.data;
      setTitle(p.title || '');
      setSubtitle(p.subtitle || '');
      setDescription(p.description || '');
      setTags(p.tags || []);
      setCategory(p.category || '');
      setIsPublic(p.isPublic ?? true);
      setThumbnailUrl(p.thumbnailUrl || '');
      setThumbnailPreview(p.thumbnailUrl || '');
      setAudioPreview(p.audio?.url || '');
    }
  }, [podcastData]);

  // Thumbnail upload handler
  const handleThumbnailUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file for the thumbnail.');
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Thumbnail image must be less than 5MB.');
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
        return;
      }

      try {
        setIsUploadingThumbnail(true);
        setShowUploadModal(true);
        setThumbnailPreview(URL.createObjectURL(file));
     

        // Upload to Cloudinary
        const url = await uploadPodcastThumbnail(authUser!.id || '', file);
        setThumbnailUrl(url);
        toast.success('Thumbnail uploaded successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload thumbnail.');
   
        setThumbnailPreview('');
      } finally {
        setIsUploadingThumbnail(false);
        setShowUploadModal(false);
      }
    }
  };

  const handleRemoveThumbnail = () => {

    setThumbnailUrl('');
    setThumbnailPreview('');
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
    toast.info('Thumbnail removed');
  };

  const handleAudioFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload a valid audio file.');
        if (audioInputRef.current) audioInputRef.current.value = '';
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Audio file size must be less than 50MB.');
        if (audioInputRef.current) audioInputRef.current.value = '';
        return;
      }
      setAudioFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAudioPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      toast.success('Audio file selected!');
    }
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioPreview(podcastData?.data?.audio?.url || '');
    if (audioInputRef.current) audioInputRef.current.value = '';
    toast.info('Audio file removed');
  };

  // Metadata update
  const handleUpdateMetadata = async () => {
    if(!id)return
    
    // Validate title
    const titleValidation = validatePodcastTitle(title);
    if (!titleValidation.isValid) {
      toast.error(titleValidation.message, { autoClose: 3000 });
      return;
    }
    
    // Validate subtitle (optional but with character limit)
    if (subtitle) {
      const subtitleValidation = validatePodcastSubtitle(subtitle);
      if (!subtitleValidation.isValid) {
        toast.error(subtitleValidation.message, { autoClose: 3000 });
        return;
      }
    }
    
    // Validate description
    const descriptionValidation = validatePodcastDescription(description);
    if (!descriptionValidation.isValid) {
      toast.error(descriptionValidation.message, { autoClose: 3000 });
      return;
    }
    
    if (!title.trim() || !description.trim()) {
      toast.error('Title and description cannot be empty.');
      return;
    }

    updateMetadata.mutate(
      {
        podcastId: id,
        payload: { title, description, tags, category, isPublic }
      },
      {
        onSuccess: () => toast.success('Podcast metadata updated successfully!'),
        onError: (err) => {
          console.error(err);
          toast.error('Failed to update podcast metadata');
        }
      }
    );
  };

  // Audio update
  const handleUpdateAudio = async () => {
    if (!audioFile) {
      toast.error('Please select an audio file');
      return;
    }
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      setShowUploadModal(true);
      await apiClient1.put(`/podcasts/${id}/audio`, formData, {
        onUploadProgress: (progressEvent) => {
          setUploadProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0)));
        },
      });
      toast.success('Audio updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update audio');
    } finally {
      setShowUploadModal(false);
      setUploadProgress(0);
    }
  };

 const handleSaveTags = (newTags: string[]) => {
  setTags(prevTags => {

    const combinedTags = Array.from(new Set([...prevTags, ...newTags]));
    return combinedTags;
  });
  toast.success('Tags updated!');
};


  const handleSaveCategory = (newCategory: string) => {
    setCategory(newCategory);
    toast.success(`Category set to: ${newCategory}`);
  };

  const handlePreview = () => setShowPreviewModal(true);

  if (isLoading) return <div>Loading podcast...</div>;
  if (isError || !podcastData?.success) return <div>Failed to load podcast data</div>;

  return (
    <div className="min-h-screen bg-neutral-800 text-neutral-50 flex flex-col relative">
      <Topbar>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-50">Edit Podcast</h1>
          <div className="flex items-center gap-4">
            <HamburgerMenu
              onPreviewClick={handlePreview}
              onAddTagsClick={() => setShowTagsModal(true)}
              onAddCategoryClick={() => setShowCategoryModal(true)}
            />
            <button
              onClick={handleUpdateMetadata}
              disabled={updateMetadata.isPending || isUploadingThumbnail || !isLoggedIn}
              className={cn(
                'py-3 px-10 rounded-full border',
                isLoggedIn && !updateMetadata.isPending && !isUploadingThumbnail
                  ? 'border-primary-300 cursor-pointer hover:bg-primary-50 focus:bg-primary-50'
                  : 'border-neutral-500 text-neutral-500 cursor-not-allowed',
                'transition-all duration-300 ease-in-out'
              )}
            >
             {updateMetadata.isPending?  'Saving...' : 'Save Metadata'}
            </button>
            <button
              onClick={handleUpdateAudio}
              disabled={updateMetadata.isPending || !audioFile || !isLoggedIn}
              className={cn(
                'py-3 px-10 rounded-full border',
                isLoggedIn && !updateMetadata.isPending && audioFile
                  ? 'border-primary-300 cursor-pointer hover:bg-primary-50 focus:bg-primary-50'
                  : 'border-neutral-500 text-neutral-500 cursor-not-allowed',
                'transition-all duration-300 ease-in-out'
              )}
            >
              Update Audio
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
              disabled={isUploadingThumbnail || updateMetadata.isPending }
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
              disabled={updateMetadata.isPending }
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
              <audio controls className="w-full" src={audioPreview}>
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
              disabled={updateMetadata.isPending }
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
              disabled={updateMetadata.isPending }
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
              className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y pr-20"
              maxLength={LIMITS.PODCAST.DESCRIPTION_MAX_CHARS}
              disabled={updateMetadata.isPending }
            ></textarea>
            <div className="absolute bottom-2 right-3 text-xs">
              <div className="text-right">
                <div className={getCharacterCountColor(description, LIMITS.PODCAST.DESCRIPTION_MAX_CHARS)}>
                  {getCharacterCountDisplay(description, LIMITS.PODCAST.DESCRIPTION_MAX_CHARS)} chars
                </div>
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
            disabled={updateMetadata.isPending }
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
        message={isUploadingThumbnail ? "Uploading thumbnail..." : "Updating podcast..."}
      />
    </div>
  );
};

export default EditPodcast;
