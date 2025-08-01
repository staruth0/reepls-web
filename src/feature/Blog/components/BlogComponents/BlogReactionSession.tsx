import { MessageCircle, ThumbsUp, Radio } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../hooks/useUser";
import { Article, User, ReactionReceived } from "../../../../models/datamodels";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import CommentSection from "../../../Comments/components/CommentSection";
import ReactionModal from "../../../Interactions/components/ReactionModal";
import { useGetArticleReactions } from "../../../Interactions/hooks";
import BlogRepostModal from "./BlogRepostModal";
import { t } from "i18next";
import { useRepostArticle } from "../../../Repost/hooks/useRepost";
import { LuLoader } from "react-icons/lu";

interface BlogReactionSessionProps {
  message?: string;
  isCommentSectionOpen: boolean;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  article_id: string; // This is the ID of the currently displayed article
  text_to_speech: string;
  author_of_post: User;
  article: Article;
}

interface RepostStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  onRetry?: () => void;
}

const RepostStatusModal: React.FC<RepostStatusModalProps> = ({
  isOpen,
  onClose,
  isSuccess,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000]">
      <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">
            {isSuccess ? "Repost Successful!" : "Repost Failed"}
          </h3>
          <p className="mb-6">
            {isSuccess
              ? "Your repost has been shared successfully."
              : "There was an error reposting. Please try again."}
          </p>
          <div className="flex justify-center gap-4">
            {!isSuccess && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-500 rounded hover:bg-neutral-800 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogReactionSession: React.FC<BlogReactionSessionProps> = ({
  isCommentSectionOpen,
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
  article,
}) => {
  const { isLoggedIn, authUser } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [commentTabState, setCommentTabState] = useState<boolean>(false);
  const [showReactPopup, setShowReactPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [repostStatus, setRepostStatus] = useState<{
    show: boolean;
    isSuccess: boolean;
  }>({ show: false, isSuccess: false });
  const repostRef = useRef<HTMLDivElement>(null);
  const [showRepostTooltip, setShowRepostTooltip] = useState(false);

  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const { mutate: repost, isPending: isReposting } = useRepostArticle();

  // Get all reactions for this article
  const { data: allReactions } = useGetArticleReactions(article_id);

  // Check if the current user has reacted
  useEffect(() => {
    if (isLoggedIn && authUser?.id && allReactions?.reactions) {
      const userReact = allReactions.reactions.find(
        (r: ReactionReceived) => r.user_id?.id === authUser.id
      );

      if (userReact) {
        setUserReaction(userReact.type);
      } else {
        setUserReaction(null);
      }
    }
  }, [isLoggedIn, authUser, allReactions]);

  // Close repost modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        repostRef.current &&
        !repostRef.current.contains(event.target as Node)
      ) {
        setShowRepostModal(false);
      }
    };

    if (showRepostModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showRepostModal]);

  const toggleCommentTab = () => {
    if (!isLoggedIn) {
      setShowCommentPopup(true);
      return;
    }
    if (!isCommentSectionOpen) {
      setCommentTabState(!commentTabState);
    }
  };

  const handleReactClick = () => {
    if (!isLoggedIn) {
      setShowReactPopup(true);
      return;
    }
    setModalOpen(true);
  };

  const handleReactionComplete = (reaction: string) => {
    setUserReaction(reaction);
  };

  const handleRepostClick = () => {
    if (!isLoggedIn) {
      // You can add a sign-in popup here if needed
      return;
    }
    // Always show the repost modal options when clicking the button
    setShowRepostModal(!showRepostModal);
  };

  const handleRepostOnly = () => {
    repost(
      { articleId: article_id, comment: "" }, // Always use the current article_id
      {
        onSuccess: () => {
          setShowRepostModal(false);
          setRepostStatus({ show: true, isSuccess: true });
        },
        onError: () => {
          setShowRepostModal(false);
          setRepostStatus({ show: true, isSuccess: false });
        },
      }
    );
  };

  const handleRepostWithThought = () => {
    setIsRepostModalOpen(true);
    setShowRepostModal(false);
  };

  const handleRetryRepost = () => {
    setRepostStatus({ show: false, isSuccess: false });
    handleRepostOnly();
  };

  const closeRepostStatusModal = () => {
    setRepostStatus({ show: false, isSuccess: false });
  };

  useEffect(() => {
    if (isCommentSectionOpen) {
      setCommentTabState(false);
    }
  }, [isCommentSectionOpen]);

  return (
    <div className="relative">
      <RepostStatusModal
        isOpen={repostStatus.show}
        onClose={closeRepostStatusModal}
        isSuccess={repostStatus.isSuccess}
        onRetry={handleRetryRepost}
      />

      <div className="blog-reaction-session border-t border-neutral-500 flex gap-4">
        {/* React Button */}
        <div className="relative">
          <button
            onMouseEnter={() => isLoggedIn && setModalOpen(true)}
            onClick={handleReactClick}
            className={`flex items-center gap-2 cursor-pointer group
              ${userReaction ? "text-primary-500" : "text-neutral-50"} `}
          >
            <ThumbsUp
              className={`size-5
                ${
                  userReaction
                    ? "fill-primary-500 text-primary-500"
                    : "text-neutral-50"
                } group-hover:text-primary-500 group-hover:fill-primary-500`}
            />
            <span className="group-hover:text-primary-500">
              {userReaction ? t("blog.Reacted") : t("blog.React")}
            </span>
          </button>
          {showReactPopup && (
            <SignInPopUp
              text={t("blog.React")}
              position="below"
              onClose={() => setShowReactPopup(false)}
            />
          )}
        </div>

        {/* Comment Button */}
        <div className="relative">
          <button
            className="text-neutral-50 cursor-pointer flex items-center gap-2 group"
            onClick={toggleCommentTab}
          >
            <MessageCircle className="size-5 text-neutral-50 group-hover:text-primary-500" />
            <span className="group-hover:text-primary-500">
              {" "}
              {t("blog.Comment")}{" "}
            </span>
          </button>
          {showCommentPopup && (
            <SignInPopUp
              text={t("blog.Comment")}
              position="below"
              onClose={() => setShowCommentPopup(false)}
            />
          )}
        </div>

        {/* Repost Button */}
        <div
          className="relative"
          ref={repostRef}
          onMouseEnter={() => setShowRepostTooltip(true)}
          onMouseLeave={() => setShowRepostTooltip(false)}
        >
          <button
            className="flex gap-1 items-center text-neutral-50 cursor-pointer group"
            onClick={handleRepostClick}
          >
            <Radio className="size-5 text-neutral-50 group-hover:text-primary-500" />
            <span className="text-[14px] text-neutral-50 group-hover:text-primary-500">
              Repost
            </span>
          </button>

          {/* Repost Tooltip (for reposted articles) */}
          {article.type === "Repost" && showRepostTooltip && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background border border-neutral-500 text-neutral-50 text-xs rounded-md py-1.5 px-2.5 whitespace-nowrap z-50 shadow-lg">
              Note: Reposting this article will share its original content
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-background" />
            </div>
          )}

          {/* Repost Modal */}
          {showRepostModal && (
            <div className="absolute bg-background bottom-full right-0 mt- border border-neutral-700 rounded-md shadow-lg z-50 min-w-[190px] p-2">
              <div className="py-1">
                <button
                  onClick={handleRepostOnly}
                  className="py-2 text-s hover:text-primary-400 transition-colors w-full text-left"
                  disabled={isReposting}
                >
                  {isReposting ? (
                    <>
                      <LuLoader className="animate-spin inline-block mr-1" />{" "}
                      Reposting...
                    </>
                  ) : (
                    "Repost only"
                  )}
                </button>
                <div className="w-full h-[.5px] bg-neutral-500"></div>
                <button
                  onClick={handleRepostWithThought}
                  className="py-2 text-s hover:text-primary-400 transition-colors"
                >
                  Repost with your thought
                </button>
              </div>
            </div>
          )}
        </div>

        <BlogRepostModal
          isOpen={isRepostModalOpen}
          onClose={() => setIsRepostModalOpen(false)}
          article_id={article_id} // Always pass the current article_id
          author_of_post={author_of_post}
        />

        {/* Reaction Modal */}
        <ReactionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onReact={handleReactionComplete}
          article_id={article_id}
          article={article}
        />
      </div>

      {/* Comment Section */}
      {commentTabState && (
        <CommentSection
          article_id={article_id}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
          article={article}
          author_of_post={author_of_post}
        />
      )}
      {isCommentSectionOpen && (
        <CommentSection
          article_id={article_id}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
          author_of_post={author_of_post}
          article={article}
        />
      )}
    </div>
  );
};

export default BlogReactionSession;
