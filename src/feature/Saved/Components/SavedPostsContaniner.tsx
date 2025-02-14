import React, { useEffect, useState } from "react";
import { useGetArticleById } from "../../Blog/hooks/useArticleHook";
import BlogPost from "../../Blog/components/BlogPost";
import { Article } from "../../../models/datamodels";

interface SavedContainerProps {
  article_id: string;
}

const SavedPostsContainer: React.FC<SavedContainerProps> = ({ article_id }) => {
  const { data: article, isLoading, error } = useGetArticleById(article_id);
  const [articles, setArticles] = useState<Article[]>([]); 

  useEffect(() => {
    if (article && !article.isArticle) {
      
      const isArticleAlreadyAdded = articles.some((a) => a._id === article._id);
      if (!isArticleAlreadyAdded) {
     
        setArticles((prevArticles) => [...prevArticles, article]);
      }
    }
  }, [article,articles]); 

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error loading article: {error.message}</div>; 
  }

  return (
    <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
      {articles.length > 0 ? (
        
        articles.map((article) => (
          <BlogPost
            key={article._id}
            isArticle={article.isArticle}
            images={article.media}
            title={article.title}
            content={article.content}
            id={article.author_id}
            date={article.createdAt}
            article_id={article._id}
          />
        ))
      ) : (
        <div>No saved articles found.</div>
      )}
    </div>
  );
};

export default SavedPostsContainer;
