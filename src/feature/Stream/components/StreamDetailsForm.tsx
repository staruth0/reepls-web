import React, { useState } from 'react';
import { ImagePlus} from 'lucide-react';

interface StreamDetailsFormProps {
  onNext: (details: { name: string; description: string; topics: string[] }) => void;
  initialData: { name: string; description: string; topics: string[] };
}

const topicsList = ['politics', 'education', 'tech', 'art', 'data', 'history', 'international affairs', 'agriculture', 'science', 'health', 'business'];

const StreamDetailsForm: React.FC<StreamDetailsFormProps> = ({ onNext, initialData }) => {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [topics, setTopics] = useState(initialData.topics);
  const [customTopic, setCustomTopic] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '' });

  const handleContinue = () => {
    const newErrors = { name: '', description: '' };
    if (name.length > 25) {
      newErrors.name = 'Name should not be more than 25 characters';
    }
    if (description.length > 75) {
      newErrors.description = 'You are exceeding the 75-character limit';
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

    onNext({ name, description, topics: finalTopics });
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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Banner and Profile Upload Section */}
      <div className="relative w-full h-36 bg-neutral-200 rounded-lg ">
        {/* Banner upload area */}
        <div className="flex items-center justify-center w-full h-full text-neutral-400 text-sm">
          <ImagePlus className="w-6 h-6 mr-2" />
          Upload banner
        </div>
        {/* Profile picture overlay */}
        <div className="w-36 h-28 absolute -bottom-16 left-4 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm border-4 border-white">
            <ImagePlus className="w-6 h-6 mr-2" />
        </div>
      </div>
      <div className="h-12"></div> {/* Spacer to prevent content overlap */}

      {/* Stream Name Input */}
      <div className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-neutral-300'}`}>
        <label className="block text-neutral-100 mb-1">Stream Name</label>
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
        <label className="block text-neutral-100 mb-1">Describe your Stream</label>
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

      {/* Continue Button */}
      <div className="flex justify-end mt-8">
        <button
          className="bg-primary-400 text-white px-8 py-2 rounded-full font-bold"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StreamDetailsForm;