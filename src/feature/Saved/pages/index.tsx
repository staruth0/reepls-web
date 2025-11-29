import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { LuHistory, LuHeadphones } from 'react-icons/lu';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { useUser } from '../../../hooks/useUser';
import { Follow } from '../../../models/datamodels';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetFollowing } from '../../Follow/hooks';
import { useGetReadingHistory, useGetSavedArticles } from '../../Saved/hooks';
import AuthorComponent from '../Components/AuthorComponent';
import { useGetMySavedPodcasts } from '../../Podcast/hooks';

import AuthSkeletonComponent from '../../../components/atoms/AuthorComponentSkeleton';
import { toast } from 'react-toastify'; // Added for toast notifications
import SavedPostsContainer from '../Components/SavedPostsContaniner';
import SavedArticlesContainer from '../Components/SavedArticleContainer';
import { useTranslation } from 'react-i18next';
import ReadingHistoryContainer from '../Components/ReadingHistoryContainer';
import SavedPodcastsContainer from '../Components/SavedPodcastsContainer';
import SavedRepostsContainer from '../Components/SavedRepostsContainer'; // Add this import
import { useGetSavedReposts } from '../../Repost/hooks/useRepost';
import MainContent from '../../../components/molecules/MainContent';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface Article {
  id: string;
  isArticle: boolean;
  // Add other Article properties
}

interface SavedArticleWrapper {
  article: Article;
}

interface SavedArticlesResponse {
  articles: SavedArticleWrapper[];
}

interface SavedTabsProps {
  tabs: { id: string; title: string }[];
  activeTab: string | number;
  setActiveTab: (tabId: string | number) => void;
}

const SavedTabs: React.FC<SavedTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
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
    <div className="w-full">
      <div 
        ref={tabRef}
        className="relative flex overflow-x-auto scroll-smooth
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          border-b border-neutral-300
          lg:justify-between lg:overflow-x-visible"
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

const Bookmarks: React.FC = () => {
  const { authUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: savedArticlesData, isLoading: isLoadingSavedArticles, error: savedArticlesError } = useGetSavedArticles();
  const { data: followingsData, isLoading: isLoadingFollowings, error: followingsError } = useGetFollowing(authUser?.id || '');
  const { data: savedPodcastsData,  error: savedPodcastsError } = useGetMySavedPodcasts();
  const [savedPosts, setSavedPosts] = useState<Article[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [followings, setFollowings] = useState<Follow[]>([]);
  const {data} = useGetReadingHistory(); 
  const { data:Reposts } = useGetSavedReposts();
 

  const {t} = useTranslation();

  // Function to get friendly error messages
  const getFriendlyErrorMessage = useCallback((error: Error | { response?: { status: number }, message: string }, context: 'articles' | 'followings' | 'podcasts'): string => {
    if (!error) return t("saved.errorMessages.default", {context});

    if (error.message.includes("Network Error")) {
      return t("saved.errorMessages.networkError");
    }
    if ('response' in error && error.response) {
      const status = error.response.status;
      if (status === 404) {
        return context === 'articles'
          ? t("saved.errorMessages.notFoundPostOrArticle")
          : t("saved.errorMessages.notFoundAuthors");
      }
      if (status === 500) {
        return t("saved.errorMessages.serverError");
      }
      if (status === 429) {
        return t("saved.errorMessages.tooManyRequest");
      }
    }

    return t("saved.errorMessages.default", {context});
  }, [t]);

  // Toast error notifications
  useEffect(() => {
    if (savedArticlesError) {
      toast.error(getFriendlyErrorMessage(savedArticlesError, 'articles'));
    }
    if (followingsError) {
      toast.error(getFriendlyErrorMessage(followingsError, 'followings'));
    }
    if (savedPodcastsError) {
      toast.error(getFriendlyErrorMessage(savedPodcastsError, 'podcasts'));
    }
  }, [savedArticlesError, followingsError, savedPodcastsError, getFriendlyErrorMessage]);

  // Filter and separate saved articles into posts and articles
useEffect(() => {
  if (!savedArticlesData) return;

  const articles = (savedArticlesData as SavedArticlesResponse)?.articles || [];
  const posts = articles
    .filter((item: SavedArticleWrapper) => item?.article && !item.article.isArticle)
    .map((item: SavedArticleWrapper) => item.article);
  const articlesList = articles
    .filter((item: SavedArticleWrapper) => item?.article && item.article.isArticle)
    .map((item: SavedArticleWrapper) => item.article);
  
  setSavedPosts(posts || []);
  setSavedArticles(articlesList || []);

  // Auto-switch to articles tab if there are articles and no posts, or if articles tab has more content
  // Only auto-switch if no specific tab was requested via URL parameter
  const requestedTab = searchParams.get('tab');
  if (!requestedTab) {
    if ((articlesList?.length || 0) > 0 && (posts?.length || 0) === 0) {
      setActiveTab('articles');
    } else if ((articlesList?.length || 0) > (posts?.length || 0) && (articlesList?.length || 0) > 0) {
      setActiveTab('articles');
    }
  }
}, [savedArticlesData, searchParams]);

  useEffect(() => {
    setFollowings(followingsData?.data || []);
  }, [followingsData]);

  const tabs = [
    { id: 'posts', title: `${t("saved.tabs.posts")} (${savedPosts?.length || 0})` },
    { id: 'articles', title: `${t("saved.tabs.articles")} (${savedArticles?.length || 0})` },
    { id: 'podcasts', title: `Podcasts (${savedPodcastsData?.data?.totalResults || savedPodcastsData?.data?.results?.length || 0})` },
    { id: 'reposts', title: `Reposts (${Reposts?.reposts?.length || 0})` }, // Add this tab
    { id: 'history', title: `${t("saved.tabs.history")}` },
  ];

  const [activeTab, setActiveTab] = useState<number | string>(searchParams.get('tab') || 'posts');

  // Loading state for saved content
  if (isLoadingSavedArticles) {
    return (
      <MainContent> 
      <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
        <div className="saved border-r-[1px] min-h-screen border-neutral-500">
          <Topbar>
            <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t("saved.title")}</p>
          </div>
          </Topbar>
          <div className="notification__content sm:px-5 md:px-10 lg:px-20 mt-5 min-h-screen flex flex-col items-center">
            <div className="w-full lg:w-[82%]">
              <SavedTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            </div>
            <div className="px-2 mt-6 w-full">
              <div className="p-2">
                <BlogSkeletonComponent />
                <BlogSkeletonComponent />
              </div>
            </div>
          </div>
        </div>
        <div className="saved__authors px-6 py-4 hidden lg:block">
          <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t("saved.topSavedAuthors")}</p>
          </div>
          <div className="mt-10 flex flex-col gap-6">
            {isLoadingFollowings ? (
              <>
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
              </>
            ) : (
              <p className="text-neutral-500 text-center">{t("loading")}</p>
            )}
          </div>
        </div>
      </div>
      </MainContent>
    );
  }

  // Error state for saved articles
  if (savedArticlesError) {
    return (
      <MainContent> 
      <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
        <div className="saved border-r-[1px] min-h-screen border-neutral-500">
          <Topbar>
              <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t("saved.title")}</p>
          </div>
          </Topbar>
          <div className="notification__content sm:px-5 md:px-10 lg:px-20 mt-5 min-h-screen flex flex-col items-center">
            <div className="w-full lg:w-[82%]">
              <SavedTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
            </div>
            <div className="px-2 mt-6 w-full">
              <p className="text-neutral-50 text-center py-4">
                {getFriendlyErrorMessage(savedArticlesError, 'articles')}
              </p>
            </div>
          </div>
        </div>
        <div className="saved__authors px-6 py-4 hidden lg:block">
          <p>{t("saved.topSavedAuthors")}</p>
          <div className="mt-10 flex flex-col gap-6">
            {isLoadingFollowings ? (
              <>
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
                <AuthSkeletonComponent />
              </>
            ) : followingsError ? (
              <p className="text-neutral-50 text-center py-4">
                {getFriendlyErrorMessage(followingsError, 'followings')}
              </p>
            ) : (followings?.length || 0) > 0 ? (
              followings.map((following: Follow, index: number) => (
                <AuthorComponent
                  key={`${following?.followed_id?.id}-${index}`}
                  username={following?.followed_id?.username || ''}
                />
              ))
            ) : (
              <p className="text-neutral-500 text-center">{t("saved.noFollowings")}</p>
            )}
          </div>
        </div>
      </div>
      </MainContent>
    );
  }

  // Success state
  return (
    <MainContent> 
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="saved border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <div className="flex items-center gap-2">
            <p className="text-neutral-50 font-semibold">{t("saved.title")}</p>
          </div>
        </Topbar>
        <div className="notification__content  md:px-10 lg:px-20 mt-5 min-h-screen flex flex-col items-center">
          <div className="w-full lg:w-[88%]">
            <SavedTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
          </div>
          <div className="px-2 mt-6 w-full min-h-screen flex flex-col items-center ">
            {activeTab === 'posts' && (
              <div className="pb-10">
                <SavedPostsContainer posts={savedPosts} isLoading={isLoadingSavedArticles} />
              </div>
            )}
            {activeTab === 'articles' && (
              <div className="pb-10">
                <SavedArticlesContainer articles={savedArticles} isLoading={isLoadingSavedArticles} />
              </div>
            )}
            {activeTab === 'podcasts' && (
              <div className="pb-10">
                <SavedPodcastsContainer />
              </div>
            )}
            {activeTab === 'reposts' && (
              <div className="pb-10">
                <SavedRepostsContainer />
              </div>
            )}
            {activeTab === 'history' && (
              <div className="pb-10">
                <ReadingHistoryContainer articles={data?.readArticles || []} />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="saved__authors bg-background px-6 py-4 hidden lg:block ">
        <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t("saved.topSavedAuthors")}</p>
          </div>
        <div className="mt-10 flex flex-col gap-6">
          {isLoadingFollowings ? (
            <>
              <AuthSkeletonComponent />
              <AuthSkeletonComponent />
              <AuthSkeletonComponent />
              <AuthSkeletonComponent />
              <AuthSkeletonComponent />
              <AuthSkeletonComponent />
            </>
          ) : followingsError ? (
            <p className="text-neutral-50 text-center py-4">
              {getFriendlyErrorMessage(followingsError, 'followings')}
            </p>
          ) : followings.length > 0 ? (
            followings.map((following: Follow, index: number) => (
              <AuthorComponent
                key={`${following?.followed_id?.id}-${index}`}
                username={following?.followed_id?.username || ''}
              />
            ))
          ) : (
            <p className="text-neutral-500 text-center">{t("saves.errorMessages.noFollowings")}</p>
          )}
        </div>
      </div>
    </div>
    </MainContent>
  );
};

export default Bookmarks;