import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import ProfileAbout from "../components/ProfileAbout";
import ProfileArticles from "../components/ProfileArticles";
import ProfileBody from "../components/ProfileBody";
import ProfileConfigurations from "../components/ProfileConfigurations";
import ProfileDetails from "../components/ProfileDetails";
import ProfileHeroButtons from "../components/ProfileHeroButtons";
import ProfileMedia from "../components/ProfileMedia";
import ProfilePosts from "../components/ProfilePosts";
import { useGetUserByUsername } from "../hooks";
import { useUser } from "../../../hooks/useUser";
import SimilarProfiles from "../components/SimilarProfiles";
import { User } from "lucide-react";
import ProfileSkeleton from "../components/ProfileSkeleton";

import BlogSkeletonComponent from "../../Blog/components/BlogSkeleton"; // Adjust path
import { useGetAuthorArticles, useGetAuthorPosts } from "../../Blog/hooks/useArticleHook";
import ProfileRightSideSkeleton from "../components/ProfileRightSideSkeleton";


const Profile: React.FC = () => {
  
  const { t } = useTranslation();
  const { username } = useParams<{ username?: string }>();
  const { authUser } = useUser();
  const bottomRef = useRef<HTMLDivElement>(null); // Ref for infinite scroll trigger

  const { user: userByUsername, isLoading: isLoadingUsername, error: errorUsername } = useGetUserByUsername(username || "");

  const user = userByUsername;
  const isLoading = isLoadingUsername;
  const error = errorUsername;
  const authorId = user?.id || "";

  // Infinite scrolling hooks
  const {
    data: authorPostsData,
    isLoading: isLoadingPosts,
    error: postsError,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useGetAuthorPosts(authorId);

  const {
    data: authorArticlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
    fetchNextPage: fetchNextArticles,
    hasNextPage: hasNextArticles,
    isFetchingNextPage: isFetchingNextArticles,
  } = useGetAuthorArticles(authorId);

  useEffect(() => {
    if (user) {
      console.log("Displayed username:", user?.username);
      console.log("Username from params:", username);
      console.log("authUser", authUser);
      console.log(username?.trim() === authUser?.username?.trim());
    }
  }, [user, username, authUser]);

  const isAuthUser = username?.trim() === authUser?.username?.trim();

  const tabs = [
    { id: "about", title: "About" },
    {
      id: "posts",
      title: `Posts (${authorPostsData?.pages[0]?.totalPosts || 0})`,
    },
    {
      id: "articles",
      title: `Articles (${authorArticlesData?.pages[0]?.totalArticles || 0})`,
    },
    { id: "media", title: "Media" },
  ];
  
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  // Infinite scrolling observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "posts" && hasNextPosts && !isFetchingNextPosts) {
            console.log("Fetching next author posts...");
            fetchNextPosts();
          } else if (activeTab === "articles" && hasNextArticles && !isFetchingNextArticles) {
            console.log("Fetching next author articles...");
            fetchNextArticles();
          }
        }
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.5,
      }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current); // Fixed to bottomRef
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current); // Fixed to bottomRef
      }
    };
  }, [
    activeTab,
    fetchNextPosts,
    hasNextPosts,
    isFetchingNextPosts,
    fetchNextArticles,
    hasNextArticles,
    isFetchingNextArticles,
  ]);

  useEffect(()=>{
    if(user)console.log('picture',user.profile_picture)
  },[user])

  if (isLoading) {
    return (
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="profile lg:border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("profile.profile")}</p>
          </Topbar>
          <div className=" px-5 md:px-10 lg:px-20">
            <ProfileSkeleton />
          </div>
          
        </div>
        <div className="hidden bg-background lg:block">
        <ProfileRightSideSkeleton/>
        </div>
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="profile border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("profile.profile")}</p>
          </Topbar>
          <div>{error.message || t("profile.errors.profileError")}</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="profile border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("profile.profile")}</p>
          </Topbar>
          <div>{t("profile.alerts.noUser")}</div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="profile border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <p>{t("profile.profile")}</p>
        </Topbar>

        <div className="profile__content sm:px-5 md:px-10 lg:px-20  min-h-screen">
          <ProfileBody user={user}>
            <div className=" sm:flex items-center">
              <div className="flex-1">
                <ProfileDetails
                  name={user.name!}
                  town={user.address!}
                  role={user.role!}
                  user_id={user.id!}
                  bio={user.bio!}
                  isverified={user.is_verified_writer!}
                />
              </div>
              <ProfileHeroButtons
                userId={user?.id || ""}
                isAuthUser={isAuthUser}
              />
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
            {activeTab === "about" && <ProfileAbout about={user?.about || "Default About"} />}
            {activeTab === "posts" && (
              <>
                <div className="pb-10">
                  {isLoadingPosts ? (
                    <div className="p-2">
                      <BlogSkeletonComponent />
                      <BlogSkeletonComponent />
                    </div>
                  ) : (
                    authorPostsData?.pages.map((page, i) => (
                      <div key={i}>
                        <ProfilePosts authorId={authorId} posts={page.articles} />
                      </div>
                    ))
                  )}
                  {isFetchingNextPosts && (
                    <div className="p-2">
                      <BlogSkeletonComponent />
                      <BlogSkeletonComponent />
                    </div>
                  )}
                </div>
                <div>{postsError && postsError.message}</div>
              </>
            )}
            {activeTab === "articles" && (
              <>
                <div className="pb-10">
                  {isLoadingArticles ? (
                    <div className="p-2">
                      <BlogSkeletonComponent />
                      <BlogSkeletonComponent />
                    </div>
                  ) : (
                    authorArticlesData?.pages.map((page, i) => (
                      <div key={i}>
                        <ProfileArticles authorId={authorId} articles={page.articles} />
                      </div>
                    ))
                  )}
                  {isFetchingNextArticles && (
                    <div className="p-2">
                      <BlogSkeletonComponent />
                      <BlogSkeletonComponent />
                    </div>
                  )}
                </div>
                <div>{articlesError && articlesError.message}</div>
              </>
            )}
            {activeTab === "media" && <ProfileMedia userId={user.id!} />}
            <div ref={bottomRef} style={{ height: "100px" }} />
          </div>
        </div>
      </div>

      <div className="profile__configurations bg-background hidden lg:block">
        {isAuthUser ? (
          <ProfileConfigurations />
        ) : (
          <div>
            <div className="py-7 px-4 font-semibold text-neutral-50 flex items-center gap-2">
              <User className="text-main-green" size={20} />
              {t("profile.similarProfile")}
            </div>
            <SimilarProfiles />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;