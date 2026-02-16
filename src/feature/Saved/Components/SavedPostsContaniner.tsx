import React from 'react';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import { useTranslation } from 'react-i18next';

// Saved Posts Container
interface SavedPostsContainerProps {
  posts: Article[];
  isLoading?: boolean;
}

const SavedPostsContainer: React.FC<SavedPostsContainerProps> = ({ posts, isLoading = false }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
        <BlogSkeletonComponent />
        <BlogSkeletonComponent />
        <BlogSkeletonComponent />
      </div>
    );
  }

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
