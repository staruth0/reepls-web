import React, { useContext, useEffect, useState } from "react";
import { Article } from "../../../../models/datamodels";
// import BlogProfile from '../BlogComponents/BlogProfile';
import { ErrorBoundary } from "react-error-boundary";
import BlogImagery from "../BlogComponents/BlogImagery";
import BlogMessage from "../BlogComponents/BlogMessage";
// import BlogReactionStats from "../BlogComponents/BlogReactionStats";
import BlogReactionSession from "../BlogComponents/BlogReactionSession";
import { useUpdateArticle } from "../../hooks/useArticleHook";
import { CognitiveModeContext } from "../../../../context/CognitiveMode/CognitiveModeContext";
import ErrorFallback from "../../../../components/molecules/ErrorFallback/ErrorFallback";
import BlogArticleProfile from "../BlogComponents/BlogArticleProfile";
import { useGetUserByUsername } from "../../../Profile/hooks";
import BlogArticleProfileRepost from "../BlogComponents/BlogArticleProfileRepost";

interface articleprobs {
  article: Article;
}

const PostNormalCommentary: React.FC<articleprobs> = ({ article }) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] =
    useState<boolean>(false);
  const { mutate } = useUpdateArticle();

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

  const { user } = useGetUserByUsername(
    article.repost?.repost_user?.username || ""
  );
  useEffect(() => {
    mutate({
      articleId: article._id || "",
      article: {
        impression_count: article.impression_count! + 1,
      },
    });
  }, [article, mutate]);

  if (!article) {
    return <div>Empty Article</div>;
  }

  return (
    <div className="mt-5 border-[1px] border-neutral-500 p-2 md:p-4 max-w-2xl bg-background rounded-3xl ">
      <div className="">
        <BlogArticleProfile
          title={article.title || ""}
          user={user || {}}
          content={article.content || ""}
          date={article.repost?.repost_date || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          article={article}
        />
        <div className="px-4 py-2 text-[14px]  ">
          {" "}
          {article.repost?.repost_comment}
        </div>
      </div>
      <div className="mx-2">
      <div className="m-2 p-1 border-l-[5px] border-primary-300 rounded-3xl bg-neutral-700">
        <BlogArticleProfileRepost
          title={article.title || ""}
          user={article.author_id || {}}
          content={article.content || ""}
          date={article.createdAt || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          article={article}
        />

        <BlogMessage
          title={article.title || ""}
          content={article.content || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          slug={article.slug || ""}
          article={article}
        />

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, info) => {
            void error;
            void info;
          }}
        >
          {!isCognitiveMode && article?.media && (
            <BlogImagery article={article} media={article.media} />
          )}
        </ErrorBoundary>
      </div>
      </div>

      {/* <BlogReactionStats
        toggleCommentSection={toggleCommentSection}
        date={article.createdAt || ""}
        article_id={article._id || ""}
        article={article}
      /> */}
      <div className="px-4 md:px-4">
      <BlogReactionSession
        isCommentSectionOpen={isCommentSectionOpen}
        message={article.content || ""}
        article_id={article._id || ""}
        setIsCommentSectionOpen={toggleCommentSection}
        author_of_post={article.author_id || {}}
        text_to_speech={article.text_to_speech || ""}
        article={article}
      />
      </div>
    </div>
  );
};

export default PostNormalCommentary;
