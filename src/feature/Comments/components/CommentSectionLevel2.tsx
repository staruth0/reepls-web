import React, { useEffect } from 'react';
import { Comment, User } from '../../../models/datamodels';
import { useGetRepliesForComment } from '../hooks';
import CommentMessageLevel2 from './CommentMessageLevel2';
import CommentTabLevel2 from './CommentTabLevel2';

interface CommentSectionProps {
  article_id: string;
  comment_id: string;
  comments: Comment[];
  author_of_post: User;
}

const CommentSectionLevel2: React.FC<CommentSectionProps> = ({ article_id, comment_id, comments, author_of_post }) => {
  const { data: articleComments, isLoading } = useGetRepliesForComment(comment_id);

  useEffect(() => {
    console.log(articleComments?.data);
  }, [article_id, articleComments?.data]);

  return (
    <div className="flex flex-col  mt-3">
      <>
        {isLoading ? (
          <div className="text-[12px]">Loading Replies..</div>
        ) : (
          <>
            {comments?.map((comment: Comment, index: number) => {
              const isSameAuthorAsPrevious =
                index > 0 && comment.author_id === articleComments.data[index - 1].author_id;

              return (
                <>
                  <CommentMessageLevel2
                    key={`${comment._id}-${index}`}
                    content={comment.content!}
                    createdAt={comment.createdAt!}
                    author_id={comment.author_id!}
                    isSameAuthorAsPrevious={isSameAuthorAsPrevious}
                    author={comment.author!}
                    author_of_post={author_of_post}
                  />
                </>
              );
            })}
          </>
        )}
      </>

      <CommentTabLevel2 article_id={article_id} parent_comment_id={comment_id} />
    </div>
  );
};

export default CommentSectionLevel2;
