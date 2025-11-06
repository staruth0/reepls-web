import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Bookmark,
  FilePen,
  MessageSquare,
  Share2,
  ThumbsUp,
  ArrowLeft,
  Repeat2,
} from "lucide-react";
import { toast } from "react-toastify";
import { Editor } from "reactjs-tiptap-editor";
import SharePopup from "../../../components/molecules/share/SharePopup";
import { PREVIEW_SLUG } from "../../../constants";
import { useUser } from "../../../hooks/useUser";
import { Article, Follow, MediaItem, User } from "../../../models/datamodels";
import { timeAgo } from "../../../utils/dateFormater";
import SignInPopUp from "../../AnonymousUser/components/SignInPopUp";
import { useFollowUser, useGetFollowing, useUnfollowUser} from "../../Follow/hooks";
import {
  useGetSavedArticles,
  useRemoveSavedArticle,
  useSaveArticle,
  useUpdateReadingHistory,
} from "../../Saved/hooks";
import ReactionModal from "../../Interactions/components/ReactionModal";
import TipTapRichTextEditor from "../components/TipTapRichTextEditor";
import {
  useGetArticleById,
  useGetArticleBySlug,
} from "../hooks/useArticleHook";
import useDraft from "../hooks/useDraft";
import "../styles/view.scss";
import ArticleViewSkeleton from "./ArticleViewSkeleton";
import CommentSection from "../../Comments/components/CommentSection";
import ReactionsPopup from "../../Interactions/components/ReactionsPopup";
import { calculateReadTime } from "../../../utils/articles";
import RepostsCommentarySidebar from "../components/RepostCommentaries";

import { useAudioControls } from "../../../hooks/useMediaPlayer";
import { LuPlay, LuPause } from "react-icons/lu";

import { ArticleAudioControls } from "../../../components/atoms/ReadALoud/ArticleAudioControls";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPodcastById } from "../../Podcast/hooks";
import AudioWave from "../../../components/molecules/Audio/AudiWave";
import ErrorBoundary from "../../../components/atoms/ErrorBoundary";
import { useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";
import { useQueryClient } from "@tanstack/react-query";

// Start of reading progress implementation
import { useCreateReadingProgress, useGetReadingProgressByArticleId, useUpdateReadingProgress } from "../../ReadingProgress/hooks";
import { useReadingProgress } from "../../../hooks/useReadingProgress";
import { estimateArticleReadTime } from "../../../utils/readingProgressCalculator";
// reading progress implementation

const ArticleViewBySlug: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid, id, slug } = useParams();
  const { authUser, isLoggedIn } = useUser();
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState<string>("This article does not have a title");
  const [subtitle, setSubtitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>(
    "*This article does not have any content*"
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setMedia] = useState<MediaItem[]>([]);
  const [isPreview] = useState<boolean>(articleUid === PREVIEW_SLUG);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false);
  const [showSignInPopup, setShowSignInPopup] = useState<string | null>(null);
  const [showReactionsPopup, setShowReactionsPopup] = useState<boolean>(false);
  const [showRepostsSidebar, setShowRepostsSidebar] = useState<boolean>(false);

  const { loadDraftArticle } = useDraft();
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } = useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { data: followings } = useGetFollowing(authUser?.id || "");
  const { data: articleslug, isError, isPending } = useGetArticleBySlug(slug!);
  const { data: articleid } = useGetArticleById(id!);

  const article = slug ? articleslug : articleid;
 const { data: allReactions } = useGetAllReactionsForTarget("Article", article?._id);
 const reactionCount = allReactions?.data?.totalReactions || 0;
 
 // State for tracking user's reaction
 const [userReaction, setUserReaction] = useState<string | null>(null);
 
 // See if current user has reacted
 const currentUserId = authUser?.id;
 const hasUserReacted = useMemo(() => {
   if (!currentUserId) return false;
   // Check if user has any reaction (check both userReaction state and API data)
   if (userReaction) return true;
   return Boolean(allReactions?.data?.reactions?.some((r: any) => r.user_id === currentUserId));
 }, [currentUserId, allReactions?.data?.reactions, userReaction]);

  // Memoized values to prevent unnecessary recalculations
  const memoizedArticleUrl = useMemo(() => 
    `${window.location.origin}/posts/article/slug/${slug}`, 
    [slug]
  );
  
  const memoizedArticleTitle = useMemo(() => 
    title || (content ? content.split(" ").slice(0, 10).join(" ") + "..." : "Untitled Article"),
    [title, content]
  );

  const memoizedReadTime = useMemo(() => 
    article ? calculateReadTime(article.content!, article.media || []) : 0,
    [article?.content, article?.media]
  );

  const memoizedTimeAgo = useMemo(() => 
    article?.createdAt ? timeAgo(article.createdAt) : "",
    [article?.createdAt]
  );

  const memoizedAuthorName = useMemo(() => 
    article?.author_id?.name || article?.author_id?.username || "Unknown",
    [article?.author_id?.name, article?.author_id?.username]
  );

  const memoizedAuthorBio = useMemo(() => 
    article?.author_id?.bio || "",
    [article?.author_id?.bio]
  );

  const memoizedAuthorInitial = useMemo(() => 
    memoizedAuthorName.charAt(0) || "A",
    [memoizedAuthorName]
  );
  const [showReactionsHoverPopup, setShowReactionsHoverPopup] = useState<boolean>(false);

  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(true);
  const { mutate } = useUpdateReadingHistory();

  // reading progress implementation
  const [hasReadingProgress, setHasReadingProgress] = useState<boolean>(false);
  const [isProgressSaving, setIsProgressSaving] = useState<boolean>(false);
  const { mutate: createReadingProgress } = useCreateReadingProgress();
  const { mutate: updateReadingProgress } = useUpdateReadingProgress();
  const { data: readingProgress } = useGetReadingProgressByArticleId(article?._id || "");
  
  // New reading progress hook
  const {
    progress: readingProgressData,
    isTracking,
    startTracking,
    stopTracking
  } = useReadingProgress({
    articleId: article?._id || "",
    content: content || "",
    isLoggedIn: !!isLoggedIn,
    isPreview: isPreview,
    onProgressChange: (progress) => {
      console.log('Reading progress updated:', progress);
    }
  });
  
  // Initialize hasReadingProgress when data loads
  useEffect(() => {
    if (readingProgress?.data) {
      setHasReadingProgress(true);
    } else {
      setHasReadingProgress(false);
    }
  }, [readingProgress?.data]);

  // Podcast fetch and audio controls only if article has podcast
  const { data: podcastData } = useGetPodcastById(article?.podcastId || "");
  const podcast = podcastData?.data;
  
  // Format duration helper function
  const formatDuration = useCallback((seconds?: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);
  
  // Memoized podcast duration
  const memoizedPodcastDuration = useMemo(() => 
    formatDuration(podcast?.audio?.duration),
    [podcast?.audio?.duration, formatDuration]
  );
  
  const {
    isPlaying,
    togglePlay,
    currentTrack,
  } = useAudioControls(
    podcast
      ? {
          id: podcast.id,
          title: podcast.title,
          url: podcast.audio.url,
          thumbnail: podcast.thumbnailUrl,
          author: podcast.author?.name,
        }
      : undefined
  );

  // Removed console.log for production performance

  // reading progress implementation
  // Start tracking when article loads
  useEffect(() => {
    if (article && !isPreview && !isPending && isLoggedIn) {
      startTracking();
    } else {
      stopTracking();
    }
  }, [article, isPreview, isPending, isLoggedIn, startTracking, stopTracking]);

  // Helper function to save reading progress with new calculation
  const saveReadingProgress = useCallback((isUnload: boolean = false) => {
    if (!article?._id || !isLoggedIn || isPreview || isProgressSaving || !isTracking) {
      return;
    }

    setIsProgressSaving(true);
    
    // Use the new progress calculation
    const progressData = {
      read_time: Math.floor(readingProgressData.timeRatio * estimateArticleReadTime(content || "")),
      scroll_length: readingProgressData.scrollRatio * 100, // Convert to percentage for API
    };

    const onSuccess = () => {
      setHasReadingProgress(true);
      setIsProgressSaving(false);
    };

    const onError = (error: Error) => {
      console.error('Error saving reading progress:', error);
      setIsProgressSaving(false);
      if (!isUnload) {
        toast.error("Failed to save reading progress");
      }
    };

    if (hasReadingProgress) {
      updateReadingProgress({
        articleId: article._id,
        readingProgress: progressData
      }, {
        onSuccess,
        onError,
      });
    } else {
      createReadingProgress({
        article_id: article._id,
        read_time: progressData.read_time,
        scroll_length: progressData.scroll_length,
      }, {
        onSuccess,
        onError,
      });
    }
  }, [article?._id, isLoggedIn, isPreview, isProgressSaving, isTracking, readingProgressData, content, hasReadingProgress, updateReadingProgress, createReadingProgress]);

  // Save reading progress when component unmounts or user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveReadingProgress(true); // Pass true to suppress error toast on unload
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Also save when component unmounts
      handleBeforeUnload();
    };
  }, [saveReadingProgress]);

  // Periodic save of reading progress (every 30 seconds)
  useEffect(() => {
    if (!isTracking || !article?._id || !isLoggedIn || isPreview) return;

    const interval = setInterval(() => {
      saveReadingProgress(false); // Allow error toasts during periodic saves
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [isTracking, article?._id, isLoggedIn, isPreview, saveReadingProgress]);
  // End of reading progress implementation

  useEffect(() => {
    if (slug) {
      mutate(slug, {
        onError: () => {
          return;
        },
      });
    }
  }, [slug, mutate]);

  const toggleCommentSection2 = () => {
    setIsCommentSectionOpen(true);
  };

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  
  // Memoize followed IDs to prevent unnecessary recalculations
  const followedIds = useMemo(() => 
    followings?.data?.map((following: Follow) => following.followed_id?.id) || [],
    [followings?.data]
  );
  
  const authorId = useMemo(() => 
    article?.author_id?._id || article?.author_id?.id,
    [article?.author_id?._id, article?.author_id?.id]
  );
  
  useEffect(() => {
    setIsFollowing(followedIds.includes(authorId));
  }, [followedIds, authorId]);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  
  // Memoize saved article check
  const isArticleSaved = useMemo(() => 
    savedArticles?.articles?.some((a: Article) => a._id === article?._id) || false,
    [savedArticles?.articles, article?._id]
  );
  
  useEffect(() => {
    setIsSaved(isArticleSaved);
  }, [isArticleSaved]);

  const handleFollowClick = useCallback(() => {
    if (!isLoggedIn) {
      setShowSignInPopup("follow");
      return;
    }
    if (isFollowPending || isUnfollowPending || !authorId) return;

    if (isFollowing) {
      unfollowUser(authorId, {
        onSuccess: () => {
          toast.success("User unfollowed successfully");
          setIsFollowing(false);
        },
      });
    } else {
      followUser(authorId, {
        onSuccess: () => {
          toast.success("User followed successfully");
          setIsFollowing(true);
        },
      });
    }
  }, [isLoggedIn, isFollowPending, isUnfollowPending, authorId, isFollowing, unfollowUser, followUser]);

  const handleSaveClick = useCallback(() => {
    if (!isLoggedIn) {
      setShowSignInPopup("save");
      return;
    }
    if (isSavePending || isRemovePending || !article?._id) return;

    if (isSaved) {
      removeSavedArticle(article._id, {
        onSuccess: () => {
          toast.success("Article removed from saved");
          setIsSaved(false);
        },
      });
    } else {
      saveArticle(article._id, {
        onSuccess: () => {
          toast.success("Article saved successfully");
          setIsSaved(true);
        },
      });
    }
  }, [isLoggedIn, isSavePending, isRemovePending, article?._id, isSaved, removeSavedArticle, saveArticle]);

  const handleGoBack = useCallback(() => {
    if (!isLoggedIn) {
      // For non-signed in users, navigate to feed
      navigate('/feed', { replace: true });
    } else {
      // For signed in users, use browser back
      navigate(-1);
    }
  }, [isLoggedIn, navigate]);

  const handleShareClick = useCallback(() => {
    if (!isLoggedIn) {
      setShowSignInPopup("share");
      return;
    }
    setShowSharePopup(true);
  }, [isLoggedIn]);

  const handleCommentClick = useCallback(() => {
    if (!isLoggedIn) {
      setShowSignInPopup("comment");
      return;
    }
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isLoggedIn]);

  const handleRepostCommentaryClick = useCallback(() => {
    if (!isLoggedIn) {
      setShowSignInPopup("repost");
      return;
    }
    setShowRepostsSidebar(true);
  }, [isLoggedIn]);

  useEffect(() => {
    if (articleUid === PREVIEW_SLUG) {
      const draftArticle = loadDraftArticle();
      if (!draftArticle) {
        toast.error("No draft article found.");
        navigate("/posts/create");
        return;
      }
      setTitle(draftArticle.title);
      setSubtitle(draftArticle.subtitle);
      setContent(draftArticle.content);
      setHtmlArticleContent(draftArticle.htmlContent);
      setMedia(draftArticle.media);
    }
  }, [articleUid, loadDraftArticle, navigate]);

  useEffect(() => {
    if (article) {
      // Removed console.logs for production performance
      if (article.title) setTitle(article.title);
      if (article.subtitle) setSubtitle(article.subtitle);
      if (article.content) setContent(article.content);
      if (article.htmlContent) {
        setHtmlArticleContent(article.htmlContent);
      } else if (article.content) {
        // Fallback: if htmlContent is missing, use content as HTML
        setHtmlArticleContent(article.content);
      }
    }
  }, [article?.title, article?.subtitle, article?.content, article?.htmlContent]);

  useEffect(() => {
    if (isError) {
      console.error('Error fetching article:', isError);
      toast.error("Error fetching article.");
      navigate("/posts/create");
    }
  }, [isError, navigate]);

  useEffect(() => {
    if (editorRef.current?.editor) {
      setTimeout(() => {
        editorRef?.current?.editor?.commands.setContent(htmlArticleContent);
      }, 0);
    }
  }, [htmlArticleContent]);

  const getFollowStatusText = useCallback(() => {
    if (!isLoggedIn) return "Follow";
    if (isFollowPending) return "Following...";
    if (isUnfollowPending) return "Unfollowing...";
    return isFollowing ? "Following" : "Follow";
  }, [isLoggedIn, isFollowPending, isUnfollowPending, isFollowing]);

  const queryClient = useQueryClient();
  
  // Reaction handler for when reaction is completed from modal
  const handleReactionComplete = useCallback((reaction: string) => {
    setUserReaction(reaction);
    // Invalidate reactions query to refresh the count
    if (article?._id) {
      queryClient.invalidateQueries({ queryKey: ['all-reactions-for-target', 'Article', article._id] });
    }
  }, [queryClient, article?._id]);

  // Handle click on reaction button to show modal
  const handleArticleReact = useCallback(() => {
    if (!isLoggedIn) {
      setShowSignInPopup("react");
      return;
    }
    setShowReactionsHoverPopup(true);
  }, [isLoggedIn]);

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        console.error('ArticleViewBySlug Error:', error, errorInfo);
      }}
    >
      <div className="flex flex-col min-h-screen relative">
      <style>{`
        /* Ensure Georgia font throughout article view */
        .article-view-content {
          font-family: Georgia, serif !important;
        }
        .article-view-content h1,
        .article-view-content h2,
        .article-view-content h3,
        .article-view-content h4,
        .article-view-content h5,
        .article-view-content h6 {
          font-family: Georgia, serif !important;
        }
      
        .article-view-content div {
          font-family: Georgia, serif !important;
        }
        .article-view-content span {
          font-family: Georgia, serif !important;
        }
        /* Override any inherited fonts */
        #article-content * {
          font-family: Georgia, serif !important;
          font-size:16px;
          text-align:justify;
        }
      `}</style>
      <div className="max-w-[750px] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-32 flex-grow article-view-content">
        {!isPreview && isPending ? (
          <div className="w-full mt-6 flex flex-col justify-center items-center">
            <ArticleViewSkeleton />
          </div>
        ) : (
          <div className="w-full mx-auto mt-6 flex flex-col justify-center items-start">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-neutral-300 md:hidden hover:text-neutral-200 mb-4"
            >
              <ArrowLeft className="size-4" />
              <span className="text-sm">Back</span>
            </button>
            {isPreview && (
              <div className="mb-3">
                <span className="text-xs font-medium px-3 py-1 bg-foreground text-primary-500 rounded-full flex gap-1 items-center">
                  <FilePen className="size-3" />
                  Draft
                </span>
              </div>
            )}

            <h1 className="text-[22px] md:text-2xl lg:text-3xl font-bold leading-tight mb-3">
              {title}
            </h1>
            {subtitle && <h3 className="text-lg text-neutral-300 mb-4">{subtitle}</h3>}

            {article?.thumbnail && (
              <div className="my-4 w-full max-w-full mx-auto">
                <img
                  src={article.thumbnail}
                  alt={`Thumbnail for ${title}`}
                  className="w-full h-auto rounded-lg object-cover max-h-[400px]"
                />
              </div>
            )}

            {/* Author Profile Section */}
            <div className="w-full flex my-3 items-center justify-between gap-3 mt-6 mb-3">
              <div className="flex gap-2">
                {article?.author_id?.profile_picture ? (
                  <img
                    src={article.author_id.profile_picture}
                    alt={article.author_id.name || article.author_id.username || "Author"}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                ) : (
                  <div className="rounded-full w-8 h-8 bg-purple-500 flex items-center justify-center text-white font-medium text-[16px]">
                    {memoizedAuthorInitial}
                  </div>
                )}
                <div>
                  <p className="font-medium text-[16px]">
                    {memoizedAuthorName}
                  </p>
                  <p className="text-[12px] text-neutral-100">{memoizedAuthorBio}</p>
                </div>
              </div>
              {!isPreview && authUser?.id !== authorId && (
                <button
                  onClick={handleFollowClick}
                  className={`ml-auto px-3 py-1.5 rounded-full text-xs ${
                    isFollowing
                      ? "bg-neutral-600 text-neutral-50 hover:bg-neutral-700"
                      : "bg-main-green text-white hover:bg-primary-500"
                  }`}
                  disabled={!isLoggedIn || isFollowPending || isUnfollowPending}
                >
                  {getFollowStatusText()}
                </button>
              )}
            </div>
            
            {/* Read time and article stats */}
            <div className="flex items-center gap-3 mb-3">
              {article && (
                <span className="text-[14px] text-neutral-200">
                  {memoizedReadTime} mins Read
                </span>
              )}
              {!isPreview && !isPending && (
                <span className="text-[14px] text-neutral-200">•</span>
              )}
              {!isPreview && !isPending && (
                <span className="text-[14px] text-neutral-200">{memoizedTimeAgo}</span>
              )}
            </div>

            {/* Podcast player or regular audio controls */}
            <div className="my-4 w-full">
              {article?.hasPodcast && podcast ? (
                // Podcast player UI
                <div className="flex items-center gap-2 sm:gap-3 my-4 p-3 bg-neutral-800 rounded-lg">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-full bg-main-green hover:bg-green-600 flex-shrink-0"
                    aria-label={currentTrack?.id === podcast?.id && isPlaying ? "Pause podcast" : "Play podcast"}
                  >
                    {currentTrack?.id === podcast?.id && isPlaying ? (
                      <LuPause size={16} />
                    ) : (
                      <LuPlay size={16} />
                    )}
                  </button>

                  <div className="flex-grow min-w-0 overflow-hidden">
                    <AudioWave isPlaying={currentTrack?.id === podcast?.id && isPlaying} />
                  </div>

                  <span className="text-xs text-neutral-400 flex-shrink-0">{memoizedPodcastDuration}</span>
                </div>
              ) : !isPreview && article ? (
                // Show TTS controls if article exists and not a preview
                // ArticleAudioControls can generate TTS on demand even if text_to_speech doesn't exist yet
                <ArticleAudioControls article={article} />
              ) : null}
            </div>

            {/* Article Content */}
            <div id="article-content" className="w-full mb-4">
              <TipTapRichTextEditor
                initialContent={htmlArticleContent}
                editorRef={editorRef}
                disabled={true}
                hideToolbar={true}
                hideBubble={true}
                className="w-full block"
              />
            </div>

            {/* Comments Section */}
            {!isPreview && !isPending && (
              <div ref={commentSectionRef} className="w-full mx-auto mt-8">
                <h2 className="text-lg font-medium mb-3">Comments</h2>
                {isCommentSectionOpen && (
                  <CommentSection
                    article_id={article?._id || ""}
                    article={article}
                    setIsCommentSectionOpen={toggleCommentSection2}
                    author_of_post={article?.author_id as User}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {!isPreview && !isPending && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-800 rounded-full shadow-lg p-2 flex gap-4 items-center justify-center md:bottom-6">
          {/* Reactions Button with Hover Popup */}
          <div className="flex items-center">
            <div
              className="relative group"
              onMouseEnter={() => isLoggedIn && setShowReactionsHoverPopup(true)}
              onMouseLeave={() => setShowReactionsHoverPopup(false)}
            >
              <button
                className={`p-2 rounded-full flex items-center ${
                  isLoggedIn ? "text-neutral-50 hover:bg-neutral-700" : "text-neutral-500 cursor-not-allowed"
                }`}
                title="React"
                aria-label="React to article"
                onClick={handleArticleReact}
              >
                <ThumbsUp size={20} className={hasUserReacted ? "text-primary-400" : ""} />
              </button>
              {showReactionsHoverPopup && isLoggedIn && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowReactionsHoverPopup(false)} />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-14 z-[999]">
                    <ReactionModal
                      isOpen={showReactionsHoverPopup}
                      onClose={() => setShowReactionsHoverPopup(false)}
                      onReact={handleReactionComplete}
                      article_id={article?._id || ""}
                      article={article}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="relative">
              <span
                className="ml-1 text-sm hover:underline cursor-pointer"
                onClick={() => reactionCount > 0 && setShowReactionsPopup(true)}
              >
                {reactionCount}
              </span>
              {/* Reactions Popup positioned relative to reaction count */}
              {showReactionsPopup && reactionCount > 0 && (
                <ReactionsPopup
                  isOpen={showReactionsPopup}
                  onClose={() => setShowReactionsPopup(false)}
                  article_id={article?._id || ""}
                  article={article}
                  position={{ top: -200, right: 0 }}
                />
              )}
            </div>
          </div>

          <button
            onClick={handleCommentClick}
            className={`p-2 rounded-full ${
              isLoggedIn ? "hover:bg-neutral-700 text-neutral-50" : "text-neutral-500 cursor-not-allowed"
            }`}
            title="Comment"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-full ${
              isLoggedIn ? "hover:bg-neutral-700 text-neutral-50" : "text-neutral-500 cursor-not-allowed"
            }`}
            title={isSaved ? "Unsave" : "Save"}
          >
            <Bookmark size={20} className={isSaved && isLoggedIn ? "fill-current" : ""} />
          </button>
          <button
            onClick={handleShareClick}
            className={`p-2 rounded-full ${
              isLoggedIn ? "hover:bg-neutral-700 text-neutral-50" : "text-neutral-500 cursor-not-allowed"
            }`}
            title="Share"
          >
            <Share2 size={20} />
          </button>
          {/* New Repost Commentary Button */}
          <button
            onClick={handleRepostCommentaryClick}
            className={`p-2 rounded-full ${
              isLoggedIn ? "hover:bg-neutral-700 text-neutral-50" : "text-neutral-500 cursor-not-allowed"
            }`}
            title="View Repost Commentaries"
          >
            <Repeat2 size={20} />
          </button>
        </div>
      )}

      {/* Popups */}
      {showSharePopup && (
        <SharePopup 
          url={memoizedArticleUrl} 
          title={memoizedArticleTitle} 
          subtitle={article?.subtitle}
          thumbnail={article?.thumbnail}
          description={article?.subtitle || article?.content?.substring(0, 160) + "..."}
          onClose={() => setShowSharePopup(false)} 
        />
      )}
      {showSignInPopup && (
        <SignInPopUp text={showSignInPopup} position="above" onClose={() => setShowSignInPopup(null)} />
      )}

      {/* Reposts Commentary Sidebar */}
      <RepostsCommentarySidebar
        isOpen={showRepostsSidebar}
        onClose={() => setShowRepostsSidebar(false)}
        articleId={article?._id || ""}
      />
      </div>
    </ErrorBoundary>
  );
};

export default ArticleViewBySlug;
