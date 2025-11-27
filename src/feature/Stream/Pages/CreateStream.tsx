import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import StreamDetailsForm from '../components/StreamDetailsForm';
import StreamSidebar from '../components/StreamSidebar';
import { useCreatePublication } from '../Hooks';
import { Publication } from '../../../models/datamodels';

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const CreateStream: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: createPublication, isPending: isCreating, error } = useCreatePublication();
  const [streamDetails, setStreamDetails] = useState<{
    name: string;
    description: string;
    topics: string[];
    coverImage?: string;
    bannerImage?: string;
  }>({
    name: '',
    description: '',
    topics: [],
    coverImage: undefined,
    bannerImage: undefined,
  });

  const handleCreateStream = (details: typeof streamDetails) => {
    setStreamDetails(details);
    
    // Prepare publication data
    const publicationData: Publication = {
      title: details.name,
      short_description: details.description,
      ...(details.coverImage ? { cover_image: details.coverImage } : {}),
      ...(details.bannerImage ? { banner_image: details.bannerImage } : {}),
      ...(details.topics.length > 0 ? { tags: details.topics } : {}),
    };
    console.log(publicationData);
    createPublication(publicationData, {
      onSuccess: () => {
        toast.success('Stream created successfully!');
        // Navigate to the created stream or back to streams list
        navigate('/stream/management'); // Adjust the route as needed
      },
      onError: (error: ApiError) => {
        console.error('Error creating stream:', error);
        const errorMessage = error?.response?.data?.message || 'Failed to create stream. Please try again.';
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div>Create Stream</div>
        </Topbar>

        <div className="w-full">
          <div className="p-8">
            <p className="text-center text-neutral-300 max-w-lg mx-auto mb-10">
              Streams allow authors to curate their work into themed collections, giving each its own unique identity and a dedicated audience. <span className="underline cursor-pointer">Learn more</span>
            </p>

            {/* Error Display */}
            {error && (
              <div className="max-w-xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p className="font-semibold">Error creating stream:</p>
                <p>{(error as ApiError)?.response?.data?.message || 'An unexpected error occurred. Please try again.'}</p>
              </div>
            )}

            <StreamDetailsForm 
              onNext={handleCreateStream} 
              initialData={{
                name: streamDetails.name,
                description: streamDetails.description,
                topics: streamDetails.topics,
                ...(streamDetails.coverImage && { coverImage: streamDetails.coverImage }),
                ...(streamDetails.bannerImage && { bannerImage: streamDetails.bannerImage }),
              }}
              isLoading={isCreating}
            />
          </div>
        </div>
      </div>

      <div className="communique sidebar bg-background hidden lg:block">
         <StreamSidebar />
      </div>
    </div>
  );
};

export default CreateStream;