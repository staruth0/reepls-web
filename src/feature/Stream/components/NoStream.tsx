import React from 'react'
import { useNavigate } from 'react-router-dom';

const NoStream:React.FC = () => {
const navigate = useNavigate();

  return (
    <div className='max-w-lg mx-auto flex flex-col items-center justify-center text-center'>
          <div className='w-full p-4'>
You have created no streams yet 
Together with other authors, Streams enable you build a unique
 identity around a themed collection of articles 
          </div>

          <button onClick={()=>navigate('/stream/create')} className='py-5 px-20 rounded-full bg-primary-400 text-center'>
          Start a New Stream
          </button>
    </div>
  )
}

export default NoStream