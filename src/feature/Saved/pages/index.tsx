import React, { useEffect, useState } from 'react';
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

const Bookmarks: React.FC = () => {
  const { authUser } = useUser();

  const { data: savedArticlesData, isLoading: isLoadingSavedArticles, error } = useGetSavedArticles();
  const { data: followingsData } = useGetFollowing(authUser?.id || '');
  const [savedPosts, setSavedPosts] = useState<Article[]>([]);
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);
  const [followings, setFollowings] = useState<Follow[]>([]);

  // Filter and separate saved articles into posts and articles

  useEffect(() => {
    if (!savedArticlesData) return;
    console.log('saved articles', savedArticlesData);
    setSavedPosts(savedArticlesData?.articles.filter((item: Article) => !item.isArticle) || []);
    setSavedArticles(savedArticlesData?.articles.filter((item: Article) => item.isArticle) || []);
  }, [savedArticlesData]);

  useEffect(() => {
    setFollowings(followingsData?.data || []);
  }, [followingsData]);

  const tabs = [
    { id: 'posts', title: `Posts (${savedPosts.length})` },
    { id: 'articles', title: `Articles (${savedArticles.length})` },
    { id: 'history', title: 'Reading History', icon: <LuHistory className="mx-2" /> },
  ];
  
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);

  return (
    <div className={`grid grid-cols-[4fr_1.65fr] `}>
      <div className="saved border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>Saved</p>
        </Topbar>

        {/* Saved content */}
        <div className="notification__content px-20 mt-5 min-h-screen flex flex-col items-center">
          <div className="w-[82%]">
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} scale={false} tabs={tabs} borderBottom={true} />
          </div>

          <div className="px-2 mt-6 w-full" >
            {activeTab === 'posts' && (
              <>
                <div className="pb-10">
                  {isLoadingSavedArticles ? (
                    <div className='p-2'>
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
                <div className="pb-10">
                  {isLoadingSavedArticles ? (
                    <div className='p-2'>
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
