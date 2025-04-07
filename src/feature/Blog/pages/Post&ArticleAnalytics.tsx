import React from 'react';
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { Bookmark, MessageSquare, Heart, Eye, UserPlus, BarChart2 } from 'lucide-react';
import { Pics } from '../../../assets/images';

const PostArticleAnalytics: React.FC = () => {
  return (
    <div className={`lg:grid grid-cols-[4fr_1.66fr]`}>
      {/* Profile Section */}
      <div className="flex flex-col lg:border-r-[1px] border-neutral-500 min-h-screen">
        <Topbar>
          <p>Post Analytics</p>
        </Topbar>

        {/* Analytics content */}
        <div className=" px-5 md:px-10 lg:px-20 self-center  py-8">
          {/* Article Title Section with Image - Responsive layout */}
          <div className="mb-8">
            {/* Flex container for lg+ screens */}
            <div className="lg:flex lg:gap-8">
              {/* Image container - takes full width on mobile, 60% on lg+ */}
              <div className="relative w-full lg:w-[40%] h-64 md:h-auto lg:mb-0 rounded-lg overflow-hidden">
                <img 
                  src={Pics.blogPic} 
                  alt="Article cover" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Text content - takes full width on mobile, 40% on lg+ */}
              <div className=" lg:flex lg:flex-col lg:justify-between">
                <div>
                  <h1 className="text-[22px] font-bold mb-2 leading-tight">
                    The long, old case of looted German colonial rule resuscitates
                  </h1>
                  <p className="text-[14px] text-neutral-200 mb-4">
                    The Tangue' alongside a number of other historic artwork from the fatherland have not found home yet.
                  </p>
                </div>
                <div className="text-neutral-200 text-[14px] ">
                  4 hrs ago
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - unchanged */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {/* Impressions */}
            <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="text-neutral-100 size-5" />
                <span className="text-neutral-100 text-sm">Impressions</span>
              </div>
              <p className="text-2xl font-bold">500</p>
            </div>

            {/* Comments */}
            <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="text-neutral-100 size-5" />
                <span className="text-neutral-100 text-sm">Comments</span>
              </div>
              <p className="text-2xl font-bold">59</p>
            </div>

            {/* Engagements */}
            <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="text-neutral-100 size-5" />
                <span className="text-neutral-100 text-sm">Engagements</span>
              </div>
              <p className="text-2xl font-bold">230</p>
            </div>

            {/* Profile Value */}
            <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="text-neutral-100 size-5" />
                <span className="text-neutral-100 text-sm">Profile Value</span>
              </div>
              <p className="text-2xl font-bold">14</p>
            </div>

            {/* Reactions */}
            <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="text-neutral-100 size-5" />
                <span className="text-neutral-100 text-sm">Reactions</span>
              </div>
              <p className="text-2xl font-bold">148</p>
            </div>

            {/* Follows */}
            <div className="bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Bookmark className="text-neutral-100 size-5" />
                <span className="text-neutral-100 text-sm">Follows</span>
              </div>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Configurations Section */}
      <div className="profile__configurationz hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default PostArticleAnalytics;