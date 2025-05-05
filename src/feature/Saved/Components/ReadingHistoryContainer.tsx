import React, { useEffect } from 'react';
import { Article } from '../../../models/datamodels';
import { useTranslation } from 'react-i18next';
import BlogPost from '../../Blog/components/BlogPost';

interface ReadingHistoryContainerProps {
  articles: Article[];
}

const ReadingHistoryContainer: React.FC<ReadingHistoryContainerProps> = ({ articles = [] }) => {
  const { t } = useTranslation();

  useEffect(() => {
    console.log('articles in reading history', articles);
  }, [articles]);

  return (
    <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
      {articles.length === 0 ? (
        <p className="text-neutral-500 text-center py-4">
          {t("saved.noArticles")}
        </p>
      ) : (
        articles.map((article) => (
          article._id ? (
            <BlogPost key={article._id} article={article} />
          ) : null
        ))
      )}
    </div>
  );
};

export default ReadingHistoryContainer;