import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';

import { useTranslation } from 'react-i18next';
import BlogPost from '../../Blog/components/BlogPost';

// Saved Articles Container
interface SavedArticlesContainerProps {
  articles: Article[];
}

const ReadingHistoryContainer: React.FC<SavedArticlesContainerProps> = ({ articles }) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log('articles saved', articles);
  }, [articles]);

  return (
    <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
      {articles.length === 0 ? (
        <p className="text-neutral-500 text-center py-4">
          {t("saved.noArticles")}
        </p>
      ) : (
        articles.map((article) => (
          <BlogPost key={article._id} article={article} />
        ))
      )}
    </div>
  );
};

export default ReadingHistoryContainer;

