import React, { useEffect } from 'react';
import {  LuLoader, LuFile } from 'react-icons/lu';
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
         <div className="flex justify-center mt-4">
         <LuLoader className="animate-spin text-primary-400 text-xl m-4" />
       </div>
        
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
        <div className="text-center text-gray-500 flex flex-col items-center gap-4">
          <LuFile className=" text-4xl" />
          <p className='flex gap-2'>
            We couldn't find any Post.
            <Link to="/posts/create" className="text-primary-400">
              create a post
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
