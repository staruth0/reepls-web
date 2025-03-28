import React, { useEffect, useState } from "react";
import { LuX, LuLoader, LuCircleAlert } from "react-icons/lu";
import { Comment, User } from "../../../models/datamodels";
import { useGetCommentsByArticleId } from "../hooks";
import CommentMessage from "./CommentMessage";
import CommentTab from "./CommentTab";

interface CommentSectionProps {
  article_id: string;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  author_of_post: User;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
}) => {
  const {
    data: articleComments,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCommentsByArticleId(article_id);
  const [hasOpenLevelTwo, setHasOpenLevelTwo] = useState(false); // Any level-two open
  const [activeLevelTwoCommentId, setActiveLevelTwoCommentId] = useState<string | null>(null); // Track active tab

  useEffect(() => {
    console.log("comments", articleComments);
  }, [article_id, articleComments]);

  if (isLoading)
    return <LuLoader className="animate-spin text-primary-400 text-xl m-4" />;
  if (isError)
    return (
      <div>
        <LuCircleAlert className="text-red-500 m-4" /> Error loading comments
      </div>
    );

  const handleLevelTwoToggle = (commentId: string, isOpen: boolean) => {
    setHasOpenLevelTwo(() => {
      if (isOpen) return true;
  
      return false;
    });
    if (isOpen) {
      setActiveLevelTwoCommentId(commentId);
    } else if (activeLevelTwoCommentId === commentId) {
      setActiveLevelTwoCommentId(null); 
    }
  };

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
        />
      )}

      {/* Render comments */}
      {articleComments?.pages.map((page, pageIndex) =>
        page.data.commentsTree.map((comment: Comment, index: number) => {
          const isSameAuthorAsPrevious =
            index > 0 &&
            comment.author_id === page.data.commentsTree[index - 1].author_id;

          return (
            <CommentMessage
              key={`${comment._id}-${pageIndex}-${index}`}
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
              activeLevelTwoCommentId={activeLevelTwoCommentId} // Pass active ID
            />
          );
        })
      )}

      {hasNextPage && (
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