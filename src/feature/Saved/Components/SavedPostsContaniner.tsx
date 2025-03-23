import React from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';

interface SavedContainerProps {
  posts: Article[];
}

const SavedPostsContainer: React.FC<SavedContainerProps> = ({ posts }) => {
  return (
    <>
      <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
        {posts.map((article) => (
          <BlogPost key={article._id} article={article} />
        ))}
      </div>
    </>
  );
};

export default SavedPostsContainer;
