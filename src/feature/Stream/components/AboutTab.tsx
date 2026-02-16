import React, { useEffect } from 'react';
import { Publication } from '../../../models/datamodels';
import { LuTag} from 'react-icons/lu';
import { useGetAllUserPublications } from '../Hooks';


interface AboutTabProps {
  stream: Publication;
}

const AboutTab: React.FC<AboutTabProps> = ({ stream }) => {


const {data: allUserPublications} = useGetAllUserPublications();

  useEffect(() => {
    console.log('allUserPublications', allUserPublications);
  }, [allUserPublications]);

  return (
    <div className="pb-10 space-y-6 p-6">
      {/* Description */}
      <div>
       
        <p className="text-neutral-200 leading-relaxed">
          { stream?.short_description }
        </p>
       { stream?.description? <p className="text-neutral-200 leading-relaxed">
          {stream.description }
        </p>  : ""}
      </div>

   

      {/* Category and Tags */}
      <div className="space-y-4">
        {stream.category && (
          <div>
            <h4 className="text-md font-semibold text-neutral-50 mb-2">Category</h4>
            <span className="inline-block bg-primary-400/20 text-primary-400 px-3 py-1 rounded-full text-sm">
              {stream.category}
            </span>
          </div>
        )}

        {stream.tags && stream.tags.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-neutral-50 mb-2 flex items-center gap-2">
              <LuTag className="w-4 h-4" />
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {stream.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-sm hover:bg-neutral-600 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

    
    </div>
  );
};

export default AboutTab;
