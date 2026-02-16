import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../hooks/useUser";
import { Article } from "../../../models/datamodels";
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
import { useCommentInput } from "../hooks/useCommentInput";
import { isRepostType } from "../utils";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { mutate: sendComment, isPending } = useSendCommentNotification();
  const { mutate: addCommentToRepost, isPending: isPendingRepost } = useAddCommentToRepost();
  const [isPendingRepostLocal, setIsPendingRepostLocal] = useState(false);
  
  const CommentTabRef = useRef<HTMLInputElement | null>(null);

  const handleCommentSubmit = (content: string) => {
    if (!isLoggedIn) {
      navigate("/auth");
      return;
    }

    if (!content || content.trim() === "") {
      return;
    }

    if (isRepostType(article)) {
      const repostId = article.repost.repost_id;
      setIsPendingRepostLocal(true);
      
      addCommentToRepost({ repostId, content }, {
        onSuccess: () => {
          setIsCommentSectionOpen(true);
          queryClient.invalidateQueries({ queryKey: ["repost-comments-tree", repostId] });
          toast.success(t("You added 1 comment."));
          setIsPendingRepostLocal(false);
        },
        onError: () => {
          toast.error(t("Failed to post comment. Please try again later."));
          setIsPendingRepostLocal(false);
        },
      });
    } else {
      sendComment({ article_id, content }, {
        onSuccess: () => {
          setIsCommentSectionOpen(true);
          queryClient.invalidateQueries({ queryKey: ["comments", article_id] });
          toast.success(t("You added 1 comment."));
        },
        onError: () => {
          toast.error(t("Failed to post comment. Please try again later."));
        },
      });
    }
  };

  const {
    comment,
    setComment,
    isEmojiPickerVisible,
    setEmojiPickerVisible,
    emojiPickerRef,
    handleEmojiClick,
    handleSubmit,
    handleKeyDown,
  } = useCommentInput({
    article,
    article_id,
    parentCommentId: undefined,
    onSubmit: handleCommentSubmit,
  });

  useEffect(() => {
    if (CommentTabRef.current && isLoggedIn && !location.pathname.includes("/posts/article/")) {
      CommentTabRef.current.focus();
    }
  }, [isLoggedIn, location.pathname]);

  const isSending = isPending || isPendingRepost || isPendingRepostLocal;

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
            "flex items-center w-full p-1.5 sm:p-2 border border-neutral-300 rounded-full bg-background transition-colors",
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
            className="flex-grow min-w-0 bg-transparent outline-none text-xs sm:text-sm text-neutral-100 placeholder-neutral-100 px-1.5 sm:px-2 disabled:opacity-50 disabled:cursor-not-allowed"
            value={comment}
            onChange={(e) => isLoggedIn && setComment(e.target.value)}
            onKeyDown={handleKeyDown}
            ref={CommentTabRef}
            disabled={!isLoggedIn || isSending}
          />
          
          {isLoggedIn && (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Emoji Button */}
              <div className="relative" ref={emojiPickerRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
                  className="p-1.5 sm:p-2 rounded-full text-neutral-100 hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
                >
                  <LuSmile className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
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
                onClick={handleSubmit}
                disabled={isSending || comment.trim() === ""}
                className={cn(
                  "p-1.5 sm:p-2 rounded-full transition-all duration-200",
                  comment.trim() === "" || isSending
                    ? "text-neutral-100 cursor-not-allowed"
                    : "text-primary-400 hover:text-primary-300 hover:bg-primary-500/20"
                )}
              >
                {isSending ? (
                  <LuLoader className="animate-spin w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                ) : (
                  <LuSend className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
                )}
              </motion.button>
            </div>
          )}
          
          {!isLoggedIn && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="ml-2 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-neutral-100 bg-primary-500/20 hover:bg-primary-500/30 rounded-lg border border-primary-500/30 transition-all duration-200 flex-shrink-0"
              onClick={() => navigate("/auth")}
            >
              <FaRegUserCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-400" />
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{t("Sign In")}</span>
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
