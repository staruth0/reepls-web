import React, { useState, useEffect, useRef } from "react";
import {
  PenLine,
  ThumbsUp,
  Bookmark,
  Radio,
  MessageCircle,
} from "lucide-react";
// Removed useQueryClient import as it's no longer directly used in this component's logic
// import { useQueryClient } from "@tanstack/react-query";
import { useGetCommentsByArticleId } from "../../../Comments/hooks";
import ReactionsPopup from "../../../Interactions/components/ReactionsPopup";
import ReactionModal from "../../../Interactions/components/ReactionModal";

import { t } from "i18next";
import { Article, ReactionReceived, User } from "../../../../models/datamodels";
import { motion } from "framer-motion";
import { cn } from "../../../../utils";
import { useUser } from "../../../../hooks/useUser";
import SignInPopUp from "../../../AnonymousUser/components/SignInPopUp";
import CommentSection from "../../../Comments/components/CommentSection";
import BlogRepostModal from "./BlogRepostModal";
import { useGetAllReactionsForTarget, useRepostArticle } from "../../../Repost/hooks/useRepost";
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
  // Removed useQueryClient from here as its direct usage for cache manipulation is now in the hooks
  // const queryClient = useQueryClient();

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


  const totalComments = articleComments?.pages?.[0]?.data?.totalComments;




const target_type = article.type === "Repost" ? "Repost" : "Article";
const target_id = article.type === "Repost" && article.repost?.repost_id ? article.repost?.repost_id : article_id;

const { data: allReactions, isLoading: reactionsLoading } = useGetAllReactionsForTarget(
  target_type ,
  target_id,
);

  const reactionCount = allReactions?.data?.totalReactions || 0;

useEffect(() => {
 

  if (isLoggedIn && authUser?.id && allReactions?.data?.reactions) {
    const userReact = allReactions.data.reactions.find(
      (r: ReactionReceived) => r.user_id === authUser.id
    );
    setUserReaction(userReact?.type || null);
  }
}, [isLoggedIn, authUser, allReactions]);

  // This useEffect is crucial. It will automatically update the `saved` state
  // whenever `savedArticles` (the React Query cache data) changes,
  // which includes changes from our optimistic updates and subsequent refetches.
  useEffect(() => {
    // Check if `savedArticles` data is available and if the current article_id exists within it.
    // Assuming `savedArticles.articles` is an array where each item has an `article` object with an `_id`.
    const isSaved = savedArticles?.articles?.some(
      (item: { article?: { _id: string } }) => item?.article?._id === article_id
    );
    setSaved(isSaved);
  }, [savedArticles, article_id]); 



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
    // Prevent multiple rapid clicks while a save/remove operation is ongoing
    if (isSavePending || isRemovePending) return;

    if (saved) {
      // If currently saved, call the remove mutation
      removeSavedArticle(article_id, {
        // onSuccess: () => {
        //   // Success toast is shown here for immediate user feedback
        //   toast.success(t("blog.alerts.articleRemoved"));
        //   // No need to setSaved(false) here. The optimistic update in the hook
        //   // already changed the cache, and the useEffect will react to it.
        //   // The invalidateQueries in the hook's onSuccess will ensure final consistency.
        // },
        onError: () => {
          // Error toast is shown here. The hook's onError will handle the rollback.
          toast.error(t("blog.alerts.articleRemoveFailed"));
          // No need to setSaved(true) here for rollback. The hook's onError
          // already reverted the cache, and the useEffect will react to it.
        },
      });
    } else {
      // If not saved, call the save mutation
      saveArticle(article_id, {
        // onSuccess: () => {
        //   // Success toast for immediate feedback
        //   toast.success(t("blog.alerts.articleSaved"));
        //   // No need to setSaved(true) here. Optimistic update in hook + useEffect handles it.
        // },
        onError: () => {
          // Error toast for immediate feedback. Hook's onError handles rollback.
          toast.error(t("blog.alerts.articleSaveFailed"));
          // No need to setSaved(false) here for rollback.
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
                "absolute top-0 left-12 w-64 p-4 rounded-lg shadow-lg bg-background z-[900000]",
                ""

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
                <MessageCircle className="size-4" />
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
            article={article}
           

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
            article={article}
          />

          <div
            className="flex items-center hover:text-primary-500 cursor-pointer"
            onClick={handleSavedArticle}
            // Optional: Disable the button while pending to prevent rapid multiple clicks
            // disabled={isSavePending || isRemovePending}
          >
            {/* This is the key change for optimistic update display.
              We primarily rely on the `saved` state for the icon's appearance (filled or not).
              The loader `LuLoader` should only be a very brief indicator, or even omitted
              if the optimistic update is truly instantaneous.
              
              If the `saved` state changes immediately due to the optimistic cache update,
              the icon will flip instantly.
            */}
            <Bookmark
              className={cn(
                "size-4",
                saved ? "fill-primary-500 text-primary-500" : "", // Icon color determined by 'saved' state
                (isSavePending || isRemovePending) ? "opacity-50" : "" // Optional: Dim icon slightly while pending
              )}
            />
            {/* If you still want a loading spinner, consider it as an overlay 
              or a very small indicator next to the icon, not replacing it,
              as the icon itself reflects the immediate optimistic state.
              
              For now, I'll remove the explicit LuLoader in favor of the icon changing state.
              If the `isPending` still takes too long, it indicates the `useEffect`
              is not reacting fast enough to the `queryClient.setQueryData`
              or your network is very fast, making the pending state noticeable anyway.
            */}
            {/* // If you still want a loader, make it less intrusive or only for very long ops:
              {(isSavePending || isRemovePending) && (
                <LuLoader className="animate-spin size-3 ml-1" /> 
              )}
            */}
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