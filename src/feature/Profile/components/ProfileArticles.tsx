import React, { useEffect } from 'react';
import { LuLoader, LuNewspaper } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import { useGetArticlesByAuthorId } from '../../Blog/hooks/useArticleHook';

interface ProfileArticlesProps {
  authorId: string;
}

const ProfileArticles: React.FC<ProfileArticlesProps> = ({ authorId }) => {
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
              media={article.media!}
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
        <div className="flex flex-col items-center justify-center space-y-2">
          <LuNewspaper className="text-4xl text-gray-500" />
          <p className="text-gray-500 flex gap-2">
            No Articles available.
            <Link to={`/posts/create`} className="text-primary-400">
              Create an Article
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileArticles;
