// src/pages/Podcast/Podcast.tsx
import React, { useState, useRef } from 'react';
import { LuImagePlus, LuMic, LuX } from 'react-icons/lu';
import { toast } from 'react-toastify';
import { useUploadStandalonePodcast } from '../hooks';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import HamburgerMenu from '../components/HamburgerMenupopup';
import AddTagsModal from '../components/AddTagModal';
import AddCategoryModal from '../components/AddCategoryModal';

import PodcastPreviewModal from '../components/PodcastPreview';

const Podcast: React.FC = () => {
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

  // Ref for the audio upload button to position the AudioUploadOptionsModal
  const audioUploadButtonRef = useRef<HTMLLabelElement>(null);
 

  const { mutate: uploadPodcast, isPending: isPosting } = useUploadStandalonePodcast();

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file for the thumbnail.');
        return;
      }
      setThumbnailFile(file);
      
      // preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      toast.success('Thumbnail image selected!');
    }
  };

  const handleAudioFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload an audio file.');
        return;
      }
      setAudioFile(file);
  
      // preview URL for audio
      const reader = new FileReader();
      reader.onload = (e) => {
        setAudioPreview(e.target?.result as string);
      
      };
      reader.onerror = () => { //ERROR HANDLING
      
        toast.error('Error reading audio file.');
      };
      reader.readAsDataURL(file);
  
      toast.success('Audio file selected!');
    }
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview('');
    toast.info('Thumbnail removed');
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setAudioPreview('');
    toast.info('Audio file removed');
  };


  const handlePost = () => {
    if (!title.trim()) {
      toast.error('Podcast title cannot be empty.');
      return;
    }
    if (!description.trim()) {
      toast.error('Podcast description cannot be empty.');
      return;
    }
    if (!audioFile) {
      toast.error('Please upload an audio file for your podcast.');
      return;
    }
  

    const formData = new FormData();
    formData.append('title', title);
    // Append subtitle only if it has a value
    if (subtitle.trim()) {
      formData.append('subtitle', subtitle.trim());
    }
    formData.append('description', description);
    // tags.forEach((tag) => formData.append('tags', tag)); // Append each tag as a separate entry
    formData.append('category', category);


    console.log('audiofile', audioFile )


    if (audioFile) {
      formData.append('audio', audioFile);
    }
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile); 
    }

    console.log('--- FormData Contents ---');
    const formDataObject = Object.fromEntries(formData.entries());
    console.log(formDataObject);

    uploadPodcast(formData, {
      onSuccess: () => {
        toast.success('Podcast posted successfully!');
        // Reset form fields
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
      },
      onError: (error: any) => { // Use 'any' for error type if you don't have a specific error interface
        toast.error(`Failed to post podcast: ${error.message || 'Unknown error'}`);
      },
    });
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
    <div className="min-h-screen bg-neutral-800 text-neutral-50 flex flex-col relative"> {/* Added relative for positioning modals */}
      <Topbar>
        <div className="w-full flex items-center justify-between">
          <h1 className="text-lg font-semibold text-neutral-50">New Podcast</h1>
          <div className="flex items-center gap-4">
            {/* Hamburger Menu */}
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
            />
          </label>

          {/* Audio Upload Button - now opens a modal */}
          <label
            ref={audioUploadButtonRef} // Attach ref here
            className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md cursor-pointer transition-colors duration-200"
          >
            <LuMic className="size-5 text-neutral-50" />
            <span className="text-sm font-medium">Add Audio</span>
            {/* Hidden input for actual file selection */}
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleAudioFileSelect} // This handles the file selection
              className="hidden"
            />
          </label>
        </div>

        {/* Thumbnail Preview */}
        {thumbnailPreview && (
          <div className="mb-6">
            <div className="relative inline-block">
              <img
                src={thumbnailPreview}
                alt="Podcast thumbnail"
                className="max-w-xs max-h-48 rounded-lg shadow-lg"
              />
              <button
                onClick={handleRemoveThumbnail}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors duration-200"
                title="Remove thumbnail"
              >
                <LuX className="size-4" />
              </button>
            </div>
            <div className="mt-2">
              <label htmlFor="thumbnail-replace" className="items-center gap-2 px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded-md cursor-pointer transition-colors duration-200 inline-flex">
                <LuImagePlus className="size-4 text-neutral-50" />
                <span className="text-xs font-medium">Replace Thumbnail</span>
                <input
                  id="thumbnail-replace"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Audio Player Preview */}
        {audioPreview && (
          <div className="mb-6">
            <div className="bg-neutral-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-300">
                  {audioFile?.name || 'Audio File'}
                </span>
                <button
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
          />
        </div>

        {/* Subtitle input - Re-added */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Subtitle here (optional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          />
        </div>


        <div className="mb-6">
          <textarea
            placeholder="Description of your podcast here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
          ></textarea>
        </div>

        {/* Display selected tags and category */}
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

        {/* Public/Private Toggle */}
        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out bg-neutral-700 border-neutral-600 rounded"
          />
          <label htmlFor="isPublic" className="text-neutral-300">
            Make Public
          </label>
        </div>
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