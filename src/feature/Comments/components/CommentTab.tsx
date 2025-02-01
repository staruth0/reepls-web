import { Send } from "lucide-react";

interface CommentTabProps {
  toggleCommentTab: () => void;

}

const CommentTab: React.FC<CommentTabProps> = ({ toggleCommentTab }) => {
  return (
    <div className="flex items-center w-full p-2 border border-neutral-300 rounded-full bg-background transition-colors mb-5">
      <input
        type="text"
        placeholder="Add a comment..."
        className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-300"
      />
      <button
        onClick={toggleCommentTab}
        className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default CommentTab;
