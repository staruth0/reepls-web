import React, { useEffect, useState } from "react";
import ProfileConfigurations from "../components/ProfileConfigurations";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import { useTranslation } from "react-i18next";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import AuthorComponent from "../../Saved/Components/AuthorComponent";
import { useParams } from "react-router-dom";
import { useGetFollowers, useGetFollowing } from "../../Follow/hooks"; // Import useGetFollowing
import { Follow } from "../../../models/datamodels";

const tabs = [
  { id: "1", title: "Following" },
  { id: "2", title: "Followers" },
];

const Followers: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const { user_id } = useParams<{ user_id?: string }>();

  // Use correct hooks for followers and following
  const { data: followersData } = useGetFollowers(user_id || "");
  const { data: followingsData } = useGetFollowing(user_id || ""); 


  const followers = followersData?.data || [];
  const followings = followingsData?.data || [];

  useEffect(() => {
    if (followersData) console.log("followers", followersData);
    if (followingsData) console.log("followings", followingsData);
  }, [followersData, followingsData]);

  return (
    <div className={`lg:grid grid-cols-[4fr_1.66fr] `}>
      <div className="profile lg:border-r-[1px] min-h-screen border-neutral-500 ">
        <Topbar>
          <p>{t(`profile.profile`)}</p>
        </Topbar>
        <div className="sm:px-5 md:px-10 lg:px-20 ">
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
                {followings.length > 0 ? (
                  followings.map((following: Follow) => (
                    <AuthorComponent
                      key={following?.followed_id?.id}
                      username={following?.followed_id?.username || ''} 
                    />
                  ))
                ) : (
                  <p className="text-neutral-500 text-center">
                    {t("profile.alerts.noFollowings")}
                  </p>
                )}
              </div>
            )}
            {activeTab === "2" && (
              <div className="mt-4 flex flex-col gap-4">
                {followers.length > 0 ? (
                  followers.map((follower: Follow) => (
                    <AuthorComponent
                      key={follower?.follower_id?.id}
                      username={follower?.follower_id?.username || ''} 
                    />
                  ))
                ) : (
                  <p className="text-neutral-500 text-center">
                    {t("profile.alerts.noFollowings")}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Configurations Section */}
      <div className="profile__configurationz bg-background hidden lg:block">
        <ProfileConfigurations />
      </div>
    </div>
  );
};

export default Followers;
