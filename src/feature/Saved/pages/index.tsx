import React, { useState, useMemo } from "react";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import AuthorComponent from "../Components/AuthorComponent";
import { useUser } from "../../../hooks/useUser";
import { useGetAllArticles } from "../../Blog/hooks/useArticleHook";
import { Article } from "../../../models/datamodels";
import SavedPostsContainer from "../Components/SavedPostsContaniner";
import SavedArticlesContainer from "../Components/SavedArticleContainer";
import BlogSkeletonComponent  from "../../Blog/components/BlogSkeleton";

const tabs = [
  { id: "posts", title: "Posts" },
  { id: "articles", title: "Articles" },
  { id: "history", title: "Reading History" },
];

const Bookmarks: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const { authUser } = useUser();
  const { data: articles , isLoading: isLoadingArticles,error } = useGetAllArticles();

  // Filter and separate saved articles into posts and articles
  const { savedPosts, savedArticles } = useMemo(() => {
    if (!articles?.articles || !authUser?.saved_articles) {
      return { savedPosts: [], savedArticles: [] };
    }

    // Filter articles whose IDs are in authUser.saved_articles
    const savedItems = articles.articles.filter((article:Article) =>
      authUser?.saved_articles?.includes(article._id!)
    );

    // Separate into posts and articles
    const savedPosts = savedItems.filter((item:Article) => !item.isArticle);
    const savedArticles = savedItems.filter((item:Article) => item.isArticle);

    return { savedPosts, savedArticles };
  }, [articles, authUser]);

  return (
    <div className={`grid grid-cols-[4fr_1.65fr] `}>
      <div className="saved border-r-[1px] border-neutral-500 ">
        <Topbar>
          <p>Saved</p>
        </Topbar>

        {/* Saved content */}
        <div className="notification__content px-20 mt-5 min-h-screen">
          <Tabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            scale={false}
            tabs={tabs}
            borderBottom={true}
          />
          <div className="px-2 mt-6">
            {activeTab === "posts" && (
              <>
                <div className="pb-10">
                  {isLoadingArticles ? (
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
            {activeTab === "articles" && (
              <>
                <div>
                  {isLoadingArticles ? (
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
            {activeTab === "history" && <div>Reading History</div>}
          </div>
        </div>
      </div>

      <div className="saved__authors px-6 py-4 hidden lg:block">
        <p className="">Your top saved Authors</p>
        <div className="mt-10 flex flex-col gap-6">
          <AuthorComponent />
          <AuthorComponent />
          <AuthorComponent />
        </div>
      </div>
    </div>
  );
};

export default Bookmarks;
