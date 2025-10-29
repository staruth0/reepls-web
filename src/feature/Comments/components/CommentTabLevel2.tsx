import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUser } from "../../../hooks/useUser";
import { LuSend, LuLoader } from "react-icons/lu";
import EmojiPicker, { Theme } from "emoji-picker-react";
import useTheme from "../../../hooks/useTheme";
import { smile } from "../../../assets/icons";
import { useSendCommentNotification } from "../../Notifications/hooks/useNotification";
import { Article } from "../../../models/datamodels";
import { useAddCommentToRepost } from "../../Repost/hooks/useRepost";
import { validateComment } from "../utils";

interface CommentTabProps {
  article_id: string;
  parent_comment_id: string;
  article: Article;
}

const CommentTabLevel2: React.FC<CommentTabProps> = ({
  article_id,
  parent_comment_id,
  article,
}) => {
  const { authUser } = useUser();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const CommentTabLevel2ref = useRef<HTMLInputElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();

  const isRepost = article?.type === "Repost" && article?.repost?.repost_id;

  // Get mutate and isPending separately from both hooks
  const { mutate: addCommentToRepost, isPending: isPendingRepost } = useAddCommentToRepost();
  const { mutate: addCommentToArticle, isPending: isPendingArticle } = useSendCommentNotification();

  // Combine both pending states to control UI state
  const isPending = isRepost ? isPendingRepost : isPendingArticle;

  useEffect(() => {
    if (CommentTabLevel2ref.current) {
      CommentTabLevel2ref.current.focus();
    }
  }, []);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCommentSubmit();
    }
  };

  const handleCommentSubmit = () => {
    if (!authUser?.id) {
      toast.error("You must be logged in to comment.");
      return;
    }

    if (!isRepost && !article_id) {
      toast.error("Invalid article ID.");
      return;
    }

    if (isRepost && !article.repost?.repost_id) {
      toast.error("Invalid repost ID.");
      return;
    }

    const validation = validateComment(comment);
    if (!validation.valid) {
      if (validation.message) toast.error(validation.message);
      return;
    }

    if (isRepost) {
      const repostId = article.repost?.repost_id;
      if (!repostId) {
        toast.error("Invalid repost ID.");
        return;
      }

      const repostCommentValues = {
        repostId,
        content: comment,
        parent_comment_id,
      };

      addCommentToRepost(repostCommentValues, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["repost-comments-tree"] });
          toast.success("Replied to repost comment successfully");
          setComment("");
          setEmojiPickerVisible(false);
        },
        onError: () => {
          toast.error("Failed to reply to repost comment");
        },
      });
    } else {
      const articleCommentValues = {
        article_id: article_id,
        content: comment,
        parent_comment_id,
      };

      addCommentToArticle(articleCommentValues, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["comments", article_id] });
          toast.success("Replied to comment successfully");
          setComment("");
          setEmojiPickerVisible(false);
        },
        onError: () => {
          toast.error("Failed to reply to comment");
        },
      });
    }
  };

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  return (
    <div className="px-4 self-end w-[90%]">
      <div className="flex items-center w-full border border-neutral-300 rounded-full bg-background transition-colors mb-2 pl-3 pr-1 py-1.5">
        <input
          type="text"
          placeholder="What are your thoughts..."
          className="flex-grow bg-transparent outline-none text-sm text-neutral-100 placeholder-neutral-300 px-2"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={CommentTabLevel2ref}
          spellCheck={false}
        />
        <div className="relative flex-shrink-0 hidden md:block" ref={emojiPickerRef}>
          <button
            onClick={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
            className="p-1 text-neutral-100 hover:text-primary-400 transition-colors"
            type="button"
            aria-label="Toggle emoji picker"
          >
            <img src={smile} alt="Emoji Picker" className="w-5 h-5" />
          </button>
          {isEmojiPickerVisible && (
            <div className="absolute z-10 right-0 mt-2 bg-background rounded-lg shadow-lg">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={theme === "light" ? Theme.LIGHT : Theme.DARK}
              />
            </div>
          )}
        </div>
        <button
          onClick={handleCommentSubmit}
          className="p-1 text-neutral-100 hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isPending || comment.trim() === ""}
          type="button"
          aria-label="Send comment"
        >
          {isPending ? (
            <LuLoader className="animate-spin" size={18} />
          ) : (
            <LuSend size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default CommentTabLevel2;
