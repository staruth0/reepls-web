import React, { useEffect, useState } from 'react'
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations'
import Topbar from '../../../components/atoms/Topbar/Topbar'
import { t } from 'i18next'
import Tabs from '../../../components/molecules/Tabs/Tabs'
import NoStream from '../components/NoStream'
import ContributorStreams from '../components/ContributorStreams'
import StreamItemEllipsis from '../components/StreamItemEllipsis'
import { useGetMyCollaboratorPublications, useGetMyPublications, useGetUserSubscriptions } from '../Hooks'
import { Publication } from '../../../models/datamodels'

const StreamManagement:React.FC = () => {

  const { data: streams, isLoading, error } = useGetMyPublications();

  const { data: contributorStreams } = useGetMyCollaboratorPublications();
  
  const { data: subscribedStreams, isLoading: isLoadingSubscribed, error: errorSubscribed } = useGetUserSubscriptions();

  useEffect(() => {
    console.log('subscribedStreams', subscribedStreams);
  }, [subscribedStreams]);

  useEffect(() => {
    console.log('contributorStreams', contributorStreams);
  }, [contributorStreams]);

    const tabs = [
    { id: "created", title: "Created Streams" },
    { id: "subscribed", title: "Subscribed Streams" },
  ];
  
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);


  return (
     <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="profile border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <p>{t("Streams")}</p>
        </Topbar>

        <div className="profile__content sm:px-5 md:px-10 lg:px-20 min-h-screen">
        
          <div className="mt-6">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={false}
              borderBottom={true}
            />
          </div>
           <div className='mt-6 w-full '>
           {/* Created Streams Tab */}
           {activeTab === 'created' && (
             <>
               {isLoading && (
                 <div className="flex justify-center items-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
                 </div>
               )}

               {error && (
                 <div className="text-center py-8 text-red-500">
                   <p>Error loading streams. Please try again later.</p>
                 </div>
               )}

               {!isLoading && !error && (
                 streams && streams.length > 0 ? <ContributorStreams/> : <NoStream/>
               )}
             </>
           )}

           {/* Subscribed Streams Tab */}
           {activeTab === 'subscribed' && (
             <div className='w-full flex flex-col max-w-3xl mx-auto'>
               {isLoadingSubscribed && (
                 <div className="flex justify-center items-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
                 </div>
               )}

               {errorSubscribed && (
                 <div className="text-center py-8 text-red-500">
                   <p>Error loading subscribed streams. Please try again later.</p>
                 </div>
               )}

               {!isLoadingSubscribed && !errorSubscribed && (
                 <div className="mb-6 mt-6 p-8">
                   {subscribedStreams?.publications && subscribedStreams.publications.length > 0 ? (
                     subscribedStreams.publications.map((stream: Publication) => (
                       <StreamItemEllipsis key={stream._id} author={stream} />
                     ))
                   ) : (
                     <div className="text-center text-neutral-400">No subscribed streams found.</div>
                   )}
                 </div>
               )}
             </div>
           )}
           </div>
        </div>
      </div>

      <div className="profile__configurations bg-background hidden lg:block">
          <ProfileConfigurations />
      </div>
    </div>
  )
}

export default StreamManagement