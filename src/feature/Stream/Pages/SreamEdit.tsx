import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { t } from "i18next";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import StreamSidebar from "../components/StreamSidebar";
import { ImagePlus } from "lucide-react";
import { useGetPublicationById, useEditPublication } from "../Hooks";
import { useUser } from "../../../hooks/useUser";
import { uploadUserProfile,uploadUserBanner } from "../../../utils/media";

const topicsList = ['politics', 'education', 'tech', 'art', 'data', 'history', 'international affairs', 'agriculture', 'science', 'health', 'business'];

const StreamEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: streamData, isLoading, error } = useGetPublicationById(id || '');
  const { mutate: editPublication, isPending: isUpdating } = useEditPublication();
  const { authUser } = useUser();

  // Local state for the form values and errors
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [coverImg, setCoverImg] = useState<string | undefined>(undefined);
  const [bannerImg, setBannerImg] = useState<string | undefined>(undefined);
  const [errors, setErrors] = useState<{ name?: string; shortDescription?: string; description?: string }>({});

  // Load data when streamData is available
  useEffect(() => {
    if (streamData) {
      console.log('Stream data received:', streamData);
      setName(streamData.title || '');
      setShortDescription(streamData.short_description || '');
      setDescription(streamData.description || '');
      setTopics(streamData.tags || []);
      setCoverImg(streamData.cover_image || undefined);
      setBannerImg(streamData.banner_image || undefined);
    }
  }, [streamData]);

  const validate = () => {
    const newErrors: { name?: string; shortDescription?: string; description?: string } = {};
    if (name.trim() === "") newErrors.name = "Stream name is required.";
    if (shortDescription.trim() === "") newErrors.shortDescription = "Short description is required.";
    if (shortDescription.length > 250) newErrors.shortDescription = "Short description should not exceed 250 characters.";
    if (description.length > 750) newErrors.description = "Description should not exceed 750 characters.";
    return newErrors;
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
          toast.success(t("Cover image updated successfully"));
        })
        .catch(() => {
          toast.error(t("Failed to update cover image"));
        });
    }
  };
  const handleBannerImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => setBannerImg(e.target?.result as string);
      reader.readAsDataURL(file);
      
      // Upload the image
      submitBannerImage(file)
        .then((data) => {
          setBannerImg(data);
          toast.success(t("Banner image updated successfully"));
        })
        .catch(() => {
          toast.error(t("Failed to update banner image"));
        });
    }
  };

  const submitCoverImage = async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("You must be logged in to upload a cover image"));
      return;
    }
    const url = await uploadUserProfile(file);
    setCoverImg(url);
    return url;
  };

  const submitBannerImage = async (file: File) => {
    if (!authUser?.id) {
      toast.error(t("You must be logged in to upload a banner image"));
      return;
    }
    const url = await uploadUserBanner(file);
    setBannerImg(url);
    return url;
  };

  const handleTopicClick = (topic: string) => {
    // Clear custom topic when a pre-defined topic is selected
    if (!topics.includes(topic)) {
      setCustomTopic("");
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

  const handleBannerImageClick = () => {
    toast.info(t("Banner image feature not available now"));
  };

  const handleSave = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!id) {
      toast.error("Stream ID not found");
      return;
    }
    
    let finalTopics = [...topics];
    if (topics.length === 0 && customTopic.trim() !== "") {
      finalTopics = [customTopic.trim()];
    }

    const updateData = {
      title: name,
      short_description: shortDescription,
      cover_image: coverImg || '',
      ...(finalTopics.length > 0 && { tags: finalTopics }),
    };

    console.log('Update data:', updateData);

    editPublication(
      { id, payload: updateData },
      {
        onSuccess: () => {
          toast.success("Stream updated successfully!");
        },
        onError: (error: Error) => {
          console.error("Error updating stream:", error);
          const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update stream. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
          <Topbar>
            <div>Edit Stream</div>
          </Topbar>
          <div className="w-full">
            <div className="p-8">
              <div className="text-center text-neutral-400">Loading stream data...</div>
            </div>
          </div>
        </div>
        <div className="communique sidebar bg-background hidden lg:block">
          <StreamSidebar />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
          <Topbar>
            <div>Edit Stream</div>
          </Topbar>
          <div className="w-full">
            <div className="p-8">
              <div className="text-center text-red-400">Error loading stream. Please try again.</div>
            </div>
          </div>
        </div>
        <div className="communique sidebar bg-background hidden lg:block">
          <StreamSidebar />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div>Edit Stream</div>
        </Topbar>

        <div className="w-full">
          <div className="p-8">
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
              <div className="h-12"></div> {/* Spacer */}

              {/* Stream Name Input */}
              <div
                className={`w-full p-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-neutral-300"
                }`}
              >
                <label className="block text-neutral-100 mb-1">
                  Stream Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none"
                  placeholder="e.g., The Daily Legal Handbook for Student Lawyers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Short Description Input */}
              <div
                className={`p-2 border rounded-md ${
                  errors.shortDescription ? "border-red-500" : "border-neutral-300"
                }`}
              >
                <label className="block text-neutral-100 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none h-16"
                  placeholder="e.g., Exploring data science frontiers and AI insights"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                />
                <div className="text-right text-xs text-neutral-400 mt-1">
                  {shortDescription.length}/250 characters
                </div>
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>
                )}
              </div>

              {/* Long Description Input */}
              <div
                className={`p-2 border rounded-md ${
                  errors.description ? "border-red-500" : "border-neutral-300"
                }`}
              >
                <label className="block text-neutral-100 mb-1">
                  Full Description
                </label>
                <textarea
                  className="w-full bg-transparent text-neutral-50 placeholder-neutral-400 outline-none h-24"
                  placeholder="Optional: Add a detailed description of your stream (up to 750 characters)..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div className="text-right text-xs text-neutral-400 mt-1">
                  {description.length}/750 characters
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Topics Section */}
              <div className="mb-6">
                <label className="block text-neutral-100 mb-2">What will you Write About?</label>
                <div className="flex flex-wrap gap-2">
                  {topicsList.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className={`px-4 py-2 rounded-full border ${
                        topics.includes(topic) ? 'bg-primary-500 text-white' : 'border-neutral-200 text-neutral-200'
                      }`}
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

              {/* Save Button */}
              <div className="flex justify-end mt-8">
                <button
                  className={`bg-primary-400 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2 ${
                    isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={handleSave}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating Stream...
                    </>
                  ) : (
                    'Save Changes'
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
