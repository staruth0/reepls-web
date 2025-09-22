import React, { useEffect, useState } from 'react'
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations'
import Topbar from '../../../components/atoms/Topbar/Topbar'
import { t } from 'i18next'
import Tabs from '../../../components/molecules/Tabs/Tabs'
import NoStream from '../components/NoStream'
import ContributorStreams from '../components/ContributorStreams'
import { useGetMyCollaboratorPublications, useGetMyPublications } from '../Hooks'

const StreamManagement:React.FC = () => {
  const { data: streams, isLoading, error } = useGetMyPublications();

  const { data: contributorStreams } = useGetMyCollaboratorPublications();

  useEffect(() => {
    console.log('contributorStreams', contributorStreams);
  }, [contributorStreams]);

    const tabs = [

    { id: "create", title: "Create Stream" },
    { id: "contributor", title: "Contributor Streams" },
    { id: "past", title: "Pasts Streams" },
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
           {/* Loading State */}
           {isLoading && (
             <div className="flex justify-center items-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
             </div>
           )}

           {/* Error State */}
           {error && (
             <div className="text-center py-8 text-red-500">
               <p>Error loading streams. Please try again later.</p>
             </div>
           )}

           {/* Content when not loading and no error */}
           {!isLoading && !error && (
             <>
               {activeTab === 'create' && (
                streams && streams.length > 0 ? <ContributorStreams/> : <NoStream/>
               )}
               {activeTab === 'contributor' && (
                <ContributorStreams/>
               )}
               {activeTab === 'past' && (
                <div>past</div>
               )}
             </>
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