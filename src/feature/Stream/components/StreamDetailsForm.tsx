import React, { useState, useCallback } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { t } from 'i18next';
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { uploadUserProfile, uploadUserBanner } from '../../../utils/media';

// Constants
const TOPICS_LIST = [
  'politics',
  'education',
  'tech',
  'art',
  'data',
  'history',
  'international affairs',
  'agriculture',
  'science',
  'health',
  'business'
] as const;

const TITLE_MIN_LENGTH = 3;
const TITLE_MAX_LENGTH = 100;
const DESCRIPTION_MIN_LENGTH = 10;
const DESCRIPTION_MAX_LENGTH = 200;

// Types
interface StreamDetailsFormProps {
  onNext: (details: { 
    name: string; 
    description: string; 
    topics: string[]; 
    coverImage: string; 
    bannerImage?: string 
  }) => void;
  initialData: { 
    name: string; 
    description: string; 
    topics: string[]; 
    coverImage: string; 
    bannerImage?: string 
  };
  isLoading?: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
}

interface FormData {
  name: string;
  description: string;
  topics: string[];
  customTopic: string;
  coverImg: string | undefined;
  bannerImg: string | undefined;
}

// Image Upload Component
interface ImageUploadProps {
  imageUrl?: string;
  onChange: (file: File) => void;
  isUploading?: boolean;
  label: string;
  required?: boolean;
  className?: string;
  shape?: 'rectangular' | 'circular';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imageUrl,
  onChange,
  isUploading = false,
  label,
  required = false,
  className = "",
  shape = 'rectangular'
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(t("Please select a valid image file"));
        return;
      }
      onChange(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };

  const isCircular = shape === 'circular';
  const baseClasses = isCircular
    ? "relative w-36 h-36 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm border-4 border-white cursor-pointer hover:bg-neutral-200 transition-colors overflow-hidden"
    : "relative w-full h-full cursor-pointer hover:bg-neutral-300 transition-colors";

  return (
    <div className={`${baseClasses} ${className}`}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={isUploading}
        aria-label={label}
      />
      {isUploading ? (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <Loader2 className="w-6 h-6 animate-spin text-primary-400" />
          <span className="text-xs mt-2 text-neutral-400">Uploading...</span>
        </div>
      ) : imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt={label}
            className={`w-full h-full ${isCircular ? 'rounded-full' : ''} object-cover`}
          />
          {!isCircular && (
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center pointer-events-none">
              <div className="text-white opacity-0 hover:opacity-100 transition-opacity flex items-center">
                <ImagePlus className="w-6 h-6 mr-2" />
                <span className="text-sm">Change {label.toLowerCase()}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={`flex ${isCircular ? 'flex-col items-center justify-center' : 'items-center justify-center'} w-full h-full text-neutral-400 text-sm`}>
          <ImagePlus className={`${isCircular ? 'w-6 h-6 mb-1' : 'w-6 h-6 mr-2'}`} />
          {isCircular ? (
            <span className="text-xs text-center">
              {label} {required && <span className="text-red-500">*</span>}
            </span>
          ) : (
            <span>Upload {label.toLowerCase()}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Form Field Component
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
  characterCount?: { current: number; max: number };
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  className = "",
  characterCount
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-neutral-100 text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {characterCount && (
          <span className="text-xs text-neutral-400">
            {characterCount.current}/{characterCount.max}
          </span>
        )}
      </div>
      <div
        className={`p-3 border rounded-md transition-colors ${
          error ? "border-red-500 focus-within:border-red-600" : "border-neutral-300 focus-within:border-primary-400"
        }`}
      >
        {children}
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Topic Selector Component
interface TopicSelectorProps {
  topics: string[];
  customTopic: string;
  onTopicToggle: (topic: string) => void;
  onCustomTopicChange: (value: string) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  customTopic,
  onTopicToggle,
  onCustomTopicChange
}) => {
  return (
    <div className="space-y-4">
      <label className="block text-neutral-100 mb-3 text-sm font-medium">
        What will you Write About?
      </label>
      <div className="flex flex-wrap gap-2">
        {TOPICS_LIST.map((topic) => (
          <button
            key={topic}
            type="button"
            onClick={() => onTopicToggle(topic)}
            className={`px-4 py-2 rounded-full border transition-all ${
              topics.includes(topic)
                ? 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600'
                : 'border-neutral-200 text-neutral-200 hover:border-primary-400 hover:text-primary-400'
            }`}
            aria-pressed={topics.includes(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
      {topics.length === 0 && (
        <div className="mt-6">
          <h4 className="text-neutral-100 text-sm mb-2 font-medium">Some other topic?</h4>
          <div className="flex items-center p-3 border-b border-neutral-300 focus-within:border-primary-400 transition-colors">
            <span className="text-neutral-400 mr-2 font-bold text-xl">#</span>
            <input
              type="text"
              className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none"
              placeholder="Enter your custom topic"
              value={customTopic}
              onChange={(e) => onCustomTopicChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
const StreamDetailsForm: React.FC<StreamDetailsFormProps> = ({ 
  onNext, 
  initialData, 
  isLoading = false 
}) => {
  const { authUser } = useUser();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: initialData.name,
    description: initialData.description,
    topics: initialData.topics,
    customTopic: '',
    coverImg: initialData.coverImage || undefined,
    bannerImg: initialData.bannerImage || undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Validation
  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedDescription = formData.description.trim();
    
    // Title validation
    if (!trimmedName) {
      newErrors.name = t("Publication title is required");
    } else if (trimmedName.length < TITLE_MIN_LENGTH) {
      newErrors.name = t("Publication title must be at least {{count}} characters", { count: TITLE_MIN_LENGTH });
    } else if (trimmedName.length > TITLE_MAX_LENGTH) {
      newErrors.name = t("Publication title must not exceed {{count}} characters", { count: TITLE_MAX_LENGTH });
    }
    
    // Short description validation
    if (!trimmedDescription) {
      newErrors.description = t("Short description is required");
    } else if (trimmedDescription.length < DESCRIPTION_MIN_LENGTH) {
      newErrors.description = t("Short description must be at least {{count}} characters", { count: DESCRIPTION_MIN_LENGTH });
    } else if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
      newErrors.description = t("Short description must not exceed {{count}} characters", { count: DESCRIPTION_MAX_LENGTH });
    }
    
    return newErrors;
  }, [formData]);

  // Image upload handlers
  const handleCoverImageChange = useCallback(async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("You must be logged in to upload a cover image"));
      return;
    }

    setIsUploadingCover(true);
    
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, coverImg: e.target?.result as string }));
      };
      reader.readAsDataURL(file);

      // Upload the image
      const url = await uploadUserProfile(file);
      setFormData(prev => ({ ...prev, coverImg: url }));
      toast.success(t("Cover image uploaded successfully"));
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast.error(t("Failed to upload cover image. Please try again."));
      setFormData(prev => ({ ...prev, coverImg: undefined }));
    } finally {
      setIsUploadingCover(false);
    }
  }, [authUser?.id]);

  const handleBannerImageChange = useCallback(async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("You must be logged in to upload a banner image"));
      return;
    }

    setIsUploadingBanner(true);
    
    try {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, bannerImg: e.target?.result as string }));
      };
      reader.readAsDataURL(file);

      // Upload the image
      const url = await uploadUserBanner(file);
      setFormData(prev => ({ ...prev, bannerImg: url }));
      toast.success(t("Banner image uploaded successfully"));
    } catch (error) {
      console.error("Error uploading banner image:", error);
      toast.error(t("Failed to upload banner image. Please try again."));
      setFormData(prev => ({ ...prev, bannerImg: undefined }));
    } finally {
      setIsUploadingBanner(false);
    }
  }, [authUser?.id]);

  // Topic handlers
  const handleTopicToggle = useCallback((topic: string) => {
    setFormData(prev => {
      const isSelected = prev.topics.includes(topic);
      const newTopics = isSelected
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic];
      
      return {
        ...prev,
        topics: newTopics,
        customTopic: isSelected ? prev.customTopic : "", // Clear custom topic when selecting predefined
      };
    });
  }, []);

  const handleCustomTopicChange = useCallback((value: string) => {
    setFormData(prev => ({
      ...prev,
      customTopic: value,
      topics: value.trim() !== "" ? [] : prev.topics, // Clear predefined topics when typing custom
    }));
  }, []);

  // Form input handlers
  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= TITLE_MAX_LENGTH) {
      setFormData(prev => ({ ...prev, name: value }));
      if (errors.name) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
    }
  }, [errors.name]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      setFormData(prev => ({ ...prev, description: value }));
      if (errors.description) {
        setErrors(prev => ({ ...prev, description: undefined }));
      }
    }
  }, [errors.description]);

  // Submit handler
  const handleContinue = useCallback(() => {
    const validationErrors = validate();
    
    // Show toast alerts for minimum requirements
    if (validationErrors.name) {
      const trimmedName = formData.name.trim();
      if (trimmedName.length < TITLE_MIN_LENGTH) {
        toast.error(t("Publication title must be at least {{count}} characters", { count: TITLE_MIN_LENGTH }));
      } else if (trimmedName.length > TITLE_MAX_LENGTH) {
        toast.error(t("Publication title must not exceed {{count}} characters", { count: TITLE_MAX_LENGTH }));
      }
    }
    
    if (validationErrors.description) {
      const trimmedDescription = formData.description.trim();
      if (trimmedDescription.length < DESCRIPTION_MIN_LENGTH) {
        toast.error(t("Short description must be at least {{count}} characters", { count: DESCRIPTION_MIN_LENGTH }));
      } else if (trimmedDescription.length > DESCRIPTION_MAX_LENGTH) {
        toast.error(t("Short description must not exceed {{count}} characters", { count: DESCRIPTION_MAX_LENGTH }));
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!formData.coverImg) {
      toast.error(t("Cover image is required"));
      return;
    }

    // Determine final topics
    let finalTopics = [...formData.topics];
    if (formData.topics.length === 0 && formData.customTopic.trim() !== "") {
      finalTopics = [formData.customTopic.trim()];
    }

    // Trim values automatically before submitting
    onNext({ 
      name: formData.name.trim(), 
      description: formData.description.trim(), 
      topics: finalTopics, 
      coverImage: formData.coverImg || '', 
      bannerImage: formData.bannerImg 
    });
  }, [formData, validate, onNext]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Banner and Cover Image Section */}
      <div className="space-y-4">
        {/* Banner Upload */}
        <div className="w-full h-36 bg-neutral-200 rounded-lg overflow-hidden">
          <ImageUpload
            imageUrl={formData.bannerImg}
            onChange={handleBannerImageChange}
            isUploading={isUploadingBanner}
            label="Banner"
            shape="rectangular"
          />
        </div>

        {/* Cover Image Upload */}
        <div className="flex justify-start">
          <ImageUpload
            imageUrl={formData.coverImg}
            onChange={handleCoverImageChange}
            isUploading={isUploadingCover}
            label="Cover Image"
            required
            shape="circular"
            className="-mt-16 ml-4"
          />
        </div>
        <div className="h-2" /> {/* Spacer to prevent content overlap */}
      </div>

      {/* Stream Name Input */}
      <FormField
        label={t("Stream Name")}
        required
        error={errors.name}
        characterCount={{ current: formData.name.length, max: TITLE_MAX_LENGTH }}
      >
        <input
          type="text"
          className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none"
          placeholder={t("e.g., The Daily Legal Handbook for Student Lawyers")}
          value={formData.name}
          onChange={handleNameChange}
          maxLength={TITLE_MAX_LENGTH}
          aria-invalid={!!errors.name}
        />
      </FormField>

      {/* Stream Description Input */}
      <FormField
        label={t("Describe your Stream")}
        required
        error={errors.description}
        characterCount={{ current: formData.description.length, max: DESCRIPTION_MAX_LENGTH }}
      >
        <textarea
          className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none h-20 resize-none"
          placeholder={t("e.g., Exploring data science frontiers. Sharing insights on ML, statistics and AI to help others learn and grow")}
          value={formData.description}
          onChange={handleDescriptionChange}
          maxLength={DESCRIPTION_MAX_LENGTH}
          aria-invalid={!!errors.description}
        />
      </FormField>

      {/* Topics Section */}
      <TopicSelector
        topics={formData.topics}
        customTopic={formData.customTopic}
        onTopicToggle={handleTopicToggle}
        onCustomTopicChange={handleCustomTopicChange}
      />

      {/* Create Stream Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={isLoading || isUploadingCover || isUploadingBanner}
          className={`bg-primary-400 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
            isLoading || isUploadingCover || isUploadingBanner
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary-500'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("Creating Stream...")}
            </>
          ) : (
            t("Create Stream")
          )}
        </button>
      </div>
    </div>
  );
};

export default StreamDetailsForm;
