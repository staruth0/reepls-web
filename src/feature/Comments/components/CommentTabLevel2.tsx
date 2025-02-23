import { Send } from "lucide-react";
import { Comment } from "../../../models/datamodels";
import { useUser } from "../../../hooks/useUser";
import { useState } from "react";
import { useCreateComment } from "../hooks";
import { Spinner } from "../../../components/atoms/Spinner";
import {toast} from "react-toastify";

interface CommentTabProps {
  article_id: string;
  parent_comment_id: string;
}

const CommentTabLevel2: React.FC<CommentTabProps> = ({
  article_id,
   parent_comment_id
}) => {
  const { authUser } = useUser();
  const [comment, setComment] = useState<string>("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCommentSubmit();
    }
  };

  const { mutate, isPending } = useCreateComment();

  const handleCommentSubmit = () => {
    const commentValues: Comment = {
      article_id,
      author_id: authUser?.id,
      content: comment,
      is_audio_comment: false,
      parent_comment_id,
    };

    mutate(commentValues, {
      onSuccess: () => { 
        toast.success("replied to Comment successfully");
        setComment("");  
      },
      onError: () => { 
        toast.error("Failed to reply to Comment");
      },
    });
    console.log(commentValues);
    setComment("");
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
        />
        <button
          onClick={handleCommentSubmit}
          className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
          disabled={isPending}
        >
          {isPending ? <Spinner size={20} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};

export default CommentTabLevel2;
