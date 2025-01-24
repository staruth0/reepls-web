import React, { useState } from 'react'
import ProfileConfigurations from '../components/ProfileConfigurations'
import Topbar from '../../../components/atoms/Topbar/Topbar'
import { useTranslation } from 'react-i18next'
import Tabs from '../../../components/molecules/Tabs/Tabs'
import AuthorComponent from '../../Saved/Components/AuthorComponent'

const tabs = [
  { id: "1", title: "Following" },
  { id: "2", title: "Followers" },

];

const Followers: React.FC = () => {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
    
  return (
    <div className={`grid grid-cols-[4fr_1.66fr] `}>
      <div className="profile border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>{t(`Profile`)}</p>
        </Topbar>
        <div className="px-20">
          <div className="mt-6 flex justify-center">
            <div className="w-[200px] justify-center">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                scale={true}
                borderBottom={true}
              />
            </div>
          </div>

          <div className="mt-6 px-10 ">
            {activeTab === "1" && (
              <div className="mt-4 flex flex-col gap-4">
                <AuthorComponent />
                <AuthorComponent />
                
              </div>
            )}
            {activeTab === "2" && (
              <div className="mt-4 flex flex-col gap-4">
                <AuthorComponent />
                <AuthorComponent />
                <AuthorComponent />
              </div>
            )}
          </div>
        </div>
      </div>
      {/*configurations Section */}
      <div className="profile__configurationz hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
}

export default Followers