import React, { useEffect } from "react";
import CommentMessage from "./CommentMessage";
import CommentTab from "./CommentTab";
import { useGetCommentsByArticleId } from "../hooks";
import { Comment } from "../../../models/datamodels";
import { LuX } from "react-icons/lu";

interface CommentSectionProps {
  article_id: string;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  article_id,
  setIsCommentSectionOpen,
}) => {
  const {
    data: articleComments,
    isLoading,
    isError,
  } = useGetCommentsByArticleId(article_id);

  useEffect(() => {
    console.log(articleComments?.data);
  }, [article_id, articleComments?.data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading comments</div>;

  return (
    <div className="flex flex-col gap-2 ">
      <div
        className="self-end mr-4 cursor-pointer my-3"
        onClick={() => setIsCommentSectionOpen(false)}
      >
        <LuX />
      </div>

      <CommentTab
        article_id={article_id}
        setIsCommentSectionOpen={setIsCommentSectionOpen}
      />
      {articleComments?.data.map((comment: Comment, index: number) => {
        const isSameAuthorAsPrevious =
          index > 0 &&
          comment.author_id === articleComments.data[index - 1].author_id;

        return (
          <>
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
            />
          </>
        );
      })}
    </div>
  );
};

export default CommentSection;
