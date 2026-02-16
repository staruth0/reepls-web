import { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import { useUpdateArticle } from '../hooks/useArticleHook';
import ArticleNormal from './BlogCardContainers/ArticleNormal';
import PostNormal from './BlogCardContainers/PostNormal';
import ArticleNormalCommentary from './BlogCardContainers/ArticleRepostCommentary';
import ArticleNormalNoCommentary from './BlogCardContainers/ArticleRepostNoCommentary';
import PostNormalCommentary from './BlogCardContainers/PostNormalCommentary';
import PostNormalNoCommentary from './BlogCardContainers/PostNormalNoCommentary';



interface BlogPostProps {
  article: Article;
}

const BlogPost: React.FC<BlogPostProps> = ({ article }) => {

  const { mutate } = useUpdateArticle()
  useEffect(() => {
    mutate({
      articleId: article._id || '',
      article: {
        impression_count: article.impression_count! + 1,
      }
    })
  }, [article, mutate])

  if (!article) {
    return <div>Empty Article</div>;
  }

  const isRepost = article.type === 'Repost';
  const hasCommentary = isRepost && !!article.repost?.repost_comment;

  return (
    <div
      className={`self-center w-full`}>
      {article.isArticle ? (
        <>
          {isRepost ? (
            hasCommentary ? (
              <ArticleNormalCommentary article={article} />
            ) : (
              <ArticleNormalNoCommentary article={article} />
            )
          ) : (
            <ArticleNormal article={article} />
          )}
        </>
      ) : (
        <>
          {isRepost ? (
            hasCommentary ? (
              <PostNormalCommentary article={article} />
            ) : (
              <PostNormalNoCommentary article={article} />
            )
          ) : (
            <PostNormal article={article} />
          )}
        </>
      )}

    </div>
  );
};

export default BlogPost;