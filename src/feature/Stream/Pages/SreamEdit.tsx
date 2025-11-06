import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { t } from "i18next";
import { ImagePlus, Loader2 } from "lucide-react";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import StreamSidebar from "../components/StreamSidebar";
import { useGetPublicationById, useEditPublication } from "../Hooks";
import { useUser } from "../../../hooks/useUser";
import { uploadUserProfile, uploadUserBanner } from "../../../utils/media";

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

const MAX_SHORT_DESCRIPTION = 250;
const MAX_DESCRIPTION = 750;

// Types
interface FormErrors {
  name?: string;
  shortDescription?: string;
  description?: string;
}

interface FormData {
  name: string;
  shortDescription: string;
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
    ? "relative w-36 h-36 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm border-4 border-white cursor-pointer hover:bg-neutral-200 transition-colors"
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
        <div className={`flex ${isCircular ? 'flex-col' : 'items-center justify-center'} w-full h-full text-neutral-400 text-sm`}>
          <ImagePlus className={`w-6 h-6 ${isCircular ? 'mb-1' : 'mr-2'}`} />
          {isCircular ? (
            <>
              <span className="text-xs">
                {label} {required && <span className="text-red-500">*</span>}
              </span>
            </>
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
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  children,
  className = ""
}) => {
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-neutral-100 mb-2 text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
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
const StreamEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: streamData, isLoading, error } = useGetPublicationById(id || '');
  const { mutate: editPublication, isPending: isUpdating } = useEditPublication();
  const { authUser } = useUser();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    shortDescription: "",
    description: "",
    topics: [],
    customTopic: "",
    coverImg: undefined,
    bannerImg: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  // Load data when streamData is available
  useEffect(() => {
    if (streamData) {
      setFormData({
        name: streamData.title || '',
        shortDescription: streamData.short_description || '',
        description: streamData.description || '',
        topics: streamData.tags || [],
        customTopic: '',
        coverImg: streamData.cover_image || undefined,
        bannerImg: streamData.banner_image || undefined,
      });
    }
  }, [streamData]);

  // Validation
  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (formData.name.trim() === "") {
      newErrors.name = t("Stream name is required");
    }
    
    if (formData.shortDescription.trim() === "") {
      newErrors.shortDescription = t("Short description is required");
    } else if (formData.shortDescription.length > MAX_SHORT_DESCRIPTION) {
      newErrors.shortDescription = t("Short description should not exceed {{count}} characters", { count: MAX_SHORT_DESCRIPTION });
    }
    
    if (formData.description.length > MAX_DESCRIPTION) {
      newErrors.description = t("Description should not exceed {{count}} characters", { count: MAX_DESCRIPTION });
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
      toast.success(t("Cover image uploaded successfully. Please save your changes."));
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
      toast.success(t("Banner image uploaded successfully. Please save your changes."));
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
    setFormData(prev => ({ ...prev, name: e.target.value }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  }, [errors.name]);

  const handleShortDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, shortDescription: e.target.value }));
    if (errors.shortDescription) {
      setErrors(prev => ({ ...prev, shortDescription: undefined }));
    }
  }, [errors.shortDescription]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: undefined }));
    }
  }, [errors.description]);

  // Save handler
  const handleSave = useCallback(() => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error(t("Please fix the errors before saving"));
      return;
    }

    if (!id) {
      toast.error(t("Stream ID not found"));
      return;
    }

    // Determine final topics
    let finalTopics = [...formData.topics];
    if (formData.topics.length === 0 && formData.customTopic.trim() !== "") {
      finalTopics = [formData.customTopic.trim()];
    }

    const updateData = {
      title: formData.name.trim(),
      short_description: formData.shortDescription.trim(),
      cover_image: formData.coverImg || '',
      ...(formData.bannerImg && { banner_image: formData.bannerImg }),
      ...(finalTopics.length > 0 && { tags: finalTopics }),
      ...(formData.description.trim() && { description: formData.description.trim() }),
    };

    editPublication(
      { id, payload: updateData },
      {
        onSuccess: () => {
          toast.success(t("Stream updated successfully!"));
          navigate(`/stream/${id}`);
        },
        onError: (error: Error) => {
          console.error("Error updating stream:", error);
          const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message 
            || t("Failed to update stream. Please try again.");
          toast.error(errorMessage);
        },
      }
    );
  }, [id, formData, validate, editPublication, navigate]);

  // Loading state
  if (isLoading) {
    return (
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
          <Topbar>
            <div>{t("Edit Stream")}</div>
          </Topbar>
          <div className="w-full">
            <div className="p-8">
              <div className="text-center text-neutral-400 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("Loading stream data...")}
              </div>
            </div>
          </div>
        </div>
        <div className="communique sidebar bg-background hidden lg:block">
          <StreamSidebar />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
          <Topbar>
            <div>{t("Edit Stream")}</div>
          </Topbar>
          <div className="w-full">
            <div className="p-8">
              <div className="text-center text-red-400">
                {t("Error loading stream. Please try again.")}
              </div>
            </div>
          </div>
        </div>
        <div className="communique sidebar bg-background hidden lg:block">
          <StreamSidebar />
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div>{t("Edit Stream")}</div>
        </Topbar>

        <div className="w-full">
          <div className="p-8">
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
                <div className="h-12" /> {/* Spacer to prevent content overlap */}
              </div>

              {/* Stream Name Input */}
              <FormField
                label={t("Stream Name")}
                required
                error={errors.name}
              >
                <input
                  type="text"
                  className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none"
                  placeholder={t("e.g., The Daily Legal Handbook for Student Lawyers")}
                  value={formData.name}
                  onChange={handleNameChange}
                  aria-invalid={!!errors.name}
                />
              </FormField>

              {/* Short Description Input */}
              <FormField
                label={t("Short Description")}
                required
                error={errors.shortDescription}
              >
                <textarea
                  className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none h-20 resize-none"
                  placeholder={t("e.g., Exploring data science frontiers and AI insights")}
                  value={formData.shortDescription}
                  onChange={handleShortDescriptionChange}
                  maxLength={MAX_SHORT_DESCRIPTION}
                  aria-invalid={!!errors.shortDescription}
                />
                <div className="text-right text-xs text-neutral-400 mt-2">
                  {formData.shortDescription.length}/{MAX_SHORT_DESCRIPTION} {t("characters")}
                </div>
              </FormField>

              {/* Full Description Input */}
              <FormField
                label={t("Full Description")}
                error={errors.description}
              >
                <textarea
                  className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none h-24 resize-none"
                  placeholder={t("Optional: Add a detailed description of your stream (up to {{count}} characters)...", { count: MAX_DESCRIPTION })}
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  maxLength={MAX_DESCRIPTION}
                  aria-invalid={!!errors.description}
                />
                <div className="text-right text-xs text-neutral-400 mt-2">
                  {formData.description.length}/{MAX_DESCRIPTION} {t("characters")}
                </div>
              </FormField>

              {/* Topics Section */}
              <TopicSelector
                topics={formData.topics}
                customTopic={formData.customTopic}
                onTopicToggle={handleTopicToggle}
                onCustomTopicChange={handleCustomTopicChange}
              />

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-2 rounded-full border border-neutral-300 text-neutral-200 hover:bg-neutral-800 transition-colors font-medium"
                  disabled={isUpdating}
                >
                  {t("Cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isUpdating || isUploadingCover || isUploadingBanner}
                  className={`bg-primary-400 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${
                    isUpdating || isUploadingCover || isUploadingBanner
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-primary-500'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("Updating Stream...")}
                    </>
                  ) : (
                    t("Save Changes")
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="communique sidebar bg-background hidden lg:block">
        <StreamSidebar />
      </div>
    </div>
  );
};

export default StreamEdit;
