import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllUserPublicationsByUserId } from '../../Stream/Hooks';
import StreamItemEllipsis from '../../Stream/components/StreamItemEllipsis';
import { Publication } from '../../../models/datamodels';

interface ProfileStreamsProps {
  userId: string;
  isAuthUser: boolean;
}

const ProfileStreams: React.FC<ProfileStreamsProps> = ({ userId, isAuthUser }) => {
  const { data: streamsData, isLoading, error } = useGetAllUserPublicationsByUserId(userId);
  const navigate = useNavigate();
  
  // Extract the data array from the response
  const streams = streamsData?.data || [];

  return (
    <div className='w-full flex flex-col max-w-3xl mx-auto'>
      {isAuthUser && (
        <span 
          onClick={() => navigate('/stream/create')} 
          className='text-primary-400 flex self-center cursor-pointer hover:text-primary-300 transition-colors'
        >
          <Plus className='w-6 h-6' /> Start a New Stream
        </span>
      )}
      
      <div className="mb-6 mt-6 p-8">
        {isLoading ? (
          <div className="text-center text-neutral-400">Loading streams...</div>
        ) : error ? (
          <div className="text-center text-red-400">Error loading streams. Please try again.</div>
        ) : streams && streams.length > 0 ? (
          streams.map((stream: Publication) => (
            <StreamItemEllipsis key={stream._id} author={stream} />
          ))
        ) : (
          <div className="text-center text-neutral-400">
            {isAuthUser 
              ? "No streams found. Create your first stream!" 
              : "This user has no streams created."}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileStreams;

