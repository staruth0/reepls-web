import { Send, Mic } from "lucide-react";
import { useState } from "react";
import EmojiPack from "./EmojiPack";

interface CommentTabProps {
  toggleCommentTab: () => void;
}

const CommentTab: React.FC<CommentTabProps> = ({ toggleCommentTab }) => {
  const [emojiPackState, setEmojiPackState] = useState(false);
  const [comment, setComment] = useState("");

  const toggleEmojiPack = () => {
    setEmojiPackState(!emojiPackState);
  };

  const handleEmojiSelect = (emoji: string) => {
    setComment((prevComment) => prevComment + emoji);
  };

  const handleMicClick = () => {
    alert("Voice functionality coming soon!");
  };

  return (
    <div className="relative flex flex-col items-start w-full">
      <div className="flex items-center w-full p-2 border border-neutral-300 rounded-full bg-background transition-colors mb-5 mt-5">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-300"
        />

        <button
          className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
          onClick={toggleEmojiPack}
        >
          😀
        </button>

        <button
          onClick={comment.trim() === "" ? handleMicClick : toggleCommentTab}
          className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
        >
          {comment.trim() === "" ? <Mic size={20} /> : <Send size={20} />}
        </button>
      </div>

      {emojiPackState && (
        <EmojiPack
          onSelectEmoji={handleEmojiSelect}
          onClose={() => setEmojiPackState(false)}
        />
      )}
    </div>
  );
};

export default CommentTab;
