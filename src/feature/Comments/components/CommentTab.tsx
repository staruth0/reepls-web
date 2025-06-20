import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { Comment } from "../../../models/datamodels";
import { LuLoader, LuSend } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useTheme from "../../../hooks/useTheme";
import { smile } from "../../../assets/icons";
import { useSendCommentNotification } from "../../Notifications/hooks/useNotification";

interface CommentTabProps {
  article_id: string;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
}

const 
CommentTab: React.FC<CommentTabProps> = ({
  article_id,
  setIsCommentSectionOpen,
}) => {
  const {  isLoggedIn } = useUser();
  const [comment, setComment] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const CommentTabRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isLoggedIn) {
      handleCommentSubmit();
    }
  };

  // const { mutate, isPending } = useCreateComment();
  const {mutate,isPending} = useSendCommentNotification();

  const validateCommentData = (commentData: Comment): boolean => {
    if (!commentData.article_id) {
      return false;
    }
    if (!commentData.content?.trim()) {
      return false;
    }
    return true;
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) return;

    const commentValues = {
      article_id,
      content: comment,
    };

    if (!validateCommentData(commentValues)) {
      return;
    }

    mutate(commentValues, {
      onSuccess: () => {
        setIsCommentSectionOpen(true);
        toast.success(t("You added 1 comment."));
        setComment("");
      },
      onError: () => {
        toast.error(t("Failed to post comment. Please try again later."));
      },
    });
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setEmojiPickerVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const location = useLocation(); // Get current URL path

useEffect(() => {
  if (CommentTabRef.current && isLoggedIn && !location.pathname.includes("/posts/article/")) {
    CommentTabRef.current.focus();
  }
}, [isLoggedIn, location.pathname]);

  return (
    <div className="px-4">
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
          onChange={(e) => isLoggedIn && setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={CommentTabRef}
          disabled={!isLoggedIn}
        />
        {isLoggedIn && (
          <>
            {/* Emoji Button */}
            <div className="relative" ref={emojiPickerRef}>
              <button
                onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
                className="ml-2 p-1 text-neutral-100 hover:text-primary-400 transition-colors"
              >
                <img src={smile} alt="" className="w-6 h-6" />
              </button>
              {/* Emoji Picker */}
              {isEmojiPickerVisible && (
                <div className="absolute right-0 z-10 mt-2 bg-background rounded-lg shadow-lg">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme={theme === "light" ? Theme.LIGHT : Theme.DARK}
                  />
                </div>
              )}
            </div>
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
    </div>
  );
};

export default CommentTab;
