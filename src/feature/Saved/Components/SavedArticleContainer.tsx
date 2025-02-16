import React from "react";
import BlogPost from "../../Blog/components/BlogPost";
import { Article } from "../../../models/datamodels";

interface SavedContainerProps {
  articles: Article[]; 
}

const SavedArticlesContainer: React.FC<SavedContainerProps> = ({
  articles,
}) => {
  return (
    <>
      <div className="px-2 mt-4">
        {`${articles.length} saved articles`}
      </div>
      <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
        {articles.map((article) => (
          <BlogPost
            key={article._id}
            isArticle={article.isArticle!}
            images={article.media!}
            title={article.title!}
            content={article.content!}
            id={article.author_id!}
            date={article.createdAt!}
            article_id={article._id!}
          />
        ))}
      </div>
    </>
  );
};

export default SavedArticlesContainer;
