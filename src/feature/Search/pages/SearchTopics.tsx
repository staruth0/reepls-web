import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useGetArticlesByCategory, useGetRecommendedArticles } from '../../Blog/hooks/useArticleHook';

const topics = ['Politics', 'Journalism', 'Tech', 'Art', 'History', 'Culture', 'Film', 'Crime'];

const SearchTopics: React.FC = () => {
  const { t } = useTranslation();
  const [category, setCategory] = useState<string>('');

  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    error: recommendedError,
  } = useGetRecommendedArticles();
  const { data: categoryData, isLoading: isCategoryLoading, error: categoryError } = useGetArticlesByCategory(category);

  useEffect(() => {
    console.log('recommended', recommendedData);
  }, [recommendedData]);

  useEffect(() => {
    console.log('category data', categoryData);
  }, [categoryData]);

  const handleTopicClick = (topic: string) => {
    setCategory(topic);
  };

  const displayedData = category ? categoryData : recommendedData;
  const isLoading = category ? isCategoryLoading : isRecommendedLoading;
  const error = category ? categoryError : recommendedError;

  return (
    <>
      <div className="flex flex-wrap gap-x-3 gap-y-2 justify-center ">
        {topics.map((topic) => (
          <span
            key={topic}
            onClick={() => handleTopicClick(topic)}
            className="py-2 px-6 text-neutral-100 rounded-full border-[1px] border-neutral-500 hover:border-transparent hover:bg-primary-400 hover:text-white transition-all transition-300 cursor-pointer ">
            {t(`${topic}`)}
          </span>
        ))}
      </div>
      <div className="w-full px-4 sm:px-8 flex flex-col gap-7 mt-2">
      <div className="px-4 text-center mt-6">{category ? `${category} Articles` : 'Recommended Articles'}</div>

        <div className="mt-2">
          {isLoading ? (
            <div>
              <BlogSkeletonComponent />
              <BlogSkeletonComponent />
            </div>
          ) : displayedData && displayedData.length > 0 ? (
            <div className=" ">
              {displayedData.map((article: Article) => (
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
          ) : (
            <p className="text-neutral-500 text-center">No recommended articles</p>
          )}
          {error && <div>Error: {error.message}</div>}
        </div>
      </div>
    </>
  );
};

export default SearchTopics;
