import React from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import { useTranslation } from 'react-i18next';

// Saved Posts Container
interface SavedPostsContainerProps {
  posts: Article[];
}

const SavedPostsContainer: React.FC<SavedPostsContainerProps> = ({ posts }) => {
  const { t } = useTranslation();

  return (
    <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
      {posts.length === 0 ? (
        <p className="text-neutral-500 text-center py-4">
          {t("saved.noPosts")}
        </p>
      ) : (
        posts.map((article) => (
          <BlogPost key={article._id} article={article} />
        ))
      )}
    </div>
  );
};

export default SavedPostsContainer;
