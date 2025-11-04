import React, { useEffect } from 'react';
import { Article, Publication } from '../../../models/datamodels';
import { useGetPublicationArticles } from '../Hooks';
import ArticleNormal from '../../Blog/components/BlogCardContainers/ArticleNormal';
import ArticleSkeleton from './ArticleSkeleton';

interface streamprops {
  stream:Publication;
}


const ArticleTab: React.FC<streamprops> = ({stream}) => {

  const {data: articlesData, isLoading, error} = useGetPublicationArticles(stream._id || stream.id || '');

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

  // Extract articles from the response data with null safety
  const articles = Array.isArray(articlesData?.data) ? articlesData.data : [];

  // Check if articles array is empty
  const hasArticles = articles && articles.length > 0;

  return (
    <div className="pb-10 space-y-6">
      {!hasArticles ? (
        <div className="text-center py-8 text-gray-500">No articles found for this publication</div>
      ) : (
        articles
          .filter((article: Article) => article && (article._id || article.id)) // Filter out null/undefined articles and articles without IDs
          .map((article: Article) => {
            const articleId = article._id || article.id;
            return (
              <ArticleNormal 
                key={articleId} 
                article={article} 
              />
            );
          })
      )}
    </div>
  );
};

export default ArticleTab;
