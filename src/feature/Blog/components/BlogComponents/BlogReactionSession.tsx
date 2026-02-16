import { MessageCircle, Radio } from "lucide-react";
import { Icon } from "@iconify/react";
import React, { useEffect, useState, useRef } from "react";
import { useUser } from "../../../../hooks/useUser";
import { Article, User, ReactionReceived } from "../../../../models/datamodels";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import CommentSection from "../../../Comments/components/CommentSection";
import ReactionModal from "../../../Interactions/components/ReactionModal";
import ReactionsPopup from "../../../Interactions/components/ReactionsPopup";
import { useGetAllReactionsForTarget, useGetCommentsTreeForRepost, useGetRepostCountSimple } from "../../../Repost/hooks/useRepost";
import { useGetCommentsByArticleId } from "../../../Comments/hooks";
import BlogRepostModal from "./BlogRepostModal";
import { t } from "i18next";
import { useRepostArticle } from "../../../Repost/hooks/useRepost";
import { LuLoader } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";

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
            {isSuccess ? "Republish Successful!" : "Republish Failed"}
          </h3>
          <p className="mb-6">
            {isSuccess
              ? "Your republish has been shared successfully."
              : "There was an error republishing. Please try again."}
          </p>
          <div className="flex justify-center gap-4">
            {!isSuccess && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-primary-400 text-white rounded hover:bg-primary-600 transition"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-neutral-400 rounded hover:bg-neutral-800 transition"
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
  const [showReactionsPopup, setShowReactionsPopup] = useState(false);

  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const { mutate: repost, isPending: isReposting } = useRepostArticle();

  const target_type = article.type === "Repost" ? "Repost" : "Article";
  const target_id = article.type === "Repost" && article.repost?.repost_id ? article.repost?.repost_id : article_id;

  
  // Get all reactions for this article
  const { data: allReactions } = useGetAllReactionsForTarget(target_type, target_id);
  
  // Get comment counts
  const { data: articleComments, isLoading: commentsLoading } = useGetCommentsByArticleId(article_id);
  const { data: repostComments } = useGetCommentsTreeForRepost(article.repost?.repost_id || "");
  
  // Get repost count using the new API
  const { data: repostCountData, isLoading: repostCountLoading } = useGetRepostCountSimple(article_id);
  
  // Calculate total comments (handle reposts vs regular articles)
  const totalComments = article.type === "Repost"
    ? repostComments?.parentCommentsCount ?? 0
    : articleComments?.pages?.[0]?.data?.totalComments ?? 0;
  
  // Get reaction count
  const reactionCount = allReactions?.data?.totalReactions || 0;
  
  // Get repost count from API
  const repostCount = repostCountData?.repostCount || 0;

  // Check if the current user has reacted
  useEffect(() => {
    if (isLoggedIn && authUser?.id && allReactions?.data?.reactions) {
      const userReact = allReactions.data.reactions.find(
        (r: ReactionReceived) => r.user_id === authUser.id
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

  const handleReactionCountClick = () => {
    if (reactionCount > 0) {
      setShowReactionsPopup(true);
    }
  };

  const handleCloseReactionsPopup = () => {
    setShowReactionsPopup(false);
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

      <div className={` ${ target_type === "Repost" || article.isArticle ? " " : "border-t border-neutral-600"}  flex items-center gap-4 sm:gap-6 md:gap-8 py-3`}>
        {/* React Button */}
        <div className={`relative flex items-center ${reactionCount > 0 ? " gap-2" : ""}`}>
          <div className="relative">
            <button
              onMouseEnter={() => isLoggedIn && setModalOpen(true)}
              onClick={handleReactClick}
              className={`cursor-pointer group
                ${userReaction ? "text-primary-400" : "text-neutral-100"} `}
            >
              <Icon 
                icon="pepicons-pencil:hands-clapping" 
                className={`w-6 h-6 transform scale-x-[-1]
                  ${
                    userReaction
                      ? "text-primary-400"
                      : "text-neutral-100"
                  } group-hover:text-primary-400`} 
              />
            </button>
            
            {/* Reaction Modal positioned relative to clap icon */}
            {isModalOpen && (
              <ReactionModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onReact={handleReactionComplete}
                article_id={article_id}
                article={article}
              />
            )}
          </div>
          
          <div className="relative">
            {reactionCount > 0 && <span 
              className={`text-sm hover:text-primary-400 hover:underline underline-offset-1 cursor-pointer ${
                userReaction ? "text-primary-400" : "text-neutral-100"
              }`}
              onClick={handleReactionCountClick}
            >
              {allReactions ? reactionCount : "..."}
            </span>}
            
            {/* Reactions Popup positioned relative to reaction count */}
            {showReactionsPopup && reactionCount > 0 && (
              <ReactionsPopup
                isOpen={showReactionsPopup}
                onClose={handleCloseReactionsPopup}
                article_id={article_id}
                article={article}
                position={{ top: -200, right: 0 }}
              />
            )}
          </div>
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
            className="text-neutral-100 cursor-pointer flex items-center gap-2 group"
            onClick={toggleCommentTab}
          >
            <MessageCircle className="size-5 text-neutral-100 group-hover:text-primary-400" />
            {totalComments > 0 && <span className="text-sm text-neutral-100 group-hover:text-primary-400">
              {commentsLoading ? "..." : totalComments}
            </span>}
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
            className="flex gap-2 items-center text-neutral-100 cursor-pointer group"
            onClick={handleRepostClick}
          >
            <Radio className="size-5 text-neutral-100 group-hover:text-primary-400" />
           {repostCount > 0 && <span className="text-sm text-neutral-100 group-hover:text-primary-400">
              {repostCountLoading ? "..." : repostCount}
            </span>}
          </button>

          {/* Repost Tooltip (for reposted articles) */}
          {article.type === "Repost" && showRepostTooltip && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background border border-neutral-400 text-neutral-50 text-xs rounded-md py-1.5 px-2.5 whitespace-nowrap z-50 shadow-lg">
              Note: Republishing this article will share its original content
              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-background" />
            </div>
          )}

          {/* Repost Modal */}
          {showRepostModal && (
            <div className="absolute bg-background bottom-full left-0 sm:left-auto sm:right-0 mt-2 border border-neutral-700 rounded-lg shadow-xl z-50 min-w-[200px] p-3">
              <div className="py-1">
                <button
                  onClick={handleRepostOnly}
                  className="py-3 px-2 text-sm hover:text-primary-400 hover:bg-neutral-800 transition-colors w-full text-left rounded-md"
                  disabled={isReposting}
                >
                  {isReposting ? (
                    <>
                      <LuLoader className="animate-spin inline-block mr-1" />{" "}
                      Republishing...
                    </>
                  ) : (
                    "Republish only"
                  )}
                </button>
                <div className="w-full h-px bg-neutral-600 my-1"></div>
                <button
                  onClick={handleRepostWithThought}
                  className="py-3 px-2 text-sm hover:text-primary-400 hover:bg-neutral-800 transition-colors w-full text-left rounded-md"
                >
                  Republish with your thought
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
          article={article}
        />
      </div>  

      {/* Comment Section */}
      <AnimatePresence mode="wait">
        {(commentTabState || isCommentSectionOpen) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-4"
          >
            <CommentSection
              article_id={article_id}
              setIsCommentSectionOpen={setIsCommentSectionOpen}
              article={article}
              author_of_post={author_of_post}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogReactionSession;
