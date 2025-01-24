import React, { useState } from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import Communique from './components/Communique/Communique';

import BlogProfile from '../../components/atoms/BlogComponents/BlogProfile';
import PostDetail from '../../components/molecules/sidebar/PostDetail';
import Tabs from '../../components/molecules/Tabs/Tabs';
import './feed.scss';

const tabs = [
  { id: 1, title: 'For you' },
  { id: 2, title: 'Following' },
];

const CommuniqueDetail: React.FC = () => {
  const [isExpandedMode, setIsExpandedMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  function handleExpandedMode() {
    setIsExpandedMode((prev) => !prev);
  }

  return (
    <div className={`grid ${isExpandedMode ? 'grid-cols-[4fr_1.25fr]' : 'grid-cols-[4fr_1.66fr]'} `}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts border-r-[1px] border-neutral-500 ">
        <Topbar>
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} scale={true} />
        </Topbar>
        <div className="px-20 mt-10">
          <BlogProfile id={'Default'} date={'Default'} /> // TODO: Change to user id and date
          <div className="mt-4">
            <PostDetail />
          </div>
        </div>
      </div>

      {/* Communique Section */}
      <div className="communique flex flex-col">
        <Communique isExpandedMode={isExpandedMode} handleExpandedMode={handleExpandedMode} />
      </div>
    </div>
  );
};

export default CommuniqueDetail;
