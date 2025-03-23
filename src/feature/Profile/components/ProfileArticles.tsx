import React from 'react';
import { LuNewspaper } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';

interface ProfileArticlesProps {
  authorId?: string;
  articles?: Article[];
}

const ProfileArticles: React.FC<ProfileArticlesProps> = ({ articles = [] }) => {
  // If articles are not provided, this component assumes the parent handles loading/error states
  const hasArticles = articles && articles.length > 0;

  return (
    <div>
      {hasArticles ? (
        <div className="w-full flex flex-col items-center">
          {articles.map((article: Article) => (
            <BlogPost key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-2">
          <LuNewspaper className="text-4xl text-gray-500" />
          <p className="text-gray-500 flex gap-2">
            No Articles available.
            <Link to="/posts/create" className="text-primary-400">
              Create an Article
            </Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileArticles;
