import React from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';

interface SavedContainerProps {
  articles: Article[];
}

const SavedArticlesContainer: React.FC<SavedContainerProps> = ({ articles }) => {
  return (
    <>
      <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
        {articles.map((article) => (
          <BlogPost key={article._id} article={article} />
        ))}
      </div>
    </>
  );
};

export default SavedArticlesContainer;
