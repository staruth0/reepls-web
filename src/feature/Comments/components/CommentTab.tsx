import { Send } from "lucide-react";
import { Comment } from "../../../models/datamodels";
import { useUser } from "../../../hooks/useUser";
import { useState } from "react";

interface CommentTabProps {
  toggleCommentTab: () => void;
  article_id: string;

}

const CommentTab: React.FC<CommentTabProps> = ({ toggleCommentTab, article_id }) => {
  const { authUser } = useUser();
  const [comment, setComment] = useState<string>("");
  
  const handleCommentSubmit = () => { 
    const commentValues: Comment = {
      article_id,
      author_id: authUser?.id,
      content: comment,
      is_audio_comment: false,
      parent_comment_id: article_id,
    } 

    console.log(commentValues);
  }

  return (
    <div className="flex items-center w-full p-2 border border-neutral-300 rounded-full bg-background transition-colors mb-5">
      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-300"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        onClick={toggleCommentTab}
        className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
      >
        <Send size={20} onClick={handleCommentSubmit}/>
      </button>
    </div>
  );
};

export default CommentTab;
