import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import { AuthContext } from "../../../context/AuthContext/authContext";
import ProfileAbout from "../components/ProfileAbout";
import ProfileArticles from "../components/ProfileArticles";
import ProfileBody from "../components/ProfileBody";
import ProfileConfigurations from "../components/ProfileConfigurations";
import ProfileDetails from "../components/ProfileDetails";
import ProfileHeroButtons from "../components/ProfileHeroButtons";
import ProfileMedia from "../components/ProfileMedia";
import ProfilePosts from "../components/ProfilePosts";
import { useGetUserById, useGetUserByUsername } from "../hooks";
import { useUser } from "../../../hooks/useUser";
import SimilarProfiles from "../components/SimilarProfiles";
import { User } from "lucide-react";
import ProfileSkeleton from "../components/ProfileSkeleton";

const tabs = [
  { id: "about", title: "About" },
  { id: "posts", title: "Posts" },
  { id: "articles", title: "Articles" },
  { id: "media", title: "Media" },
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const { t } = useTranslation();
  const { username } = useParams<{ username?: string }>();
  const { authUser } = useUser();
  const { authState } = useContext(AuthContext);

  
  const {user: userByUsername,isLoading: isLoadingUsername,error: errorUsername} = useGetUserByUsername(username || "");
  const {user: userById,isLoading: isLoadingId,error: errorId} = useGetUserById(authState?.userId || "");

  // Determine which user data to display
  const user = username ? userByUsername : userById;
  const isLoading = username ? isLoadingUsername : isLoadingId;
  const error = username ? errorUsername : errorId;

  useEffect(() => {
    if (user) {
      console.log("Displayed user:", user);
      console.log("Username from params:", username);
    }
  }, [user, username]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-[4fr_1.65fr]">
        <div className="profile border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("Profile")}</p>
          </Topbar>
          <div className="px-20">
            <ProfileSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-[4fr_1.65fr]">
        <div className="profile border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("Profile")}</p>
          </Topbar>
          <div>{error.message || t("Error loading profile")}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="grid grid-cols-[4fr_1.65fr]">
        <div className="profile border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("Profile")}</p>
          </Topbar>
          <div>{t("User not found")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[4fr_1.65fr]">
      <div className="profile border-r-[1px] border-neutral-500">
        <Topbar>
          <p>{t("Profile")}</p>
        </Topbar>

        <div className="profile__content px-20 min-h-screen">
          <ProfileBody>
            <div className="flex items-center">
              <div className="flex-1">
                <ProfileDetails
                  name={user.username || "Default Name"}
                  town={user.address || "Default Town"}
                  occupation={user.title || "Default Occupation"}
                  user_id={user.id || ""}
                  bio={user.bio || "Default Bio"}
                />
              </div>
              <ProfileHeroButtons userId={user?.id || ""} />
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

          <div className="mt-6">
            {activeTab === "about" && (
              <ProfileAbout bio={user.bio || "Default Bio"} />
            )}
            {activeTab === "posts" && <ProfilePosts authorId={user.id || ""} />}
            {activeTab === "articles" && <ProfileArticles authorId={user.id || ""} />}
            {activeTab === "media" && <ProfileMedia />}
          </div>
        </div>
      </div>

      {/* Configurations Section */}
      <div className="profile__configurations hidden lg:block">
        {user.id === authUser?.id ? (
          <ProfileConfigurations />
        ) : (
          <div>
            <div className="py-7 px-4 font-semibold text-neutral-50 flex items-center gap-2">
              <User className="text-main-green" size={20} />
              {t("Similar Profiles")}
            </div>
            <SimilarProfiles />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
