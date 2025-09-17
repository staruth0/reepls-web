import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import StreamItemEllipsis from './StreamItemEllipsis';
import { useGetMyPublications } from '../Hooks';
import { Publication } from '../../../models/datamodels';




const ContributorStreams:React.FC = () => {
  const { data: streams, isLoading, error } = useGetMyPublications();
  const navigate = useNavigate()

  useEffect(() => {
    console.log(streams);
  }, [streams]);

  return (
    <div className='w-full flex flex-col max-w-3xl mx-auto'>
       <span onClick={()=>navigate('/stream/create')} className='text-primary-400 flex self-center'> <Plus className='w-6 h-6 '/> Start a New Stream</span>
       <div className="mb-6 mt-6 p-8">
            {isLoading ? (
              <div className="text-center text-neutral-400">Loading streams...</div>
            ) : error ? (
              <div className="text-center text-red-400">Error loading streams. Please try again.</div>
            ) : streams && streams.length > 0 ? (
              streams.map((stream:Publication) => (
                <StreamItemEllipsis key={stream._id} author={stream} />
              ))
            ) : (
              <div className="text-center text-neutral-400">No streams found. Create your first stream!</div>
            )}
          </div>
    </div>
  )
}

export default ContributorStreams