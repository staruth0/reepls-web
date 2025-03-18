import React, { useEffect, useRef, useState } from "react";
import { LuHistory } from "react-icons/lu";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import { useUser } from "../../../hooks/useUser";
import { Follow } from "../../../models/datamodels";
import BlogSkeletonComponent from "../../Blog/components/BlogSkeleton";
import { useGetFollowing } from "../../Follow/hooks";
import AuthorComponent from "../Components/AuthorComponent";
import { useGetSavedArticles, useGetSavedPosts } from "../../Blog/hooks/useArticleHook";
import SignInPopUp from "../../AnonymousUser/components/SignInPopUp";
import SavedPostsContainer from "../Components/SavedPostsContaniner";
import SavedArticlesContainer from "../Components/SavedArticleContainer";

const Bookmarks: React.FC = () => {
  const { authUser, isLoggedIn } = useUser();
  const { data: followingsData } = useGetFollowing(authUser?.id || "");
  const [followings, setFollowings] = useState<Follow[]>([]);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    data: savedPostsData,
    isLoading: isLoadingPosts,
    error: postsError,
    fetchNextPage: fetchNextPosts,
    hasNextPage: hasNextPosts,
    isFetchingNextPage: isFetchingNextPosts,
  } = useGetSavedPosts();

  const {
    data: savedArticlesData,
    isLoading: isLoadingArticles,
    error: articlesError,
    fetchNextPage: fetchNextArticles,
    hasNextPage: hasNextArticles,
    isFetchingNextPage: isFetchingNextArticles,
  } = useGetSavedArticles();

  const tabs = [
    {
      id: "posts",
      title: `Posts (${savedPostsData?.pages?.flatMap((page) => page.articles)?.length || 0})`,
    },
    {
      id: "articles",
      title: `Articles (${savedArticlesData?.pages?.flatMap((page) => page.articles)?.length || 0})`,
    },
    { id: "history", title: "Reading History", icon: <LuHistory className="mx-2" /> },
  ];

  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  useEffect(() => {
    setFollowings(followingsData?.data || []);
  }, [followingsData]);

  useEffect(() => {
    if (!isLoggedIn) return; // Skip observer setup if not logged in

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "posts" && hasNextPosts && !isFetchingNextPosts) {
            console.log("Fetching next saved posts...");
            fetchNextPosts();
          } else if (activeTab === "articles" && hasNextArticles && !isFetchingNextArticles) {
            console.log("Fetching next saved articles...");
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
    isLoggedIn,
    activeTab,
    fetchNextPosts,
    hasNextPosts,
    isFetchingNextPosts,
    fetchNextArticles,
    hasNextArticles,
    isFetchingNextArticles,
  ]);

  const handleTabClick = (tabId: number | string) => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
    } else {
      setActiveTab(tabId);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="grid grid-cols-[4fr_1.65fr]">
        <div className="saved border-r-[1px] border-neutral-500">
          <Topbar>
            <div className="relative px-3 flex justify-between items-center w-full">
              <p>Saved</p>
            </div>
          </Topbar>
          <div className="notification__content px-20 mt-5 min-h-screen flex flex-col items-center">
            <div className="w-[82%]">
              <Tabs
                activeTab={activeTab}
                setActiveTab={handleTabClick}
                scale={false}
                tabs={tabs}
                borderBottom={true}
              />
            </div>
            <div className="px-2 mt-6 w-full">
              <SignInPopUp
                text={`view ${activeTab === "posts" ? "saved posts" : activeTab === "articles" ? "saved articles" : "reading history"}`}
                position="below"
                onClose={() => setShowSignInPopup(false)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[4fr_1.65fr]">
      <div className="saved border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="relative px-3 flex justify-between items-center w-full">
            <p>Saved</p>
            {showSignInPopup && (
              <SignInPopUp
                text={`view ${activeTab === "posts" ? "saved posts" : activeTab === "articles" ? "saved articles" : "reading history"}`}
                position="below"
                onClose={() => setShowSignInPopup(false)}
              />
            )}
          </div>
        </Topbar>

        <div className="notification__content px-20 mt-5 min-h-screen flex flex-col items-center">
          <div className="w-[82%]">
            <Tabs
              activeTab={activeTab}
              setActiveTab={handleTabClick}
              scale={false}
              tabs={tabs}
              borderBottom={true}
            />
          </div>

          <div className="px-2 mt-6 w-full">
            {activeTab === "posts" && (
              <>
                <div className="pb-10">
                  {isLoadingPosts ? (
                    <div className="p-2">
                      <BlogSkeletonComponent />
                      <BlogSkeletonComponent />
                    </div>
                  ) : postsError ? (
                    <div className="text-red-500">{postsError.message}</div>
                  ) : (
                    savedPostsData?.pages.map((page, i) => (
                      <div key={i}>
                        <SavedPostsContainer posts={page.articles} />
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
                  ) : articlesError ? (
                    <div className="text-red-500">{articlesError.message}</div>
                  ) : (
                    savedArticlesData?.pages.map((page, i) => (
                      <div key={i}>
                        <SavedArticlesContainer articles={page.articles} />
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
              </>
            )}
            {activeTab === "history" && <div>Reading History</div>}
            <div ref={bottomRef} style={{ height: "100px" }} />
          </div>
        </div>
      </div>

      <div className="saved__authors px-6 py-4 hidden lg:block">
        <p>Your top saved Authors</p>
        <div className="mt-10 flex flex-col gap-6">
          {followings.length > 0 ? (
            followings.map((following: Follow, index: number) => (
              <AuthorComponent
                key={`${following?.followed_id?.id}-${index}`}
                user={following.followed_id}
              />
            ))
          ) : (
            <p className="text-neutral-500 text-center">No followings yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;