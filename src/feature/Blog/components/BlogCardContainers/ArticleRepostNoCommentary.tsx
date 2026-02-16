import React, { useContext, useEffect, useState } from "react";
import { Article } from "../../../../models/datamodels";
import { ErrorBoundary } from "react-error-boundary";
import { useUpdateArticle } from "../../hooks/useArticleHook";
import { CognitiveModeContext } from "../../../../context/CognitiveMode/CognitiveModeContext";
import ErrorFallback from "../../../../components/molecules/ErrorFallback/ErrorFallback";
import BlogArticleImagery from "../BlogComponents/BlogArticleImagery";
import BlogArticleMessage from "../BlogComponents/BlogArticleMessage";
import { calculateReadTime } from "../../../../utils/articles";
//import BlogReactionStats from "../BlogComponents/BlogReactionStats";
import BlogReactionSession from "../BlogComponents/BlogReactionSession";
import BlogArticleProfileRepost from "../BlogComponents/BlogArticleProfileRepost";
import BlogArticleProfileNoComment from "../BlogComponents/BlogArticleProfileNocommentary";
import { useGetUserByUsername } from "../../../Profile/hooks";
import PodcastPlayer from "../BlogComponents/PodcastPlayer";

interface articleprobs {
  article: Article;
}

const ArticleNormalNoCommentary: React.FC<articleprobs> = ({ article }) => {
  const { isCognitiveMode } = useContext(CognitiveModeContext);
  const [isCommentSectionOpen, setIsCommentSectionOpen] =
    useState<boolean>(false);
  const { mutate } = useUpdateArticle();
  const { user } = useGetUserByUsername(
    article.repost?.repost_user?.username || ""
  );

  const toggleCommentSection = () => {
    setIsCommentSectionOpen(!isCommentSectionOpen);
  };

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
      <div className="mb-2 mx-2 border-b-1 border-[#E1E1E1] py-2">
        <BlogArticleProfileNoComment
          title={article.title || ""}
          user={user || {}}
          content={article.content || ""}
          date={article.createdAt || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          article={article}
        />
      </div>
      <div className="m-4 border-l-[5px] border-primary-300 p-2 md:p-3 bg-neutral-700 rounded-3xl">
        <BlogArticleProfileRepost
          title={article.title || ""}
          user={article.author_id || {}}
          content={article.content || ""}
          date={article.createdAt || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          article={article}
        />
        
        {/* Podcast Player */}
        {article.hasPodcast && (
          <PodcastPlayer podcastId={article.podcastId} articleId={article._id} />
        )}

         <div className="border-[1px] border-neutral-500  rounded-3xl p-2 md:p-3"> 
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onError={(error, info) => {
            void error;
            void info;
          }}
        >
          {!isCognitiveMode && article?.media && (
            <BlogArticleImagery article={article} media={article.media} />
          )}
        </ErrorBoundary>
        <BlogArticleMessage
          title={article.title || ""}
          content={article.content || ""}
          article_id={article._id || ""}
          isArticle={article.isArticle || false}
          slug={article.slug || ""}
          article={article}
        />
        <div className="flex p-3 gap-1 items-center">
          <div className="text-neutral-70 text-xs mx-1">
            {calculateReadTime(article.content!, article.media || [])} mins Read
          </div>
        </div>

        </div>
      </div>

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

export default ArticleNormalNoCommentary;