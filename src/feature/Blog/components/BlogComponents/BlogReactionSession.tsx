import { MessageCircle, ThumbsUp, Radio } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import ReactionsPopup from "../../../Interactions/components/ReactionsPopup";
import { useUser } from "../../../../hooks/useUser";
import { Article, User, ReactionReceived } from "../../../../models/datamodels";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import CommentSection from "../../../Comments/components/CommentSection";
import ReactionModal from "../../../Interactions/components/ReactionModal";
import { useGetAllReactionsForTarget, useRepostArticle } from "../../../Repost/hooks/useRepost";
import BlogRepostModal from "./BlogRepostModal";
import { t } from "i18next";
import { LuLoader } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
//import { hand5, heart, thumb } from "../../../../assets/icons";
//import { cn } from "../../../../utils";

interface BlogReactionSessionProps {
  isCommentSectionOpen: boolean;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  article_id: string;
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
  const [repostStatus, setRepostStatus] = useState<{ show: boolean; isSuccess: boolean }>({
    show: false,
    isSuccess: false,
  });
  const repostRef = useRef<HTMLDivElement>(null);
  const [showRepostTooltip, setShowRepostTooltip] = useState(false);

  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const { mutate: repost, isPending: isReposting } = useRepostArticle();

  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showReactionPopupList, setShowReactionPopupList] = useState(false);
  const reactionCountRef = useRef<HTMLSpanElement>(null);

  const target_type = article.type === "Repost" ? "Repost" : "Article";
  const target_id =
    article.type === "Repost" && article.repost?.repost_id
      ? article.repost.repost_id
      : article_id;

  const { data: allReactions, isLoading: reactionsLoading } = useGetAllReactionsForTarget(
    target_type,
    target_id
  );

  const reactionCount = allReactions?.data?.totalReactions || 0;
  const commentCount = article.comment_count || 0;
  const repostCount = article.repost_count || 0;

  useEffect(() => {
    setIsMobile(window.innerWidth <= 768);
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isLoggedIn && authUser?.id && allReactions?.data?.reactions) {
      const userReact = allReactions.data.reactions.find(
        (r: ReactionReceived) => r.user_id === authUser.id
      );
      setUserReaction(userReact ? userReact.type : null);
    }
  }, [isLoggedIn, authUser, allReactions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        repostRef.current &&
        !repostRef.current.contains(event.target as Node) &&
        !reactionCountRef.current?.contains(event.target as Node)
      ) {
        setShowRepostModal(false);
        setShowReactionPopupList(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleCommentTab = () => {
    if (!isLoggedIn) {
      setShowCommentPopup(true);
      return;
    }
    if (!isCommentSectionOpen) {
      setCommentTabState(!commentTabState);
    }
  };

  const handleMouseDown = () => {
    if (!isMobile) return;
    const timer = setTimeout(() => setModalOpen(true), 1500);
    setHoldTimer(timer);
  };

  const handleMouseUp = () => {
    if (holdTimer) {
      clearTimeout(holdTimer);
      setHoldTimer(null);
    }
  };

  const handleClick = () => {
    if (isMobile) return;
    if (!isLoggedIn) {
      setShowReactPopup(true);
      return;
    }
    setUserReaction(userReaction === "like" ? null : "like");
  };

  const handleRepostClick = () => {
    if (!isLoggedIn) return;
    setShowRepostModal(!showRepostModal);
  };

  const handleRepostOnly = () => {
    repost(
      { articleId: article_id, comment: "" },
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
    if (isCommentSectionOpen) setCommentTabState(false);
  }, [isCommentSectionOpen]);

  // ---------- Reaction Stats Helper ----------
  const handleReactionPopupClick = () => {
    if (reactionCount === 0 && !reactionsLoading) {
      // optional: show a toast or popup
      return;
    }
    setShowReactionPopupList(true);
  };

  return (
    <div className="relative">
      <RepostStatusModal
        isOpen={repostStatus.show}
        onClose={closeRepostStatusModal}
        isSuccess={repostStatus.isSuccess}
        onRetry={handleRetryRepost}
      />

      <div className="blog-reaction-session border-t border-neutral-400 flex gap-8 py-2">
        {/* Reaction Button */}
        <div className="relative flex items-center gap-1">
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            className={`flex items-center gap-2 cursor-pointer group ${
              userReaction ? "text-primary-400" : "text-neutral-50"
            }`}
          >
            <ThumbsUp
              className={`size-5 ${
                userReaction
                  ? "fill-primary-400 text-primary-400"
                  : "text-neutral-50"
              } group-hover:text-primary-400 group-hover:fill-primary-400`}
            />
            <span className="group-hover:text-primary-400">{t("blog.React")}</span>
           {reactionCount > 0 && (
  <span
  ref={reactionCountRef}
  className="text-sm text-green-500 ml-2 cursor-pointer 
             px-3 py-0.5 rounded-full  
             hover:bg-green-200 transition-colors"
  title={`${reactionCount} Reactions`}
>
  {reactionCount >= 1000
    ? `${(reactionCount / 1000).toFixed(1)}k`
    : reactionCount}
</span>

)}

          </button>

          {showReactionPopupList && reactionCount > 0 && (
            <div className="absolute bottom-full left-0 mb-2 z-50">
              <ReactionsPopup
                isOpen={showReactionPopupList}
                onClose={() => setShowReactionPopupList(false)}
                article_id={article_id}
                article={article}
              />
            </div>
          )}

          {showReactPopup && (
            <SignInPopUp
              text={t("blog.React")}
              position="below"
              onClose={() => setShowReactPopup(false)}
            />
          )}
        </div>

        {/* Comment Button */}
        <div className="relative flex items-center gap-1">
          <button
            className="text-neutral-50 cursor-pointer flex items-center gap-2 group"
            onClick={toggleCommentTab}
          >
            <MessageCircle className="size-5 text-neutral-50 group-hover:text-primary-400" />
            <span className="group-hover:text-primary-400">{t("blog.Comment")}</span>
            {commentCount > 0 && (
              <span className="text-sm text-neutral-400 ml-1">{commentCount}</span>
            )}
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
          className="relative flex items-center gap-1"
          ref={repostRef}
          onMouseEnter={() => setShowRepostTooltip(true)}
          onMouseLeave={() => setShowRepostTooltip(false)}
        >
          <button
            className="flex gap-1 items-center text-neutral-50 cursor-pointer group"
            onClick={handleRepostClick}
          >
            <Radio className="size-5 text-neutral-50 group-hover:text-primary-400" />
            <span className="text-[14px] text-neutral-50 group-hover:text-primary-400">
              Repost
            </span>
            {repostCount > 0 && (
              <span className="text-sm text-neutral-400 ml-1">{repostCount}</span>
            )}
          </button>

          {showRepostTooltip && article.type === "Repost" && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background border border-neutral-400 text-neutral-50 text-xs rounded-md py-1.5 px-2.5 whitespace-nowrap z-50 shadow-lg">
              Note: Reposting this article will share its original content
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-0 border-t-4 border-l-transparent border-r-transparent border-t-background" />
            </div>
          )}

          {showRepostModal && (
            <div className="absolute bg-background bottom-full right-0 border border-neutral-700 rounded-md shadow-lg z-50 min-w-[190px] p-2">
              <div className="py-1">
                <button
                  onClick={handleRepostOnly}
                  className="py-2 text-s hover:text-primary-400 transition-colors w-full text-left"
                  disabled={isReposting}
                >
                  {isReposting ? (
                    <>
                      <LuLoader className="animate-spin inline-block mr-1" />
                      Reposting...
                    </>
                  ) : (
                    "Repost only"
                  )}
                </button>
                <div className="w-full h-[.5px] bg-neutral-400"></div>
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
      </div>

      <BlogRepostModal
        isOpen={isRepostModalOpen}
        onClose={() => setIsRepostModalOpen(false)}
        article_id={article_id}
        author_of_post={author_of_post}
        article={article}
      />

      <ReactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onReact={(reaction: string) => setUserReaction(reaction)}
        article_id={article_id}
        article={article}
      />

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
