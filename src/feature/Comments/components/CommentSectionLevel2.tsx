import React from "react";
import { Comment, User } from "../../../models/datamodels";
import CommentMessageLevel2 from "./CommentMessageLevel2";
import CommentTabLevel2 from "./CommentTabLevel2";

interface CommentSectionProps {
  article_id: string;
  comment_id: string;
  comments: Comment[];
  author_of_post: User;
  isTabActive: boolean; // New prop to control tab visibility
}

const CommentSectionLevel2: React.FC<CommentSectionProps> = ({
  article_id,
  comment_id,
  comments,
  author_of_post,
  isTabActive,
}) => {
  return (
    <div className="flex flex-col border-l border-neutral-400 mt-3">
      {comments?.map((comment: Comment, index: number) => (
        <CommentMessageLevel2
          key={`${comment._id}-${index}`}
          content={comment.content!}
          createdAt={comment.createdAt!}
          author_id={comment.author_id!}
          author={comment.author!}
          author_of_post={author_of_post}
          comment_id={comment._id!}
        />
      ))}

      {isTabActive && (
        <CommentTabLevel2 article_id={article_id} parent_comment_id={comment_id} />
      )}
    </div>
  );
};

export default CommentSectionLevel2;