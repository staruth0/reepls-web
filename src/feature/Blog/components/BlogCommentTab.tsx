import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { Comment } from "../../../models/datamodels";
import { LuLoader, LuSend } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useCreateComment } from "../../Comments/hooks";
import EmojiPicker from "emoji-picker-react"; // Import the emoji picker

interface CommentTabProps {
  article_id: string;
}

const CommentTab: React.FC<CommentTabProps> = ({ article_id }) => {
  const { authUser, isLoggedIn } = useUser();
  const [comment, setComment] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false); // State to control emoji picker visibility
  const CommentTabRef = useRef<HTMLInputElement | null>(null);
  const { t } = useTranslation(); // For translations
  const navigate = useNavigate(); // For navigation

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isLoggedIn) {
      handleCommentSubmit();
    }
  };

  const { mutate, isPending } = useCreateComment();

  const validateCommentData = (commentData: Comment): boolean => {
    if (!commentData.article_id) {
      console.error("Article ID is required");
      return false;
    }
    if (!commentData.author_id) {
      console.error("Author ID is required");
      return false;
    }
    if (!commentData.content?.trim()) {
      console.error("Comment cannot be empty");
      return false;
    }
    return true;
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) return;

    const commentValues: Comment = {
      article_id,
      author_id: authUser?.id,
      content: comment,
      is_audio_comment: false,
    };

    if (!validateCommentData(commentValues)) {
      return;
    }

    mutate(commentValues, {
      onSuccess: () => {
        toast.success(t("You added 1 comment."));
        setComment("");
      },
      onError: () => {
        console.error("Failed to post comment");
        toast.error(t("Failed to post comment. Please try again later."));
      },
    });
  };

  // Function to handle emoji selection
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setComment((prevComment) => prevComment + emojiObject.emoji); // Append the selected emoji to the comment
    setEmojiPickerVisible(false); // Close the emoji picker after selection
  };

  useEffect(() => {
    if (CommentTabRef.current && isLoggedIn) {
      CommentTabRef.current.focus();
    }
  }, [isLoggedIn]);

  return (
    <div className="">
      <div className="flex items-center w-full p-2 border border-neutral-300 rounded-full bg-background transition-colors mb-5">
        <input
          type="text"
          placeholder={
            isLoggedIn
              ? t("What are your thoughts...")
              : t("Sign in to comment")
          }
          className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-300 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
          value={comment}
          onChange={(e) => isLoggedIn && setComment(e.target.value)} // Only update if logged in
          onKeyDown={handleKeyDown}
          ref={CommentTabRef}
          disabled={!isLoggedIn} // Disable input if not logged in
        />
        {isLoggedIn && (
          <>
            {/* Emoji Button */}
            <button
              onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
              className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
            >
              😀
            </button>
            {/* Send Button */}
            <button
              onClick={handleCommentSubmit}
              className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
              disabled={isPending || comment.trim() === ""}
            >
              {isPending ? (
                <LuLoader className="animate-spin inline-block mx-1" />
              ) : (
                <LuSend size={20} />
              )}
            </button>
          </>
        )}
        {!isLoggedIn && (
          <button
            className="ml-2 flex items-center w-40 justify-center gap-2 py-1 text-neutral-50 rounded-md shadow-sm hover:bg-primary-700 transition-colors"
            onClick={() => navigate("/auth")}
          >
            <FaRegUserCircle size={16} className="text-main-green" />
            {t("Sign In")}
          </button>
        )}
      </div>
      {/* Emoji Picker */}
      {isEmojiPickerVisible && (
        <div className="absolute z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default CommentTab;
