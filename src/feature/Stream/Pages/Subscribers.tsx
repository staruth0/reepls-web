import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuUsers } from 'react-icons/lu';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import StreamSidebar from '../components/StreamSidebar';
import { useGetPublicationSubscribers, useGetPublicationById } from '../Hooks';
import SubscriberPerson from '../components/SubscriberPerson';

interface Subscriber {
  _id: string;
  username: string;
  subscription_date: string;
  subscription_status: string;
  is_owner: boolean;
  is_verified_writer: boolean;
  role: string;
  subscription_id: string;
}

const Subscribers: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data: subscribersData, isLoading: subscribersLoading, error: subscribersError } = useGetPublicationSubscribers(id || '');
  const { data: publicationData, isLoading: publicationLoading } = useGetPublicationById(id || '');

  const handleBackClick = () => {
    navigate(`/stream/${id}`);
  };

  useEffect(() => {
 
    console.log('Subscribers data received:', subscribersData);

  }, [publicationData, subscribersData]);

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="w-5 h-5 text-neutral-300" />
            </button>
            <div className="flex items-center gap-2">
              <LuUsers className="w-5 h-5 text-neutral-300" />
              <span className="text-neutral-50 font-semibold">
                {publicationLoading ? (
                  <div className="w-32 h-5 bg-neutral-600 rounded animate-pulse"></div>
                ) : (
                  `${publicationData?.title || 'Publication'} Subscribers`
                )}
              </span>
            </div>
          </div>
        </Topbar>

        <div className="max-w-2xl mx-auto space-y-6 p-6">
          {/* Header Stats */}
          <div className="mb-6">
            {subscribersLoading ? (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-neutral-600 rounded-full animate-pulse"></div>
                <div className="w-24 h-4 bg-neutral-600 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                  <LuUsers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-neutral-50">
                    {subscribersData?.totalResults || 0}
                  </span>
                  <span className="ml-2">
                    {subscribersData?.totalResults === 1 ? 'Subscriber' : 'Subscribers'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Subscribers List */}
          <div className="space-y-4">
            {subscribersLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-neutral-700 rounded mb-2"></div>
                    <div className="w-48 h-3 bg-neutral-700 rounded"></div>
                  </div>
                  <div className="w-20 h-6 bg-neutral-700 rounded"></div>
                </div>
              ))
            ) : subscribersError ? (
              // Error state
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-400 text-2xl">!</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-50 mb-2">Failed to load subscribers</h3>
                <p className="text-neutral-400 mb-4">There was an error loading the subscriber list.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : !subscribersData?.subscribers?.length ? (
              // Empty state
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuUsers className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-50 mb-2">No subscribers yet</h3>
                <p className="text-neutral-400">This publication doesn't have any subscribers at the moment.</p>
              </div>
            ) : (
              // Subscribers list
              (subscribersData.subscribers as Subscriber[]).map((subscriber) => (
                <SubscriberPerson
                  key={subscriber._id}
                  username={subscriber.username}
                  subscriptionDate={subscriber.subscription_date}
                  subscriptionStatus={subscriber.subscription_status}
                />
              ))
            )}
          </div>

          {/* Pagination Info */}
          {subscribersData && subscribersData.totalPages > 1 && (
            <div className="mt-8 text-center text-neutral-400 text-sm">
              Page {subscribersData.currentPage} of {subscribersData.totalPages}
            </div>
          )}
        </div>
      </div>

      <div className="communique sidebar bg-background hidden lg:block">
         <StreamSidebar />
      </div>
    </div>
  );
};

export default Subscribers;