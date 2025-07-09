import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';

import { useUpdateArticle } from '../hooks/useArticleHook';
import ArticleNormal from './BlogCardContainers/ArticleNormal';
import PostNormal from './BlogCardContainers/PostNormal';

interface BlogPostProps {
  article: Article;
  isModalView?: boolean;
  onClose?: () => void;
}

const BlogPost2: React.FC<BlogPostProps> = ({ article, isModalView = false }) => {
  
  const { mutate } = useUpdateArticle();



  useEffect(() => {
    mutate({
      articleId: article._id || '',
      article: {
        impression_count: article.impression_count! + 1,
      }
    });
  }, [article, mutate]);

  if (!article) {
    return <div>Empty Article</div>;
  }

  return (
    <div className={`each_blog_post ${isModalView ? 'modal-view' : ''}`}>
      {isModalView && (
     <></>
      )}
      
      {article.isArticle ?<>
      <ArticleNormal article={article}/>
      </>: <>
      
       <PostNormal article={article}/>

      </>}
    </div>
  );
};

export default BlogPost2;