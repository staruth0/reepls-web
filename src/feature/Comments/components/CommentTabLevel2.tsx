import { useEffect, useRef, useState } from 'react'; // Added useEffect
import { toast } from 'react-toastify';
import { useUser } from '../../../hooks/useUser';
import { Comment } from '../../../models/datamodels';
import { useCreateComment } from '../hooks';

interface CommentTabProps {
  article_id: string;
  parent_comment_id: string;
}

const CommentTabLevel2: React.FC<CommentTabProps> = ({ article_id, parent_comment_id }) => {
  const { authUser } = useUser();
  const [comment, setComment] = useState<string>('');
  const CommentTabLevel2ref = useRef<HTMLInputElement | null>(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (CommentTabLevel2ref.current) {
      CommentTabLevel2ref.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  const { mutate, isPending } = useCreateComment();

  const handleCommentSubmit = () => {
    if (!authUser?.id) {
      toast.error('You must be logged in to comment.');
      return;
    }

    const commentValues: Comment = {
      article_id,
      author_id: authUser.id,
      content: comment,
      is_audio_comment: false,
      parent_comment_id,
    };

    mutate(commentValues, {
      onSuccess: () => {
        toast.success('Replied to comment successfully');
        setComment('');
      },
      onError: () => {
        toast.error('Failed to reply to comment');
      },
    });
  };

  return (
    <div className="px-4">
      <div className="flex items-center w-full p-2 border border-neutral-300 rounded-full bg-background transition-colors mb-2">
        <input
          type="text"
          placeholder="What are your thoughts..."
          className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-300 px-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={CommentTabLevel2ref} // Ref is used here
        />
        <button
          onClick={handleCommentSubmit}
          className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
          disabled={isPending || comment.trim() === ''}>
          {isPending ? <LuLoader className="animate-spin inline-block mx-1" /> : <LuSend size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CommentTabLevel2;
