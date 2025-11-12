import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import ProfileAbout from "../components/ProfileAbout";
import ProfileArticles from "../components/ProfileArticles";
import ProfileBody from "../components/ProfileBody";
import ProfileConfigurations from "../components/ProfileConfigurations";
import ProfileDetails from "../components/ProfileDetails";
import ProfileHeroButtons from "../components/ProfileHeroButtons";
import ProfileMedia from "../components/ProfileMedia";
import ProfilePosts from "../components/ProfilePosts";
import { useGetUserByUsername } from "../hooks";
import SimilarProfiles from "../components/SimilarProfiles";
import { User } from "lucide-react";
import ProfileSkeleton from "../components/ProfileSkeleton";
import BlogSkeletonComponent from "../../Blog/components/BlogSkeleton";
import { useGetAuthorArticles, useGetAuthorPosts } from "../../Blog/hooks/useArticleHook";
import ProfileRightSideSkeleton from "../components/ProfileRightSideSkeleton";
import { getDecryptedUser } from "../../Auth/api/Encryption";
import ProfileReposts from "../components/ProfileReposts";
import ProfilePodcasts from "../components/ProfilePodcasts";
import MainContent from "../../../components/molecules/MainContent";
import { useGetUserMedia } from "../hooks";
import { useGetMyReposts } from "../../Repost/hooks/useRepost";
import { useGetPodcastsByUser } from "../../Podcast/hooks";

interface ProfileTabsProps {
  tabs: { id: string; title: string }[];
  activeTab: string | number;
  setActiveTab: (tabId: string | number) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (activeTabRef.current && tabRef.current) {
      const container = tabRef.current;
      const activeElement = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      
      // Check if active tab is out of view
      if (activeRect.left < containerRect.left) {
        container.scrollTo({
          left: container.scrollLeft + (activeRect.left - containerRect.left) - 16,
          behavior: 'smooth'
        });
      } else if (activeRect.right > containerRect.right) {
        container.scrollTo({
          left: container.scrollLeft + (activeRect.right - containerRect.right) + 16,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div 
        ref={tabRef}
        className="relative flex overflow-x-auto scroll-smooth
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          border-b border-neutral-300
          lg:justify-between lg:overflow-x-visible
          -mx-5 sm:-mx-10 md:-mx-10 lg:mx-0 px-5 sm:px-10 md:px-10 lg:px-0"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex-shrink-0 px-4 py-3 cursor-pointer 
                transition-all duration-300 whitespace-nowrap
                flex items-center justify-center
                font-medium text-base
                ${isActive 
                  ? 'text-neutral-50' 
                  : 'text-neutral-400 hover:text-neutral-300'
                }
              `}
            >
              <span className="relative z-10">{tab.title}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-400 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { username } = useParams<{ username?: string }>();
  const authUser = getDecryptedUser();
  const bottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { user: userByUsername, isLoading: isLoadingUsername } = useGetUserByUsername(username || "");



  const user = userByUsername;
  const isLoading = isLoadingUsername;
  const authorId = user?.id || "";

  // Removed console.log for production performance

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

  // Get counts for other tabs
  const { data: userMediaData } = useGetUserMedia(authorId);
  const { data: repostsData } = useGetMyReposts(authorId);
  const { data: podcastsData } = useGetPodcastsByUser({ userId: authorId, page: 1, limit: 1 });

  const isAuthUser = username?.trim() === authUser?.username?.trim();

  // Memoized counts to avoid recalculating on every render
  const mediaCount = useMemo(() => {
    try {
      if (!userMediaData?.pages?.[0]) return 0;
      return userMediaData.pages[0].totalMedia || 0;
    } catch (error) {
      console.warn('Error getting media count:', error);
      return 0;
    }
  }, [userMediaData]);

  const repostsCount = useMemo(() => {
    try {
      if (!repostsData?.reposts) return 0;
      return repostsData.reposts.length || 0;
    } catch (error) {
      console.warn('Error getting reposts count:', error);
      return 0;
    }
  }, [repostsData]);

  const podcastsCount = useMemo(() => {
    try {
      if (!podcastsData?.data?.totalResults) return 0;
      return podcastsData.data.totalResults || 0;
    } catch (error) {
      console.warn('Error getting podcasts count:', error);
      return 0;
    }
  }, [podcastsData]);

  const tabs = [
    { id: "about", title: "About" },
    {
      id: "posts",
      title: `Posts${
        (authorPostsData?.pages?.[0]?.totalPosts || 0) > 0 
          ? ` (${authorPostsData?.pages?.[0]?.totalPosts || 0})` 
          : ""
      }`,
    },
    {
      id: "articles",
      title: `Articles${
        (authorArticlesData?.pages?.[0]?.totalArticles || 0) > 0 
          ? ` (${authorArticlesData?.pages?.[0]?.totalArticles || 0})` 
          : ""
      }`,
    },
    {
      id: "media",
      title: `Media${
        mediaCount > 0 
          ? ` (${mediaCount})` 
          : ""
      }`,
    },
    {
      id: "reposts",
      title: `Reposts${
        repostsCount > 0 
          ? ` (${repostsCount})` 
          : ""
      }`,
    },
    {
      id: "podcasts",
      title: `Podcasts${
        podcastsCount > 0 
          ? ` (${podcastsCount})` 
          : ""
      }`,
    },
  ];
  
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  // Infinite scrolling observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "posts" && hasNextPosts && !isFetchingNextPosts) {
            fetchNextPosts();
          } else if (activeTab === "articles" && hasNextArticles && !isFetchingNextArticles) {
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
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
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

  if (isLoading) {
    return (
      <MainContent> 
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="profile lg:border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("profile.profile")}</p>
          </Topbar>
          <div className="px-5 md:px-10 lg:px-20">
            <ProfileSkeleton />
          </div>
        </div>
        <div className="hidden bg-background lg:block">
          <ProfileRightSideSkeleton/>
        </div>
      </div>
      </MainContent>
    );
  }

  if (!user) {
    return (
      <MainContent> 
      <div className="lg:grid grid-cols-[4fr_1.65fr]">
        <div className="profile border-r-[1px] border-neutral-500 min-h-screen">
          <Topbar>
            <p>{t("profile.profile")}</p>
          </Topbar>
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="bg-neutral-800 p-6 rounded-lg max-w-md w-full">
                <User className="size-12 mx-auto text-neutral-400 mb-4" />
              <h3 className="text-xl font-medium text-neutral-100 mb-2">
                {t("title", "User Not Found")}
              </h3>
              <p className="text-neutral-300 mb-4">
                {t("description", "The profile you are looking for does not exist.")}
              </p>
              <button
                onClick={() => navigate('/auth/login/email')}
                className="px-4 py-2 bg-main-green text-white rounded-md hover:bg-green-600 transition-colors"
              >
                {t("proceedToLogin", "Proceed to Login")}
              </button>
            </div>
          </div>
        </div>
      </div>
      </MainContent>
    );
  }

  return (
    <MainContent> 
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="profile border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <p>{t("profile.profile")}</p>
        </Topbar>

        <div className="profile__content max-w-4xl mx-auto sm:px-5 md:px-10 lg:px-20 min-h-screen">
          <ProfileBody user={user}>
            <div className="sm:flex items-center">
              <div className="flex-1">
                <ProfileDetails
                  name={user.name!}
                  town={user.address!}
                  role={user.role!}
                  username={user.username!}
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
            <ProfileTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          <div className="mt-6">
            {activeTab === "about" && <ProfileAbout about={user?.about || ""} />}
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
            {activeTab === "reposts" && <ProfileReposts userId={user.id!} />}
            {activeTab === "podcasts" && <ProfilePodcasts userId={user.id!} />}
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
              <User className="text-main-green size-6" />
              {t("profile.similarProfile")}
            </div>
            <SimilarProfiles />
          </div>
        )}
      </div>
    </div>
    </MainContent>
  );
};

export default Profile;