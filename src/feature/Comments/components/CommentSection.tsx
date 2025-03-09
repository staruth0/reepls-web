import React, { useEffect } from 'react';
import { LuX, LuLoader, LuCircleAlert } from "react-icons/lu";
import { Comment, User } from '../../../models/datamodels';
import { useGetCommentsByArticleId } from '../hooks';
import CommentMessage from './CommentMessage';
import CommentTab from './CommentTab';
interface CommentSectionProps {
  article_id: string;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  author_of_post: User;
}

const CommentSection: React.FC<CommentSectionProps> = ({ article_id, setIsCommentSectionOpen, author_of_post }) => {
  const { data: articleComments, isLoading, isError } = useGetCommentsByArticleId(article_id);

  useEffect(() => {
    console.log(articleComments?.data);
  }, [article_id, articleComments?.data]);

  if (isLoading) return <LuLoader className="animate-spin text-primary-400 text-xl m-4" />;
  if (isError)
    return (
      <div>
        <LuCircleAlert className="text-red-500 m-4" /> Error loading comments
      </div>
    );

  return (
    <div className="flex flex-col gap-2 ">
      <div className="self-end mr-4 cursor-pointer my-3" onClick={() => setIsCommentSectionOpen(false)}>
        <LuX />
      </div>

      <CommentTab article_id={article_id} setIsCommentSectionOpen={setIsCommentSectionOpen} />
      {articleComments?.data.map((comment: Comment, index: number) => {
        const isSameAuthorAsPrevious = index > 0 && comment.author_id === articleComments.data[index - 1].author_id;

        return (
          <>
            <CommentMessage
              key={`${comment._id}-${index}`}
              content={comment.content!}
              createdAt={comment.createdAt!}
              author_id={comment.author_id!}
              isSameAuthorAsPrevious={isSameAuthorAsPrevious}
              article_id={article_id}
              comment_id={comment._id!}
              replies={comment.replies!}
              author={comment.author!}
              author_of_post={author_of_post}
            />
          </>
        );
      })}
    </div>
  );
};

export default CommentSection;
