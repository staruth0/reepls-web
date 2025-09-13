import React, { useState, useEffect } from 'react';
import { ImagePlus, Plus } from 'lucide-react';
import { Publication } from '../../../models/datamodels';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useToggleSubscription, useGetUserSubscriptions } from '../Hooks';

interface StreamHeaderProps {
  stream: Publication;
}


const StreamHeader: React.FC<StreamHeaderProps> = ({ stream }) => {
  const navigate = useNavigate();

  const {authUser} = useUser();
  const { mutate: toggleSubscription, isPending: isSubscriptionPending } = useToggleSubscription();
  const { data: userSubscriptions } = useGetUserSubscriptions();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isCurrentAuthorstream = authUser?.id === stream?.owner_id;

  console.log('isCurrentAuthorstream',stream?.id,authUser?.id,isCurrentAuthorstream)

  // Check if user is subscribed to the publication
  useEffect(() => {
    if (userSubscriptions && stream?.id) {
      const isUserSubscribed = userSubscriptions.some(
        (sub: { id: string }) => sub.id === stream.id
      );
      setIsSubscribed(isUserSubscribed);
    }
  }, [userSubscriptions, stream?.id]);

  const handleSubscriptionToggle = () => {
    if (stream?.id) {
      toggleSubscription(
        { id: stream.id },
        {
          onSuccess: () => {
            setIsSubscribed(!isSubscribed);
          },
          onError: (error) => {
            console.error('Subscription toggle failed:', error);
          }
        }
      );
    }
  };

  return (
    <div className="relative w-full">
      
      <div className="relative w-full h-32 bg-neutral-200 ">
     
        <div className="flex items-center justify-center w-full h-full text-neutral-400 text-sm">
          <ImagePlus className="w-6 h-6 mr-2" />
          Upload banner
        </div>
        {/* Profile picture overlay */}
        <div className="w-36 h-36 absolute -bottom-16 left-4 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm border-4 border-white">
        { stream?.cover_image ? (
                    <img 
                      src={stream?.cover_image} 
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
      <div className="h-16"></div>
<div className='flex items-center gap-4 justify-between px-4'>

       <div className="py-4 px-1">
        <div className="flex items-baseline ">
          <h2 className="text-lg font-bold text-neutral-50">{stream?.title}</h2>
          <p className="ml-4 text-xs text-neutral-400">
            {stream?.tags?.map((tag) => `#${tag}`).join(' ')}
          </p>
        </div>
        <p className="text-sm text-neutral-300 mb-2">{stream?.short_description}</p>

        <div className="flex items-center text-xs text-neutral-400 px-1">
          <p>
            <span className="font-bold text-neutral-50">{stream?.collaborators?.length || 0}</span> Editor
          </p>
          <p className="ml-4">
            <span className="font-bold text-neutral-50">{stream?.subscribers_count || 0}</span> Subscribers
          </p>
        </div>
      </div>

    { isCurrentAuthorstream ? (
      <button 
        onClick={()=>navigate(`/stream/edit/${stream?.id}`)} 
        className='bg-neutral-400 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full hover:bg-neutral-500 transition-colors'
      >
        <span className="hidden sm:inline">Edit Stream</span>
        <span className="sm:hidden">✏️</span>
      </button>
    ) : (
      <button 
        onClick={handleSubscriptionToggle}
        disabled={isSubscriptionPending}
        className={`px-4 sm:px-8 py-2 sm:py-4 rounded-full transition-colors ${
          isSubscribed 
            ? 'bg-neutral-500 text-white hover:bg-neutral-600' 
            : 'bg-primary-400 text-white hover:bg-primary-500'
        } ${isSubscriptionPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="hidden sm:inline">
          {isSubscriptionPending ? 'subscribing...' : isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </span>
        <span className="sm:hidden">
          {isSubscriptionPending ? '...' : isSubscribed ? '✓' : <Plus/>}
        </span>
      </button>
    )}

      

</div>
      {/* Stream details */}
   
    </div>
  );
};

export default StreamHeader;