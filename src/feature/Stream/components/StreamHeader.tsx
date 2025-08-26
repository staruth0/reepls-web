import React from 'react';
import { ImagePlus } from 'lucide-react';



const StreamHeader: React.FC= () => {
  return (
    <div className="relative w-full">
      {/* Banner and Profile Upload Section */}
      <div className="relative w-full h-32 bg-neutral-200 ">
        {/* Banner upload area */}
        <div className="flex items-center justify-center w-full h-full text-neutral-400 text-sm">
          <ImagePlus className="w-6 h-6 mr-2" />
          Upload banner
        </div>
        {/* Profile picture overlay */}
        <div className="w-28 h-28 absolute -bottom-16 left-4 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm border-4 border-white">
          <ImagePlus className="w-6 h-6 mr-2" />
        </div>
      </div>
      <div className="h-16"></div> {/* Spacer for the profile image */}

      {/* Stream details */}
      <div className="py-4 px-1">
        <div className="flex items-baseline ">
          <h2 className="text-lg font-bold text-neutral-50">Stream name here</h2>
          <p className="ml-4 text-xs text-neutral-400">
            #topics #politics
          </p>
        </div>
        <p className="text-sm text-neutral-300 mb-2">Stream Bio Here. Some nice and catchy. Not Longer than 50 Chars</p>
        {/* Additional info like editor and subscribers */}
        <div className="flex items-center text-xs text-neutral-400 px-1">
          <p>
            <span className="font-bold text-neutral-50">1</span> Editor
          </p>
          <p className="ml-4">
            <span className="font-bold text-neutral-50">0</span> Subscribers
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreamHeader;