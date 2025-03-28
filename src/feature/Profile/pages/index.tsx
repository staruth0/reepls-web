import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import ErrorFallback from "../../../components/molecules/ErrorFallback/ErrorFallback";
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
import BlogSkeletonComponent from "../../Blog/components/BlogSkeleton";
import {
  useGetAuthorArticles,
  useGetAuthorPosts,
} from "../../Blog/hooks/useArticleHook";
import ProfileRightSideSkeleton from "../components/ProfileRightSideSkeleton";
import { useQueryClient } from "@tanstack/react-query";


const SimilarProfilesErrorFallback = () => (
  <div className="p-4 text-sm text-gray-500">
    Similar profiles unavailable right now
  </div>
);

const ProfileMediaErrorFallback = () => (
  <div className="p-4 border border-dashed border-gray-300 rounded-lg">
    Media failed to load
  </div>
);

const Profile: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { username } = useParams<{ username?: string }>();
  const { authUser } = useUser();
  const bottomRef = useRef<HTMLDivElement>(null);

  // User data
  const {
    user: userByUsername,
    isLoading,
    error,
  } = useGetUserByUsername(username || "");
  const user = userByUsername;
  const authorId = user?.id || "";

  // Posts and Articles data
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

  const isAuthUser = username?.trim() === authUser?.username?.trim();

  // Tabs configuration
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

  // Infinite scroll logic (unchanged from your original)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "posts" && hasNextPosts && !isFetchingNextPosts) {
            fetchNextPosts();
          } else if (
            activeTab === "articles" &&
            hasNextArticles &&
            !isFetchingNextArticles
          ) {
            fetchNextArticles();
          }
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.5 }
    );

    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
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

  // Loading and error states
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
        <ProfileRightSideSkeleton />
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
          <div className="p-4 text-red-500">
            {error.message || t("Error loading profile")}
          </div>
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
          <div className="p-4">{t("User not found")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[4fr_1.65fr]">
      {/* Left Column - Main Profile Content */}
      <div className="profile border-r-[1px] border-neutral-500 min-h-screen">
        <Topbar>
          <p>{t("Profile")}</p>
        </Topbar>

        <div className="profile__content px-20">
          {/* Safe Components (no boundary needed) */}
          <ProfileBody>
            <div className="flex items-center">
              <div className="flex-1">
                <ProfileDetails
                  name={user.username!}
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

          {/* Tabs */}
          <div className="mt-6">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={false}
              borderBottom={true}
            />
          </div>

          {/* Tab Content with Error Boundaries */}
          <div className="mt-6">
            {activeTab === "about" && (
              <ProfileAbout about={user?.about || ""} />
            )}

            {activeTab === "posts" && (
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => {
                  queryClient.invalidateQueries({
                    queryKey: ["authorPosts", authorId],
                  });
                }}
                resetKeys={[authorId, activeTab]}
              >
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
                          <ProfilePosts
                            authorId={authorId}
                            posts={page.articles}
                          />
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
                  {postsError && (
                    <div className="text-red-500">{postsError.message}</div>
                  )}
                </>
              </ErrorBoundary>
            )}

            {activeTab === "articles" && (
              <ErrorBoundary FallbackComponent={ErrorFallback}>
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
                          <ProfileArticles
                            authorId={authorId}
                            articles={page.articles}
                          />
                        </div>
                      ))
                    )}
                  </div>
                  {articlesError && (
                    <div className="text-red-500">{articlesError.message}</div>
                  )}
                </>
              </ErrorBoundary>
            )}

            {activeTab === "media" && (
              <ErrorBoundary
                FallbackComponent={ProfileMediaErrorFallback}
                onError={(error) => console.error("Media error:", error)}
              >
                <ProfileMedia />
              </ErrorBoundary>
            )}

            <div ref={bottomRef} style={{ height: "100px" }} />
          </div>
        </div>
      </div>

      {/* Right Column - Sidebar */}
      <div className="profile__configurations hidden lg:block">
        {isAuthUser ? (
          <ProfileConfigurations />
        ) : (
          <ErrorBoundary FallbackComponent={SimilarProfilesErrorFallback}>
            <div>
              <div className="py-7 px-4 font-semibold text-neutral-50 flex items-center gap-2">
                <User className="text-main-green" size={20} />
                {t("Similar Profiles")}
              </div>
              <SimilarProfiles />
            </div>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default Profile;
