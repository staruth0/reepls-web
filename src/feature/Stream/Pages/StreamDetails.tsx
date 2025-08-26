import React, { useState } from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import StreamHeader from '../components/StreamHeader';
import StreamSidebar from '../components/StreamSidebar';
import Tabs from '../../../components/molecules/Tabs/Tabs';

const StreamDetails: React.FC = () => {
  const tabs = [
    { id: 'about', title: 'About' },
    { id: 'article', title: 'Article' },
    { id: 'media', title: 'Media' },
    { id: 'authors', title: 'Authors' },
  ];

  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>(tabs[0].id);

  // Map tab id → content
  const tabContent: Record<string, React.ReactNode> = {
    about: (
      <div className="pb-10">
        <p className="text-neutral-200">This is the About tab content.</p>
      </div>
    ),
    article: (
      <div className="pb-10">
        <p className="text-neutral-200">Articles related to this stream will appear here.</p>
      </div>
    ),
    media: (
      <div className="pb-10">
        <p className="text-neutral-200">Media gallery / clips for this stream.</p>
      </div>
    ),
    authors: (
      <div className="pb-10">
        <p className="text-neutral-200">List of authors or contributors.</p>
      </div>
    ),
  };

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      {/* Main content */}
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div>Stream Detail</div>
        </Topbar>

        <div className="max-w-2xl mx-auto space-y-6">
          <StreamHeader />

          {/* Tabs header */}
          <Tabs
            activeTab={activeTab}
            setActiveTab={(tabId) => setActiveTab(tabId.toString())}
            scale={false}
            tabs={tabs}
            borderBottom={true}
          />

          {/* Tabs content */}
          <div className="mt-6">{tabContent[activeTab]}</div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="communique sidebar bg-background hidden lg:block">
        <StreamSidebar />
      </div>
    </div>
  );
};

export default StreamDetails;
