import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Article } from "../../../models/datamodels";
import { useUser } from "../../../hooks/useUser";
import { validateComment } from "../utils/commentHelpers";

interface UseCommentInputOptions {
  article: Article;
  article_id: string;
  parentCommentId?: string;
  onSubmit: (content: string) => void;
}

export const useCommentInput = ({ article: _article, article_id: _article_id, parentCommentId: _parentCommentId, onSubmit }: UseCommentInputOptions) => {
  const { isLoggedIn } = useUser();
  const { t } = useTranslation();
  const [comment, setComment] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

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

  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setComment((prevComment) => prevComment + emojiObject.emoji);
  };

  const handleSubmit = () => {
    if (!isLoggedIn) {
      return;
    }

    const validation = validateComment(comment);
    if (!validation.valid) {
      return;
    }

    onSubmit(comment.trim());
    setComment("");
    setEmojiPickerVisible(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && isLoggedIn && comment.trim()) {
      handleSubmit();
    }
  };

  return {
    comment,
    setComment,
    isEmojiPickerVisible,
    setEmojiPickerVisible,
    inputRef,
    emojiPickerRef,
    handleEmojiClick,
    handleSubmit,
    handleKeyDown,
    isLoggedIn,
    t,
  };
};

