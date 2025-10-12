import React, { useEffect } from 'react';
import { Article, Publication } from '../../../models/datamodels';
import { useGetPublicationArticles } from '../Hooks';
import ArticleNormal from '../../Blog/components/BlogCardContainers/ArticleNormal';
import ArticleSkeleton from './ArticleSkeleton';

interface streamprops {
  stream:Publication;
}


const ArticleTab: React.FC<streamprops> = ({stream}) => {

  const {data: articlesData, isLoading, error} = useGetPublicationArticles(stream._id || '');

   useEffect(()=>{
    console.log('articles',articlesData)
   },[articlesData])

  // Show loading state
  if (isLoading) {
    return (
      <div className="pb-10 space-y-6">
        <div className="p-2">
          <ArticleSkeleton />
          <ArticleSkeleton />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="pb-10 space-y-6">
        <div className="text-center py-8 text-red-500">Error loading articles</div>
      </div>
    );
  }

  // Extract articles from the response data
  const articles = articlesData?.data || [];

  return (
    <div className="pb-10 space-y-6">
      {(articles?.length || 0) === 0 ? (
        <div className="text-center py-8 text-gray-500">No articles found for this publication</div>
      ) : (
        (articles || []).map((article:Article) => (
          <ArticleNormal key={article._id} article={article} />
        ))
      )}
    </div>
  );
};

export default ArticleTab;
