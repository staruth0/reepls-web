import React, { useState } from 'react';
import { ImagePlus} from 'lucide-react';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { uploadUserProfile } from '../../../utils/media';

interface StreamDetailsFormProps {
  onNext: (details: { name: string; description: string; topics: string[]; coverImage: string }) => void;
  initialData: { name: string; description: string; topics: string[]; coverImage: string };
  isLoading?: boolean;
}

const topicsList = ['politics', 'education', 'tech', 'art', 'data', 'history', 'international affairs', 'agriculture', 'science', 'health', 'business'];

const StreamDetailsForm: React.FC<StreamDetailsFormProps> = ({ onNext, initialData, isLoading = false }) => {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [topics, setTopics] = useState(initialData.topics);
  const [customTopic, setCustomTopic] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '' });

  const [coverImg, setCoverImg] = useState<string | undefined>(initialData.coverImage || undefined);
  const { authUser } = useUser();

  const handleContinue = () => {
    const newErrors = { name: '', description: '' };
    
    // Required field validations
    if (!name.trim()) {
      newErrors.name = 'Stream name is required';
    } else if (name.length > 25) {
      newErrors.name = 'Name should not be more than 25 characters';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Stream description is required';
    } else if (description.length > 250) {
      newErrors.description = 'You are exceeding the 250-character limit';
    }

    if (!coverImg) {
      toast.error(t("Cover image is required"));
      return;
    }

    if (newErrors.name || newErrors.description) {
      setErrors(newErrors);
      return;
    }

    // Include custom topic if it's not empty and no topics are selected
    let finalTopics = [...topics];
    if (topics.length === 0 && customTopic.trim() !== '') {
      finalTopics = [customTopic.trim()];
    }

    onNext({ name, description, topics: finalTopics, coverImage: coverImg || '' });
  };

  const handleTopicClick = (topic: string) => {
    // Clear custom topic when a pre-defined topic is selected
    if (!topics.includes(topic)) {
      setCustomTopic('');
    }
    setTopics((prevTopics) =>
      prevTopics.includes(topic) ? prevTopics.filter((t) => t !== topic) : [...prevTopics, topic]
    );
  };

  const handleCustomTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear pre-defined topics when a custom topic is being typed
    if (topics.length > 0) {
      setTopics([]);
    }
    setCustomTopic(e.target.value);
  };

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setCoverImg(e.target?.result as string);
      reader.readAsDataURL(file);
      
      // Upload the image
      submitCoverImage(file)
        .then((data) => {
          setCoverImg(data);
          toast.success(t("Added your cover Image"));
        })
        .catch(() => {
          toast.error(t("Failed to add your cover Image"));
        });
    }
  };

  const handleBannerImageClick = () => {
    toast.info(t("Banner image feature not available now"));
  };

  const submitCoverImage = async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("You must be logged in to upload a cover image"));
      return;
    }
    const url = await uploadUserProfile( file);
    setCoverImg(url);
    return url;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Banner and Profile Upload Section */}
      <div className="relative w-full h-36 bg-neutral-200 rounded-lg ">
        {/* Banner upload area */}
        <div 
          className="flex items-center justify-center w-full h-full text-neutral-400 text-sm cursor-pointer hover:bg-neutral-300 transition-colors"
          onClick={handleBannerImageClick}
        >
          <ImagePlus className="w-6 h-6 mr-2" />
          Upload banner
        </div>
        {/* Profile picture overlay */}
        <div className="w-36 h-36 absolute -bottom-16 left-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm border-4 border-white cursor-pointer hover:bg-neutral-200 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="cover-image-input"
          />
          {coverImg ? (
            <img 
              src={coverImg} 
              alt="Cover preview" 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center">
              <ImagePlus className="w-6 h-6 mb-1" />
              <span className="text-xs">Cover Image <span className="text-red-500">*</span></span>
            </div>
          )}
        </div>
      </div>
      <div className="h-12"></div> {/* Spacer to prevent content overlap */}

      {/* Stream Name Input */}
      <div className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-neutral-300'}`}>
        <label className="block text-neutral-100 mb-1">
          Stream Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={`w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none`}
          placeholder="e.g., The Daily Legal Handbook for Student Lawyers"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Stream Description Input */}
      <div className={`p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-neutral-300'}`}>
        <label className="block text-neutral-100 mb-1">
          Describe your Stream <span className="text-red-500">*</span>
        </label>
        <textarea
          className={`w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none h-20`}
          placeholder="e.g., Exploring data science frontiers. Sharing insights on ML, statistics and AI to help others learn and grow and"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Topics Section */}
      <div className="mb-6">
        <label className="block text-neutral-100 mb-2">What will you Write About?</label>
        <div className="flex flex-wrap gap-2">
          {topicsList.map((topic) => (
            <button
              key={topic}
              type="button"
              className={`px-4 py-2 rounded-full border ${topics.includes(topic) ? 'bg-primary-500 text-white' : 'border-neutral-200 text-neutral-200'}`}
              onClick={() => handleTopicClick(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
        {/* Custom topic input, shown when no pre-defined topic is selected */}
        {topics.length === 0 && (
          <div className="mt-6">
            <h4 className="text-neutral-100 text-sm mb-2">Some other topic?</h4>
            <div className="flex items-center p-2 border-b border-neutral-300 ">
              <span className="text-neutral-400 mr-2 font-bold text-xl">#</span>
              <input
                type="text"
                className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none"
                placeholder=""
                value={customTopic}
                onChange={handleCustomTopicChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Create Stream Button */}
      <div className="flex justify-end mt-8">
        <button
          className={`bg-primary-400 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Stream...
            </>
          ) : (
            'Create Stream'
          )}
        </button>
      </div>
    </div>
  );
};

export default StreamDetailsForm;