import React, { useState } from "react";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import ProfileConfigurations from "../components/ProfileConfigurations";
import ProfileBody from "../components/ProfileBody";
import ProfileDetails from "../components/ProfileDetails";
import ProfileHeroButtons from "../components/ProfileHeroButtons";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import ProfileAbout from "../components/ProfileAbout";
import ProfilePosts from "../components/ProfilePosts";
import ProfileArticles from "../components/ProfileArticles";
import ProfileMedia from "../components/ProfileMedia";
import { useTranslation } from "react-i18next";

const tabs = [
  { id: 'about', title: "About" },
  { id: 'posts', title: "Posts" },
  { id: 'articles', title: "Articles" },
  { id: 'media', title: "Media" }
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const { t } = useTranslation();
  
  return (
    <div className={`grid grid-cols-[4fr_1.66fr] `}>
      <div className="profile border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>{t(`Profile`)}</p>
        </Topbar>

        {/* profile content */}
        <div className="profile__content px-20">
          <ProfileBody>
            <div className="flex items-center">
              <div className="flex-1">
                <ProfileDetails />
              </div>
              <ProfileHeroButtons />
            </div>
          </ProfileBody>

          <div className="mt-6">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={false}
            />
          </div>

          <div className="mt-6 ">
            {activeTab === "about" && <ProfileAbout />}
            {activeTab === "posts" && <ProfilePosts />}
            {activeTab === "articles" && <ProfileArticles />}
            {activeTab === "media" && <ProfileMedia />}
          </div>
        </div>
      </div>

      {/*configurations Section */}
      <div className="profile__configurationz">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default Profile;
