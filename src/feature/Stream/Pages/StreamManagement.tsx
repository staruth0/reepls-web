import React, { useState } from 'react'
import ProfileConfigurations from '../../Profile/components/ProfileConfigurations'
import Topbar from '../../../components/atoms/Topbar/Topbar'
import { t } from 'i18next'
import Tabs from '../../../components/molecules/Tabs/Tabs'
import NoStream from '../components/NoStream'
import ContributorStreams from '../components/ContributorStreams'

const StreamManagement:React.FC = () => {

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
           {activeTab === 'create' && (
            <NoStream/>
           )}
           {activeTab === 'contributor' && (
            <ContributorStreams/>
           )}
           {activeTab === 'past' && (
            <div>past</div>
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