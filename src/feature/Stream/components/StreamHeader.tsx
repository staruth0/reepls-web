import React from 'react';
import { ImagePlus, Plus } from 'lucide-react';
import { Publication } from '../../../models/datamodels';
import { useUser } from '../../../hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useSubscribeToPublication, useUnsubscribeFromPublication, useGetPublicationSubscriptionStatus, useGetPublicationSubscribers } from '../Hooks';
// import { useGetCollaborators } from '../Hooks'; // Commented out - using author instead
import { toast } from 'react-hot-toast';

interface StreamHeaderProps {
  stream: Publication;
}


const StreamHeader: React.FC<StreamHeaderProps> = ({ stream }) => {
  const navigate = useNavigate();
 
  // const { data: collaboratorsData } = useGetCollaborators(stream._id || ''); // Commented out - using author instead
  const { data: subscriptionStatusData } = useGetPublicationSubscriptionStatus(stream._id || '');
  const { data: subscribersData } = useGetPublicationSubscribers(stream._id || '');

  console.log('subscribers')
  console.log('subscribers data', subscribersData);


  const { mutate: subscribeToPublication, isPending: isSubscribing } = useSubscribeToPublication();
  const { mutate: unsubscribeFromPublication, isPending: isUnsubscribing } = useUnsubscribeFromPublication();
  const {authUser} = useUser();
  
  const isSubscriptionPending = isSubscribing || isUnsubscribing;
 
  // Use subscription status from API
  const isSubscribed = subscriptionStatusData?.is_subscribed || false;
  const subscribersCount = subscribersData?.subscribers?.length || 0;

  const isCurrentAuthorstream = authUser?.id === stream?.owner_id;

  const handleSubscriptionToggle = () => {
    if (stream?._id) {
      if (isSubscribed) {
        // Unsubscribe
        unsubscribeFromPublication(stream._id, {
          onSuccess: () => {
            toast.success('Unsubscribed successfully');
            console.log('Unsubscribed successfully');
          },
          onError: (error) => {
            console.error('Unsubscribe failed:', error);
            toast.error('Unsubscribe failed');
          }
        });
      } else {
        // Subscribe
        subscribeToPublication(stream._id, {
          onSuccess: () => {
            toast.success('Subscribed successfully');
            console.log('Subscribed successfully');
          },
          onError: (error) => {
            console.error('Subscribe failed:', error);
            toast.error('Subscribe failed');
          }
        });
      }
    }
  };

  const handleSubscribersClick = () => {
    if (isCurrentAuthorstream) {
      // Only owners can navigate to subscribers page
      navigate(`/stream/${stream?._id}/subscribers`);
    } else {
      // Show message that it's reserved for owners
      toast.error('Subscribers list is reserved for publication owners only');
    }
  };

  return (
    <div className="relative w-full">
      

      <div className="w-full h-32 bg-neutral-200 overflow-hidden">
        {stream?.banner_image ? (
          <img 
            src={stream.banner_image} 
            alt="Banner" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-neutral-400 text-sm">
            <ImagePlus className="w-6 h-6 mr-2" />
            Upload banner
          </div>
        )}
       
      </div>
       {/* Profile picture overlay */}
       <div className="w-36 h-36 z-50 -mt-12 ml-5 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm border-4 border-white">
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



<div className='flex items-center gap-4 justify-between px-4'>

       <div className="py-4 px-1">
        <div className="flex items-baseline ">
          <h2 className="text-lg font-bold text-neutral-50">{stream?.title}</h2>
        
        </div>
        <p className="text-sm text-neutral-300 mb-2">{stream?.short_description}</p>

        <div className="flex items-center text-xs text-neutral-400 px-1">
          <p className='text-neutral-100'>
            {/* <span 
              className="font-bold text-neutral-50 hover:text-primary-400 cursor-pointer transition-colors"
              onClick={() => navigate(`/stream/${stream?._id}/collaborators`)}
            >
              {collaboratorsData?.collaborators.length || 0}
            </span> Editor */}
            <span className="font-bold text-neutral-50">
              1
            </span> Editor
          </p>
          <p className="ml-4 text-neutral-100">
           
              <span 
                className={`font-bold text-neutral-50 transition-colors ${
                  isCurrentAuthorstream 
                    ? 'hover:text-primary-400 cursor-pointer' 
                    : 'cursor-not-allowed opacity-70'
                }`}
                onClick={handleSubscribersClick}
              >
                {subscribersCount || 0}{" "}
              </span> 
           Subscribers
          </p>
        </div>
      </div>

    { isCurrentAuthorstream ? (
      <button 
        onClick={()=>navigate(`/stream/edit/${stream?._id}`)} 
        className='bg-neutral-400 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-full hover:bg-neutral-500 transition-colors'
      >
        <span className="hidden sm:inline">Edit Stream</span>
        <span className="sm:hidden">✏️</span>
      </button>
    ) : (
      <button 
        onClick={handleSubscriptionToggle}
       
        className={`px-4 sm:px-8 py-2 sm:py-4 rounded-full transition-colors ${
          isSubscribed 
            ? 'bg-neutral-500 text-white hover:bg-neutral-600' 
            : 'bg-primary-400 text-white hover:bg-primary-500'
        } ${isSubscriptionPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="hidden sm:inline">
          {isSubscriptionPending 
            ? (isSubscribing ? 'Subscribing...' : 'Unsubscribing...') 
            : isSubscribed 
              ? 'Unsubscribe' 
              : 'Subscribe'}
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