import React, { useEffect } from "react";
import {  useGetRepliesForComment } from "../hooks";
import { Comment } from "../../../models/datamodels";
import CommentTabLevel2 from "./CommentTabLevel2";
import CommentMessageLevel2 from "./CommentMessageLevel2";

interface CommentSectionProps {
    article_id: string;
    comment_id: string;
    comments: Comment[];
}

const CommentSectionLevel2: React.FC<CommentSectionProps> = ({
  article_id,
   comment_id,
   comments
}) => {
  const {
    data: articleComments,
    isLoading,
    isError,
  } = useGetRepliesForComment(comment_id);

  useEffect(() => {
    console.log(articleComments?.data);
  }, [article_id, articleComments?.data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading comments</div>;

  return (
    <div className="flex flex-col  mt-3">
      {comments?.map((comment: Comment, index: number) => {
        const isSameAuthorAsPrevious =
          index > 0 &&
          comment.author_id === articleComments.data[index - 1].author_id;

        return (
          <CommentMessageLevel2
            key={comment._id} // Use a unique identifier like comment.id instead of index
            content={comment.content!}
            createdAt={comment.createdAt!}
            author_id={comment.author_id!}
            isSameAuthorAsPrevious={isSameAuthorAsPrevious}
          />
        );
      })}
      <CommentTabLevel2
        article_id={article_id}
        parent_comment_id={comment_id}
      />
    </div>
  );
};

export default CommentSectionLevel2;
