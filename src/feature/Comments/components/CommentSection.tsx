import React, { useEffect } from "react";
import CommentMessage from "./CommentMessage";
import CommentTab from "./CommentTab";
import { useGetCommentsByArticleId } from "../hooks";

interface CommentSectionProps {
  article_id: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ article_id}) => {
  const { data: articleComments, isLoading, isError } = useGetCommentsByArticleId(article_id);

  useEffect(() => {
    console.log(articleComments?.data);
  }, [article_id, articleComments?.data]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading comments</div>;

  return (
    <div className="flex flex-col gap-2">
      <CommentTab article_id={article_id} />
      {articleComments?.data.map((comment, index) => (
        <CommentMessage
          key={index}
          content={comment.content}
          createdAt={comment.createdAt}
          author_id={comment.author_id}
          index={index}
        />
      ))}
    </div>
  );
};

export default CommentSection;