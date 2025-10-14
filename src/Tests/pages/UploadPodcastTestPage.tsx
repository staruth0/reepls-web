import React from 'react';
import { Icon } from '@iconify/react';

const UploadPodcastTestPage: React.FC = () => {
  return (
    <>
      <div className="p-8 bg-white">
        {/* Reaction Icons Row */}
        <div className="flex items-center gap-4 mb-6">
           <Icon icon="pepicons-pencil:hands-clapping" />
          <Icon icon="heroicons:hand-thumb-up" className="w-6 h-6 text-gray-600" />
          <Icon icon="heroicons:heart" className="w-6 h-6 text-gray-600" />
          <Icon icon="heroicons:face-smile" className="w-6 h-6 text-gray-600" />
          <Icon icon="heroicons:face-frown" className="w-6 h-6 text-gray-600" />
        </div>

        {/* Engagement Metrics Row */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Icon icon="mdi:hand-clap" className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium">387</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon icon="mdi:comment" className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">8</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon icon="mdi:volume-high" className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">12</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPodcastTestPage;