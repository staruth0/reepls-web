import { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import { useUpdateArticle } from '../hooks/useArticleHook';
import ArticleNormal from './BlogCardContainers/ArticleNormal';
import PostNormal from './BlogCardContainers/PostNormal';

interface BlogPostProps {
  article: Article;
}

const BlogPost: React.FC<BlogPostProps> = ({ article }) => {

  const {mutate} = useUpdateArticle()
   useEffect(()=>{
    mutate({
      articleId:article._id || '',
      article:{
        impression_count:article.impression_count! +1,
      }
    })
  },[article,mutate])

  if (!article) {
    return <div>Empty Article</div>;
  }

  return (
    <div
      className={`each_blog_post mt-5 shadow-sm p-2 max-w-[680px]  self-center w-full bg-background`}>
      {article.isArticle ?<>
      <ArticleNormal article={article}/>
      </>: <>     
       <PostNormal article={article}/>
      </>}
     
    </div>
  );
};

export default BlogPost;
