import React, { useEffect, useState } from 'react';
import { LuHistory } from 'react-icons/lu';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import Tabs from '../../../components/molecules/Tabs/Tabs';
import { useUser } from '../../../hooks/useUser';
import { Follow } from '../../../models/datamodels';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetFollowing } from '../../Follow/hooks';
import { useGetReadingHistory, useGetSavedArticles } from '../../Saved/hooks';
import AuthorComponent from '../Components/AuthorComponent';

import AuthSkeletonComponent from '../../../components/atoms/AuthorComponentSkeleton';
import { toast } from 'react-toastify'; // Added for toast notifications
import SavedPostsContainer from '../Components/SavedPostsContaniner';
import SavedArticlesContainer from '../Components/SavedArticleContainer';
import { useTranslation } from 'react-i18next';
import ReadingHistoryContainer from '../Components/ReadingHistoryContainer';

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

const Bookmarks: React.FC = () => {
  const { authUser } = useUser();

  const { data: savedArticlesData, isLoading: isLoadingSavedArticles, error: savedArticlesError } = useGetSavedArticles();
  const { data: followingsData, isLoading: isLoadingFollowings, error: followingsError } = useGetFollowing(authUser?.id || '');
  const [savedPosts, setSavedPosts] = useState<Article[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [followings, setFollowings] = useState<Follow[]>([]);
  const {data} = useGetReadingHistory(); 

  const {t} = useTranslation();

  // Function to get friendly error messages
  const getFriendlyErrorMessage = (error: any, context: 'articles' | 'followings'): string => {
    if (!error) return t("saved.errorMessages.default", {context});

    if (error.message.includes("Network Error")) {
      return t("saved.errorMessages.networkError");
    }
    if (error.response) {
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
  };

  // Toast error notifications
  useEffect(() => {
    if (savedArticlesError) {
      toast.error(getFriendlyErrorMessage(savedArticlesError, 'articles'));
    }
    if (followingsError) {
      toast.error(getFriendlyErrorMessage(followingsError, 'followings'));
    }
  }, [savedArticlesError, followingsError]);

  // Filter and separate saved articles into posts and articles
useEffect(() => {
  if (!savedArticlesData) return;
  console.log('saved articles', savedArticlesData);

  const articles = (savedArticlesData as SavedArticlesResponse)?.articles || [];
  setSavedPosts(
    articles
      .filter((item: SavedArticleWrapper) => item.article && !item.article.isArticle)
      .map((item: SavedArticleWrapper) => item.article)
  );
  setSavedArticles(
    articles
      .filter((item: SavedArticleWrapper) => item.article && item.article.isArticle)
      .map((item: SavedArticleWrapper) => item.article)
  );
}, [savedArticlesData]);

  useEffect(() => {
    setFollowings(followingsData?.data || []);
  }, [followingsData]);

  const tabs = [
    { id: 'posts', title: `${t("saved.tabs.posts")} (${savedPosts.length})` },
    { id: 'articles', title: `${t("saved.tabs.articles")} (${savedArticles.length})` },
    { id: 'history', title: `${t("saved.tabs.history")}`, icon: <LuHistory className="mx-2" /> },
  ];

  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  // Loading state for saved content
  if (isLoadingSavedArticles) {
    return (
      <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
        <div className="saved border-r-[1px] min-h-screen border-neutral-500">
          <Topbar>
            <p>{t("saved.title")}</p>
          </Topbar>
          <div className="notification__content sm:px-5 md:px-10 lg:px-20 mt-5 min-h-screen flex flex-col items-center">
            <div className="w-[82%]">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} scale={false} tabs={tabs} borderBottom={true} />
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
            ) : (
              <p className="text-neutral-500 text-center">{t("loading")}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Error state for saved articles
  if (savedArticlesError) {
    return (
      <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
        <div className="saved border-r-[1px] min-h-screen border-neutral-500">
          <Topbar>
            <p>{t("saved.title")}</p>
          </Topbar>
          <div className="notification__content sm:px-5 md:px-10 lg:px-20 mt-5 min-h-screen flex flex-col items-center">
            <div className="w-[82%]">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} scale={false} tabs={tabs} borderBottom={true} />
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
            ) : followings.length > 0 ? (
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
    );
  }

  // Success state
  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="saved border-r-[1px] min-h-screen border-neutral-500">
        <Topbar>
          <p>{t("saved.title")}</p>
        </Topbar>
        <div className="notification__content sm:px-5 md:px-10 lg:px-20 mt-5 min-h-screen flex flex-col items-center">
          <div className="w-[82%]">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} scale={false} tabs={tabs} borderBottom={true} />
          </div>
          <div className="px-2 mt-6 w-full">
            {activeTab === 'posts' && (
              <div className="pb-10">
                <SavedPostsContainer posts={savedPosts} />
              </div>
            )}
            {activeTab === 'articles' && (
              <div className="pb-10">
                <SavedArticlesContainer articles={savedArticles} />
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
  );
};

export default Bookmarks;