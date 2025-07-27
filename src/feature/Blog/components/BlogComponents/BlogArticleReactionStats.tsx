import React, { useState, useEffect, useRef } from "react";
import {
  PenLine,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Radio,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { useGetCommentsByArticleId } from "../../../Comments/hooks";
import ReactionsPopup from "../../../Interactions/components/ReactionsPopup";
import ReactionModal from "../../../Interactions/components/ReactionModal";
import { useGetArticleReactions } from "../../../Interactions/hooks";
import { t } from "i18next";
import { Article, ReactionReceived, User } from "../../../../models/datamodels";
import { motion } from "framer-motion";
import { cn } from "../../../../utils";
import { useUser } from "../../../../hooks/useUser";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import CommentSection from "../../../Comments/components/CommentSection";
import BlogRepostModal from "./BlogRepostModal";
import { useRepostArticle } from "../../../Repost/hooks/useRepost";
import { LuLoader } from "react-icons/lu";
import {
  useSaveArticle,
  useRemoveSavedArticle,
  useGetSavedArticles,
} from "../../../Saved/hooks";
import { toast } from "react-toastify";

interface BlogReactionStatsProps {
  date: string;
  toggleCommentSection?: () => void;
  article_id: string;
  article: Article;
  author_of_post: User;
}

const RepostStatusModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  onRetry?: () => void;
}> = ({ isOpen, onClose, isSuccess, onRetry }) => {
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

const BlogArticleReactionStats: React.FC<BlogReactionStatsProps> = ({
  toggleCommentSection,
  article_id,
  article,
  author_of_post,
}) => {
  const { isLoggedIn, authUser } = useUser();
  const queryClient = useQueryClient(); // Initialize queryClient

  // Save article states
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } =
    useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const [saved, setSaved] = useState(false);
  const [showSaveSignInPopup, setShowSaveSignInPopup] = useState(false);

  // Reaction states
  const [showReactions, setShowReactions] = useState(false);
  const [showNoReactionsPopup, setShowNoReactionsPopup] = useState(false);
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);
  const [showReactSignInPopup, setShowReactSignInPopup] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);

  // Comment states
  const [commentTabState, setCommentTabState] = useState<boolean>(false);
  const [showCommentSignInPopup, setShowCommentSignInPopup] = useState(false);

  // Repost states
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showRepostModal, setShowRepostModal] = useState(false);
  const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
  const repostRef = useRef<HTMLDivElement>(null);
  const [repostStatus, setRepostStatus] = useState<{
    show: boolean;
    isSuccess: boolean;
  }>({ show: false, isSuccess: false });
  const { mutate: repost, isPending: isReposting } = useRepostArticle();

  const { data: articleComments, isLoading: commentsLoading } =
    useGetCommentsByArticleId(article_id);
  const { data: allReactions, isLoading: reactionsLoading } =
    useGetArticleReactions(article_id);

  const totalComments = articleComments?.pages?.[0]?.data?.totalComments;
  const reactionCount = allReactions?.reactions?.length || 0;

  useEffect(() => {
    const isSaved = savedArticles?.articles?.some(
      (item: any) => item?.article?._id === article_id // Ensure you're checking the correct property if Article is wrapped
    );
    setSaved(isSaved);
  }, [savedArticles, article_id]);

  useEffect(() => {
    if (isLoggedIn && authUser?.id && allReactions?.reactions) {
      const userReact = allReactions.reactions.find(
        (r: ReactionReceived) => r.user_id?.id === authUser.id
      );
      setUserReaction(userReact?.type || null);
    }
  }, [isLoggedIn, authUser, allReactions]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSavedArticle = () => {
    if (!isLoggedIn) {
      setShowSaveSignInPopup(true);
      return;
    }
    if (isSavePending || isRemovePending) return;

    if (saved) {
      removeSavedArticle(article_id, {
        onSuccess: () => {
          toast.success(t("blog.alerts.articleRemoved"));
          // Invalidate and refetch the saved articles query
          queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
        },
        onError: () => {
          toast.error(t("blog.alerts.articleRemoveFailed"));
          setSaved(true); // Revert to saved on error
          // Optional: Roll back to previous data
          // queryClient.setQueryData(['savedArticles'], context?.previousSavedArticles);
        },
      });
    } else {
      saveArticle(article_id, {
        onSuccess: () => {
          toast.success(t("blog.alerts.articleSaved"));
          // Invalidate and refetch the saved articles query
          queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
        },
        onError: () => {
          toast.error(t("blog.alerts.articleSaveFailed"));
          setSaved(false); // Revert to unsaved on error
          // Optional: Roll back to previous data
          // queryClient.setQueryData(['savedArticles'], context?.previousSavedArticles);
        },
      });
    }
  };

  const handleCloseReactionPopup = () => {
    setShowReactions(false);
  };

  const handleReactionCountClick = () => {
    if (reactionCount === 0 && !reactionsLoading) {
      setShowNoReactionsPopup(true);
      setTimeout(() => setShowNoReactionsPopup(false), 3000);
    } else {
      setShowReactions(true);
    }
  };

  const handleThumbsUpClick = () => {
    if (!isLoggedIn) {
      setShowReactSignInPopup(true);
      return;
    }
    setIsReactionModalOpen(true);
  };

  const handleReactionComplete = (reaction: string) => {
    setUserReaction(reaction);
  };

  const toggleCommentSectionInternal = () => {
    if (!isLoggedIn) {
      setShowCommentSignInPopup(true);
      return;
    }
    setCommentTabState(!commentTabState);

    if (toggleCommentSection) {
      toggleCommentSection();
    }
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

  const popupVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <>
      <RepostStatusModal
        isOpen={repostStatus.show}
        onClose={closeRepostStatusModal}
        isSuccess={repostStatus.isSuccess}
        onRetry={handleRetryRepost}
      />

      <div className="flex justify-between items-center p-4 text-neutral-50 text-sm font-roboto">
        <div className="flex items-center gap-5 h-[30px] relative cursor-pointer">
          <div className="flex gap-0 items-center group">
            <div className="flex relative">
              {reactionsLoading ? (
                <div className="flex gap-1 -ml-1">
                  <div className="w-5 h-5 bg-neutral-500 rounded-full animate-pulse" />
                  <div className="w-5 h-5 bg-neutral-500 rounded-full animate-pulse -ml-2" />
                  <div className="w-5 h-5 bg-neutral-500 rounded-full animate-pulse -ml-2" />
                </div>
              ) : (
                <>
                  <ThumbsUp
                    onMouseEnter={() =>
                      isLoggedIn && setIsReactionModalOpen(true)
                    }
                    onClick={handleThumbsUpClick}
                    className={cn(
                      "size-4",
                      userReaction ? "fill-primary-400 text-primary-400" : ""
                    )}
                  />
                </>
              )}
            </div>
            <div
              className="ml-1 hover:underline hover:text-primary-500 underline-offset-1"
              onClick={(e) => {
                e.stopPropagation();
                handleReactionCountClick();
              }}
            >
              {reactionsLoading ? (
                <div className="w-6 h-4 bg-neutral-500 rounded-md animate-pulse" />
              ) : (
                <div>{reactionCount}</div>
              )}
            </div>
          </div>

          {showReactSignInPopup && (
            <SignInPopUp
              text={t("blog.React")}
              position="below"
              onClose={() => setShowReactSignInPopup(false)}
            />
          )}

          <ReactionModal
            isOpen={isReactionModalOpen}
            onClose={() => setIsReactionModalOpen(false)}
            onReact={handleReactionComplete}
            article_id={article_id}
            article={article}
          />

          {showNoReactionsPopup && (
            <motion.div
              className={cn(
                "absolute top-0 right-12 w-64 p-4 rounded-lg shadow-lg bg-background",
                "z-50"
              )}
              variants={popupVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <p className="text-sm font-light leading-relaxed">
                No reactions to view yet
              </p>
              <button
                onClick={() => setShowNoReactionsPopup(false)}
                className="mt-2 text-xs underline hover:text-primary-200 transition-colors"
              >
                {t("Got it!")}
              </button>
            </motion.div>
          )}

          <div
            className="ml-4 text-neutral-50 hover:text-primary-500 hover:underline underline-offset-1 flex items-center gap-1 min-w-[120px]"
            onClick={toggleCommentSectionInternal}
          >
            {commentsLoading ? (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-neutral-500 rounded-full animate-pulse" />
                <div className="w-20 h-4 bg-neutral-500 rounded-md animate-pulse" />
              </div>
            ) : totalComments > 0 ? (
              <div className="flex items-center gap-1">
                <MessageSquare className="size-4" />
                {totalComments}
              </div>
            ) : (
              <>
                <PenLine size={16} />
                {isSmallScreen ? "Your thoughts?" : "What are your thoughts"}
              </>
            )}
          </div>

          {showCommentSignInPopup && (
            <SignInPopUp
              text={t("blog.Comment")}
              position="below"
              onClose={() => setShowCommentSignInPopup(false)}
            />
          )}
        </div>

        {showReactions && reactionCount > 0 && (
          <ReactionsPopup
            isOpen={showReactions}
            onClose={handleCloseReactionPopup}
            article_id={article_id}
          />
        )}

        <div className="flex items-center gap-12 text-neutral-70 text-xs mx-1">
          <div
            className="relative flex items-center gap-1 text-neutral-50 cursor-pointer"
            ref={repostRef}
          >
            <button
              onClick={handleRepostClick}
              className="flex hover:text-primary-500 items-center gap-1"
              disabled={isReposting}
            >
              {isReposting ? (
                <>
                  <LuLoader className="animate-spin inline-block mr-1" />{" "}
                  Reposting...
                </>
              ) : (
                <>
                  <Radio className="size-4" /> Repost
                </>
              )}
            </button>

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
                    className="py-2 text-s hover:text-primary-400 transition-colors w-full text-left"
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
            article_id={article_id}
            author_of_post={author_of_post}
          />

          <div
            className="flex items-center hover:text-primary-500 cursor-pointer"
            onClick={handleSavedArticle}
          >
            {!(isSavePending || isRemovePending) && (
              <Bookmark
                className={cn(
                  "size-4",
                  saved ? "fill-primary-500 text-primary-500" : ""
                )}
              />
            )}
            {(isSavePending || isRemovePending) && (
              <LuLoader className="animate-spin size-4" />
            )}
          </div>
        </div>

        {showSaveSignInPopup && (
          <SignInPopUp
            text={t("blog.SaveArticle")}
            position="below"
            onClose={() => setShowSaveSignInPopup(false)}
          />
        )}
      </div>

      {commentTabState && (
        <CommentSection
          article_id={article_id}
          setIsCommentSectionOpen={setCommentTabState}
          author_of_post={author_of_post}
          article={article}
        />
      )}
    </>
  );
};

export default BlogArticleReactionStats;
