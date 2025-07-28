import React, { useState } from 'react';
import { LuImagePlus, LuMic } from 'react-icons/lu'; // Icons for image and audio
import { toast } from 'react-toastify'; // For notifications

const Podcast: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState<boolean>(false); // State for post button loading

  // Placeholder function for handling thumbnail upload
  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic file type validation
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file for the thumbnail.');
        return;
      }
      setThumbnailFile(file);
      toast.success('Thumbnail image selected!');
    }
  };

  // Placeholder function for handling audio upload
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic file type validation
      if (!file.type.startsWith('audio/')) {
        toast.error('Please upload an audio file.');
        return;
      }
      setAudioFile(file);
      toast.success('Audio file selected!');
    }
  };

  // Placeholder function for handling the post action
  const handlePost = async () => {
    if (!title.trim()) {
      toast.error('Podcast title cannot be empty.');
      return;
    }
    if (!audioFile) {
      toast.error('Please upload an audio file for your podcast.');
      return;
    }

    setIsPosting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Podcast Data:', {
        title,
        subtitle,
        notes,
        thumbnail: thumbnailFile ? thumbnailFile.name : 'No thumbnail',
        audio: audioFile.name,
      });

      toast.success('Podcast posted successfully!');
      // Reset form (optional)
      setTitle('');
      setSubtitle('');
      setNotes('');
      setThumbnailFile(null);
      setAudioFile(null);
      // Navigate away or close modal if applicable
    } catch (error) {
      toast.error('Failed to post podcast. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 text-neutral-50 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-neutral-900 shadow-md">
        <h1 className="text-xl font-semibold text-neutral-50">New Podcast</h1>
        <button
          onClick={handlePost}
          disabled={isPosting}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPosting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* File Upload Buttons */}
        <div className="flex gap-4 mb-8">
          {/* Add Thumbnail Image Button */}
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

          {/* Add Audio Button */}
          <label htmlFor="audio-upload" className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md cursor-pointer transition-colors duration-200">
            <LuMic className="size-5 text-neutral-50" />
            <span className="text-sm font-medium">Add Audio</span>
            <input
              id="audio-upload"
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Podcast Title Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Title of Podcast here"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl font-semibold"
          />
        </div>

        {/* Subtitle Input (Optional) */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Subtitle here (optional)"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
          />
        </div>

        {/* Notes Textarea */}
        <div className="mb-6">
          <textarea
            placeholder="you can add notes for your listeners..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8} // Adjust rows as needed
            className="w-full p-3 bg-neutral-700 text-neutral-50 placeholder-neutral-400 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-y"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Podcast;