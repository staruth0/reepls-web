import React from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import { Article } from '../../models/datamodels';
import BlogPost from '../Blog/components/BlogPost';
import { useGetCommuniquerArticles } from '../Blog/hooks/useArticleHook';
import Communique from './components/Communique/Communique';

const CommuniqueList: React.FC = () => {
  const { data, error, isLoading } = useGetCommuniquerArticles();

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts min-h-screen lg:border-r-[1px] border-neutral-500 ">
        <Topbar>
          <div className="px-3 ">
            <div>Communiques</div>
          </div>
        </Topbar>

        {/* Display Skeleton or Articles */}
        {isLoading ? (
          <div className="skeleton-loader">Loading</div>
        ) : (
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse gap-7 pb-10">
            {data?.map((article: Article) => (
              <BlogPost
                key={article._id}
                isArticle={article.isArticle!}
                media={article.media!}
                title={article.title!}
                content={article.content!}
                user={article.author_id!}
                date={article.createdAt!}
                article_id={article._id!}
              />
            ))}
          </div>
        )}
        {error && <div>Error: {error.message}</div>}
      </div>

      {/* Communique Section */}
      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default CommuniqueList;
