import React, { useEffect, useState } from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import StreamHeader from '../components/StreamHeader';
import StreamSidebar from '../components/StreamSidebar';
import StreamDetailsSkeleton from '../components/StreamDetailsSkeleton';
import StreamError from '../components/StreamError';
import Tabs from '../../../components/molecules/Tabs/Tabs';
import { useGetPublicationById } from '../Hooks';
import { useParams } from 'react-router-dom';

const StreamDetails: React.FC = () => {
  const tabs = [
    { id: 'about', title: 'About' },
    { id: 'article', title: 'Article' },
    { id: 'media', title: 'Media' },
    { id: 'authors', title: 'Authors' },
  ];

  const [activeTab, setActiveTab] = useState<typeof tabs[number]['id']>(tabs[0].id);

  const { id } = useParams<{ id: string }>();
  const { data: streamData, isLoading, error, refetch } = useGetPublicationById(id || '');
  
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
  
  useEffect(() => {
    if (streamData) {
      console.log('Stream data received:', streamData);
    }
  }, [streamData]);

  // Show loading skeleton
  if (isLoading) {
    return <StreamDetailsSkeleton />;
  }

  // Show error state
  if (error) {
    return <StreamError error={error} onRetry={() => refetch()} />;
  }

  // Show error if no data is available
  if (!streamData) {
    return <StreamError error={new Error('Stream not found')} onRetry={() => refetch()} />;
  }

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      {/* Main content */}
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div>Stream Detail</div>
        </Topbar>

        <div className="max-w-2xl mx-auto space-y-6">
          <StreamHeader stream={streamData} />

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
