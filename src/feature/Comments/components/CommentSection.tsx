import React, { useEffect, useState } from "react";
import { LuX, LuLoader, LuCircleAlert } from "react-icons/lu";
import { Article, Comment, User } from "../../../models/datamodels";
import { useGetCommentsByArticleId } from "../hooks";
import CommentMessage from "./CommentMessage";
import CommentTab from "./CommentTab";
import { useGetCommentsTreeForRepost } from "../../Repost/hooks/useRepost";

interface CommentSectionProps {
  article_id: string;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  author_of_post: User;
  article: Article;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
  article,
}) => {
  const {
    data: articleComments,
    isLoading: isArticleCommentsLoading,
    isError: isArticleCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCommentsByArticleId(article_id);

  const {
    data: repostComments,
    isLoading: isRepostCommentsLoading,
    isError: isRepostCommentsError,
  } = useGetCommentsTreeForRepost(article.repost?.repost_id || "");

  // Determine which loading and error states to use based on article type
  const isLoading =
    article.type === "Repost" ? isRepostCommentsLoading : isArticleCommentsLoading;
  const isError = article.type === "Repost" ? isRepostCommentsError : isArticleCommentsError;

  const [hasOpenLevelTwo, setHasOpenLevelTwo] = useState(false);
  const [activeLevelTwoCommentId, setActiveLevelTwoCommentId] = useState<string | null>(null);

  useEffect(() => {
    console.log("Repost comments:", repostComments);
  }, [article_id, articleComments, repostComments]);

  if (isLoading)
    return <LuLoader className="animate-spin text-primary-400 text-xl m-4" />;
  if (isError)
    return (
      <div>
        <LuCircleAlert className="text-red-500 m-4" /> Error loading comments
      </div>
    );

  const handleLevelTwoToggle = (commentId: string, isOpen: boolean) => {
    setHasOpenLevelTwo(isOpen);
    if (isOpen) {
      setActiveLevelTwoCommentId(commentId);
    } else if (activeLevelTwoCommentId === commentId) {
      setActiveLevelTwoCommentId(null);
    }
  };

  // Use repost comments directly as array (no pagination)
  const commentsToRender =
    article.type === "Repost" && repostComments
      ? repostComments.commentsTree
      : articleComments?.pages
          ?.flatMap((page) => page.data.commentsTree) || [];

  return (
    <div className="flex flex-col gap-2">
      <div
        className="self-end mr-4 cursor-pointer my-3"
        onClick={() => setIsCommentSectionOpen(false)}
      >
        <LuX />
      </div>

      {!hasOpenLevelTwo && (
        <CommentTab
          article_id={article_id}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
          article={article}
        />
      )}

      {/* Render comments */}
      {commentsToRender.map((comment: Comment, index: number) => {
        const isSameAuthorAsPrevious =
          index > 0 && comment.author_id === commentsToRender[index - 1].author_id;

        return (
          <CommentMessage
            key={comment._id}
            content={comment.content!}
            createdAt={comment.createdAt!}
            author_id={comment.author_id!}
            isSameAuthorAsPrevious={isSameAuthorAsPrevious}
            article_id={article_id}
            comment_id={comment._id!}
            replies={comment.replies!}
            author={comment.author!}
            author_of_post={author_of_post}
            onLevelTwoToggle={(isOpen) => handleLevelTwoToggle(comment._id!, isOpen)}
            activeLevelTwoCommentId={activeLevelTwoCommentId}
            article={article}
          />
        );
      })}

      {/* Show pagination button only for regular article comments, not repost */}
      {article.type !== "Repost" && hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="text-primary-400 text-[15px] mt-4 self-center"
        >
          {isFetchingNextPage ? (
            <LuLoader className="animate-spin text-foreground inline-block mx-4" />
          ) : (
            "Show More"
          )}
        </button>
      )}
    </div>
  );
};

export default CommentSection;
