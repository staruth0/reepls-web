import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import Tabs from '../../../components/molecules/Tabs/Tabs';
import { AuthContext } from '../../../context/AuthContext/authContext';
import ProfileAbout from '../components/ProfileAbout';
import ProfileArticles from '../components/ProfileArticles';
import ProfileBody from '../components/ProfileBody';
import ProfileConfigurations from '../components/ProfileConfigurations';
import ProfileDetails from '../components/ProfileDetails';
import ProfileHeroButtons from '../components/ProfileHeroButtons';
import ProfileMedia from '../components/ProfileMedia';
import ProfilePosts from '../components/ProfilePosts';
import { useGetUserById, useGetUserByUsername } from '../hooks';

const tabs = [
  { id: 'about', title: 'About' },
  { id: 'posts', title: 'Posts' },
  { id: 'articles', title: 'Articles' },
  { id: 'media', title: 'Media' },
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const { t } = useTranslation();
  const { authState } = useContext(AuthContext);
  const { username } = useParams();

  const { user, isLoading, error } = username? useGetUserByUsername(username) : useGetUserById(authState?.userId || '');

  useEffect(() => {
    console.log('profileid', user);
    console.log('params', username);
  }, [user]);

  return (
    <div className={`grid grid-cols-[4fr_1.66fr] `}>
      <div className="profile border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>{t(`Profile`)}</p>
        </Topbar>

        {/* profile content */}
        {error && <div>{error.message}</div>}
        {isLoading ? (
          <div>Loading</div>
        ) : (
          <div className="profile__content px-20">
            <ProfileBody>
              <div className="flex items-center">
                <div className="flex-1">
                  <ProfileDetails
                    name={user?.username || "Default Name"}
                    town={user?.address || "Default Town"}
                    occupation={user?.title || "Default Occupation"}
                  />
                </div>
                <ProfileHeroButtons userId={authState?.userId || ""} />
              </div>
            </ProfileBody>

            <div className="mt-6">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                scale={false}
                borderBottom={true}
              />
            </div>

            <div className="mt-6 ">
              {activeTab === "about" && (
                <ProfileAbout bio={user?.bio || "Default Bio"} />
              )}
              {activeTab === "posts" && (
                <ProfilePosts authorId={user?.id || ""} />
              )}
              {activeTab === "articles" && (
                <ProfileArticles authorId={user?.id || ""} />
              )}
              {activeTab === "media" && <ProfileMedia />}
            </div>
          </div>
        )}
      </div>

      {/*configurations Section */}
      <div className="profile__configurationz hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default Profile;
