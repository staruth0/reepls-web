import React from "react";
import { Article, Comment, User } from "../../../models/datamodels";
import CommentMessageLevel2 from "./CommentMessageLevel2";
import CommentTabLevel2 from "./CommentTabLevel2";

interface CommentSectionProps {
  article_id: string;
  comment_id: string;
  comments: Comment[];
  author_of_post: User;
  isTabActive: boolean; 
  article: Article; // Added article prop for CommentTabLevel2
}

const CommentSectionLevel2: React.FC<CommentSectionProps> = ({
  article_id,
  comment_id,
  comments,
  author_of_post,
  isTabActive,
  article
}) => {
  return (
    <div className="flex flex-col border-l border-neutral-400 mt-3 overflow-visible">
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
        <CommentTabLevel2 article_id={article_id} parent_comment_id={comment_id} article={article} />
      )}
    </div>
  );
};

export default CommentSectionLevel2;