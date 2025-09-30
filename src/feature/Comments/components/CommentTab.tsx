import { useEffect, useRef, useState } from "react";
import { useUser } from "../../../hooks/useUser";
import { Article, Comment } from "../../../models/datamodels";
import { LuLoader, LuSend, LuSmile } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useTheme from "../../../hooks/useTheme";

import { useSendCommentNotification } from "../../Notifications/hooks/useNotification";
import { useAddCommentToRepost } from "../../Repost/hooks/useRepost";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../../utils";

interface CommentTabProps {
  article_id: string;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  article: Article;
}

const CommentTab: React.FC<CommentTabProps> = ({
  article_id,
  setIsCommentSectionOpen,
  article,
}) => {
  const { isLoggedIn } = useUser();
  const [comment, setComment] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isPendingRepost, setIsPendingRepost] = useState(false);
  const CommentTabRef = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { mutate: addCommentToRepost } = useAddCommentToRepost();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isLoggedIn) {
      handleCommentSubmit();
    }
  };

  const { mutate, isPending } = useSendCommentNotification();

  const validateCommentData = (commentData: Comment): boolean => {
    if (!commentData.article_id) {
      return false;
    }
    if (!commentData.content?.trim()) {
      return false;
    }
    return true;
  };

  const validateRepostCommentData = (commentData: { repostId: string; content: string }): boolean => {
    if (!commentData.repostId) {
      return false;
    }
    if (!commentData.content?.trim()) {
      return false;
    }
    return true;
  };

  const handleCommentSubmit = () => {
    if (!isLoggedIn) return;

    if (article.type === "Repost") {
      const repostId = article.repost?.repost_id;
      if (!repostId) return;

      const commentValuesRepost = {
        repostId,
        content: comment,
      };

      if (!validateRepostCommentData(commentValuesRepost)) {
        return;
      }

      setIsPendingRepost(true);
      addCommentToRepost(commentValuesRepost, {
        onSuccess: () => {
          setIsCommentSectionOpen(true);
          toast.success(t("You added 1 comment."));
          setComment("");
          setIsPendingRepost(false);
        },
        onError: () => {
          toast.error(t("Failed to post comment. Please try again later."));
          setIsPendingRepost(false);
        },
      });
    } else {
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
    }
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

  const location = useLocation();

  useEffect(() => {
    if (CommentTabRef.current && isLoggedIn && !location.pathname.includes("/posts/article/")) {
      CommentTabRef.current.focus();
    }
  }, [isLoggedIn, location.pathname]);

  const isSending = isPending || isPendingRepost;

  return (
    <motion.div 
      className="px-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <motion.div 
          className={cn(
            "flex items-center w-full p-2 border border-neutral-300 rounded-full bg-background transition-colors",
            isSending && "opacity-75"
          )}
          whileHover={{ scale: 1.01 }}
          whileFocus={{ scale: 1.01 }}
        >
          <input
            type="text"
            placeholder={
              isLoggedIn
                ? t("What are your thoughts...")
                : t("Sign in to comment")
            }
            className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-100 px-2 disabled:opacity-50 disabled:cursor-not-allowed"
            value={comment}
            onChange={(e) => isLoggedIn && setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={CommentTabRef}
            disabled={!isLoggedIn || isSending}
          />
          
          {isLoggedIn && (
            <div className="flex items-center gap-2">
              {/* Emoji Button */}
              <div className="relative" ref={emojiPickerRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
                  className="p-2 rounded-full text-neutral-100 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
                >
                  <LuSmile size={18} />
                </motion.button>
                
                {/* Emoji Picker */}
                <AnimatePresence>
                  {isEmojiPickerVisible && (
                    <motion.div 
                      className="absolute right-0 z-20 mt-2 bg-neutral-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-neutral-600/50"
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={theme === "light" ? Theme.LIGHT : Theme.DARK}
                        width={300}
                        height={350}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCommentSubmit}
                disabled={isSending || comment.trim() === ""}
                className={cn(
                  "p-2 rounded-full transition-all duration-200",
                  comment.trim() === "" || isSending
                    ? "text-neutral-100 cursor-not-allowed"
                    : "text-primary-400 hover:text-primary-300 hover:bg-primary-500/20"
                )}
              >
                {isSending ? (
                  <LuLoader className="animate-spin" size={18} />
                ) : (
                  <LuSend size={18} />
                )}
              </motion.button>
            </div>
          )}
          
          {!isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-2 flex items-center gap-2 px-4 py-2 text-neutral-100 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg border border-primary-500/30 transition-all duration-200"
              onClick={() => navigate("/auth")}
            >
              <FaRegUserCircle size={16} className="text-primary-400" />
              <span className="text-sm font-medium">{t("Sign In")}</span>
            </motion.button>
          )}
        </motion.div>
        
        {/* Character count indicator */}
        {isLoggedIn && comment.length > 0 && (
          <motion.div 
            className="absolute -bottom-6 right-0 text-xs text-neutral-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {comment.length}/500
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CommentTab;
