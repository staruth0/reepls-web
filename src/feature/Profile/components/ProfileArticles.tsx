import React from "react";
import { useGetArticlesByAuthorId } from "../../Blog/hooks/useArticleHook";
import BlogPost from "../../Blog/components/BlogPost";
import { Article } from "../../../models/datamodels";

interface ProfileArticlesProps {
  authorId: string;
}

const ProfileArticles: React.FC<ProfileArticlesProps> = ({ authorId }) => {
  const { data, isLoading, error } = useGetArticlesByAuthorId(authorId || "");

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <div>{error.message}</div>
      ) : data && data.length > 0 ? (
        <div>
          {data.map((article: Article) => (
            <BlogPost
              key={article._id}
              images={article.media!}
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
        <p>No data available</p>
      )}
    </div>
  );
};

export default ProfileArticles;
