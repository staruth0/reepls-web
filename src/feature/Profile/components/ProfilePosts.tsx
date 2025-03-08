import React, { useEffect } from 'react';
import { LuBox, LuLoader } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import { useGetArticlesByAuthorId } from '../../Blog/hooks/useArticleHook';
interface ProfileArticlesProps {
  authorId: string;
}

const ProfilePosts: React.FC<ProfileArticlesProps> = ({ authorId }) => {
  const { data, isLoading, error } = useGetArticlesByAuthorId(authorId!);
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);
  return (
    <div>
      {isLoading ? (
        <LuLoader className="animate-spin text-primary-400 text-xl m-4" />
      ) : error ? (
        <div className="text-red-500">{error.message}</div>
      ) : data && data.length > 0 ? (
        <div>
          {data.map((article: Article) => (
            <BlogPost
              key={article._id}
              images={article.media!}
              title={article.title!}
              content={article.content!}
              user={article.author_id!}
              date={article.createdAt!}
              isArticle={article.isArticle!}
              article_id={article._id!}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 flex flex-col items-center gap-4">
          <LuBox className="text-primary-400 text-4xl animate-pulse" />
          <p>
            We couldn't find any articles.
            <Link to="/posts/create" className="text-primary-400">
              Write an article
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
