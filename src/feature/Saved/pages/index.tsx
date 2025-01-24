import React, { useState } from 'react'
import Topbar from '../../../components/atoms/Topbar/Topbar';
import Tabs from '../../../components/molecules/Tabs/Tabs';
import ProfilePosts from '../../Profile/components/ProfilePosts';
import ProfileArticles from '../../Profile/components/ProfileArticles';
import ProfileAbout from '../../Profile/components/ProfileAbout';
import AuthorComponent from '../Components/AuthorComponent';

const tabs = [
  { id: "posts", title: "Posts" },
  { id: "articles", title: "Articles" },
  { id: "history", title: "Reading History" },
];

const Bookmarks: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  return (
    <div className={`grid grid-cols-[4fr_1.66fr] `}>
      <div className="saved border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>Saved</p>
        </Topbar>

        {/* saved  content */}
        <div className="notification__content px-20 mt-5 min-h-screen">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scale={false}
            tabs={tabs}
            borderBottom={true}
          />
          <div className="px-6 mt-4">14 saved posts</div>

          <div className="mt-6 ">
            {activeTab === "posts" && <ProfilePosts />}
            {activeTab === "articles" && <ProfileArticles />}
            {activeTab === "history" && <ProfileAbout />}
          </div>
        </div>
      </div>

      <div className="saved__authors px-6 py-4 hidden lg:block">
        <p className="">Your top saved Authors</p>
        <div className="mt-10 flex flex-col gap-6">
          <AuthorComponent />
          <AuthorComponent />
          <AuthorComponent />
        </div>
      </div>
    </div>
  );
}

export default Bookmarks