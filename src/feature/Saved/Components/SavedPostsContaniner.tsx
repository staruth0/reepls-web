import React from "react";
import BlogPost from "../../Blog/components/BlogPost";
import { Article } from "../../../models/datamodels";

interface SavedContainerProps {
  posts: Article[]; 
}

const SavedPostsContainer: React.FC<SavedContainerProps> = ({ posts }) => {
  return (
    <>
      <div> {`${posts.length} saved posts`}</div>
      <div className="transition-all duration-300 ease-linear flex flex-col-reverse gap-7">
        {posts.map((article) => (
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

export default SavedPostsContainer;
