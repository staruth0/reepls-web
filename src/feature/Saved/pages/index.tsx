import React, { useEffect, useMemo, useState } from 'react';
import { LuHistory } from 'react-icons/lu';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import Tabs from '../../../components/molecules/Tabs/Tabs';
import { useUser } from '../../../hooks/useUser';
import { Article, Follow } from '../../../models/datamodels';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetFollowing } from '../../Follow/hooks';
import { useGetSavedArticles } from '../../Saved/hooks'; // Updated import
import AuthorComponent from '../Components/AuthorComponent';
import SavedArticlesContainer from '../Components/SavedArticleContainer';
import SavedPostsContainer from '../Components/SavedPostsContaniner';
const tabs = [
  { id: 'posts', title: 'Posts' },
  { id: 'articles', title: 'Articles' },
  { id: 'history', title: 'Reading History', icon: <LuHistory className="mx-2" /> },
];

const Bookmarks: React.FC = () => {
  const { authUser } = useUser();
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const { data: savedArticlesData, isLoading: isLoadingSavedArticles, error } = useGetSavedArticles();
  const { data: followingsData } = useGetFollowing(authUser?.id || '');

  // Filter and separate saved articles into posts and articles
  const { savedPosts, savedArticles } = useMemo(() => {
    if (!savedArticlesData) {
      return { savedPosts: [], savedArticles: [] };
    }

    // Separate into posts and articles based on isArticle property
    const savedPosts = savedArticlesData.filter((item: Article) => !item.isArticle);
    const savedArticles = savedArticlesData.filter((item: Article) => item.isArticle);

    return { savedPosts, savedArticles };
  }, [savedArticlesData]);

  useEffect(() => {
    console.log('saved articles', savedArticlesData);
  }, [savedArticlesData]);

  const followings = followingsData?.data || [];

  return (
    <div className={`grid grid-cols-[4fr_1.65fr] `}>
      <div className="saved border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>Saved</p>
        </Topbar>

        {/* Saved content */}
        <div className="notification__content px-20 mt-5 min-h-screen">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} scale={false} tabs={tabs} borderBottom={true} />
          <div className="px-2 mt-6">
            {activeTab === 'posts' && (
              <>
                <div className="pb-10">
                  {isLoadingSavedArticles ? (
                    <div>
                      <BlogSkeletonComponent />
                      <BlogSkeletonComponent />
                    </div>
                  ) : (
                    <SavedPostsContainer posts={savedPosts} />
                  )}
                </div>
                <div>{error && error.message}</div>
              </>
            )}
            {activeTab === 'articles' && (
              <>
                <div>
                  {isLoadingSavedArticles ? (
                    <div>
                      <BlogSkeletonComponent />
                      <BlogSkeletonComponent />
                    </div>
                  ) : (
                    <SavedArticlesContainer articles={savedArticles} />
                  )}
                </div>
                <div>{error && error.message}</div>
              </>
            )}
            {activeTab === 'history' && <div>Reading History</div>}
          </div>
        </div>
      </div>

      <div className="saved__authors px-6 py-4 hidden lg:block">
        <p className="">Your top saved Authors</p>
        <div className="mt-10 flex flex-col gap-6">
          {followings.length > 0 ? (
            followings.map((following: Follow, index: number) => (
              <AuthorComponent key={`${following?.followed_id?.id}-${index}`} user={following.followed_id} />
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
