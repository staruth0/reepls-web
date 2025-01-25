import React from "react";
import { useGetArticlesByAuthorId } from "../../Blog/hooks/useArticleHook";
import BlogPost from "../../../components/molecules/BlogPost";

interface ProfileArticlesProps {
  authorId: string;
}

const ProfilePosts: React.FC<ProfileArticlesProps> = ({ authorId }) => {
  const { data, isLoading, error } = useGetArticlesByAuthorId(authorId || "");

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <div>{error.message}</div>
      ) : data && data.length > 0 ? (
        <div>
          {data.map((article: any) => (
            <BlogPost
              key={article._id}
              images={article.media}
              title={article.title}
              content={article.content}
              id={article.author_id}
              date={article.createdAt}
            />
          ))}
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ProfilePosts;
