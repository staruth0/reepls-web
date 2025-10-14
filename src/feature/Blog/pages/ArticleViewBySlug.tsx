import React, { useEffect, useRef, useState, useCallback } from "react";
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
import ReactionModal from "../components/BlogReactionModal";
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
import { useGetAllReactionsForTarget } from "../../Repost/hooks/useRepost";

// Start of reading progress implementation
import { useCreateReadingProgress, useGetReadingProgressByArticleId, useUpdateReadingProgress } from "../../ReadingProgress/hooks";
import { useReadingProgress } from "../../../hooks/useReadingProgress";
import ReadingProgressBar from "../../../components/atoms/ReadingProgressBar";
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
  const [showReactionsHoverPopup, setShowReactionsHoverPopup] = useState<boolean>(false);

  const articleUrl = `${window.location.origin}/posts/article/slug/${slug}`;
  const articleTitle = title || (content ? content.split(" ").slice(0, 10).join(" ") + "..." : "Untitled Article");

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
    console.log('readingProgress', readingProgress)
    if (readingProgress?.data) {
      setHasReadingProgress(true);
    } else {
      setHasReadingProgress(false);
    }
  }, [readingProgress?.data,readingProgress]);

  // Podcast fetch and audio controls only if article has podcast
  const { data: podcastData } = useGetPodcastById(article?.podcastId || "");
  const podcast = podcastData?.data;
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

  useEffect(()=>{
    console.log('article', article)
  },[article])

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
  useEffect(() => {
    const followedIds =
      followings?.data?.map((following: Follow) => following.followed_id?.id) || [];
    setIsFollowing(followedIds.includes(article?.author_id?._id || article?.author_id?.id));
  }, [followings, article?.author_id?._id]);

  const [isSaved, setIsSaved] = useState<boolean>(false);
  useEffect(() => {
    const isArticleSaved = savedArticles?.articles?.some(
      (a: Article) => a._id === article?._id
    );
    setIsSaved(isArticleSaved || false);
  }, [savedArticles, article?._id]);

  const handleFollowClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup("follow");
      return;
    }
    if (isFollowPending || isUnfollowPending || !article?.author_id?._id && !article?.author_id?.id) return;

    if (isFollowing) {
      unfollowUser(article.author_id?._id || article.author_id?.id || '', {
        onSuccess: () => {
          toast.success("User unfollowed successfully");
          setIsFollowing(false);
        },
        onError: () => toast.error("Failed to unfollow user"),
      });
    } else {
      followUser(article.author_id?._id || article.author_id?.id || '', {
        onSuccess: () => {
          toast.success("User followed successfully");
          setIsFollowing(true);
        },
        onError: () => toast.error("Failed to follow user"),
      });
    }
  };

  const handleSaveClick = () => {
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
        onError: () => toast.error("Failed to remove article"),
      });
    } else {
      saveArticle(article._id, {
        onSuccess: () => {
          toast.success("Article saved successfully");
          setIsSaved(true);
        },
        onError: () => toast.error("Failed to save article"),
      });
    }
  };

  const handleGoBack = () => {
    if (!isLoggedIn) {
      // For non-signed in users, navigate to feed
      navigate('/feed', { replace: true });
    } else {
      // For signed in users, use browser back
      navigate(-1);
    }
  };

  const handleShareClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup("share");
      return;
    }
    setShowSharePopup(true);
  };

  const handleCommentClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup("comment");
      return;
    }
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleRepostCommentaryClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup("repost");
      return;
    }
    setShowRepostsSidebar(true);
  };

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
      console.log('article by slug', article)
      console.log('article.htmlContent:', article.htmlContent)
      console.log('article.content:', article.content)
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
  }, [article, isPending]);

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

  const getFollowStatusText = () => {
    if (!isLoggedIn) return "Follow";
    if (isFollowPending) return "Following...";
    if (isUnfollowPending) return "Unfollowing...";
    return isFollowing ? "Following" : "Follow";
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="max-w-[800px] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-56 flex-grow">
        {!isPreview && isPending ? (
          <div className="w-full mt-10 flex flex-col justify-center items-center">
            <ArticleViewSkeleton />
          </div>
        ) : (
          <div className="w-full mx-auto mt-10 flex flex-col justify-center items-start">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-neutral-100 md:hidden hover:text-neutral-200 mb-6"
            >
              <ArrowLeft className="size-5" />
              <span>Back</span>
            </button>
            {isPreview && (
              <div className="mb-4">
                <span className="text-sm font-semibold px-4 py-1 bg-foreground text-primary-500 rounded-full flex gap-2 items-center">
                  <FilePen className="size-4" />
                  Draft
                </span>
              </div>
            )}

            <h1 className="text-[26px] md:text-4xl lg:text-5xl font-semibold leading-normal lg:leading-tight mb-2">
              {title}
            </h1>
            {subtitle && <h3 className="text-xl my-4">{subtitle}</h3>}

            {article?.thumbnail && (
              <div className="my-6 w-full max-w-full mx-auto">
                <img
                  src={article.thumbnail}
                  alt={`Thumbnail for ${title}`}
                  className="w-full h-auto rounded-lg object-cover max-h-[500px]"
                />
              </div>
            )}

            {/* Author Profile Section */}
            <div className="w-full flex my-4 items-center justify-between gap-4 mt-8 mb-4">
              <div className="flex gap-2">
                {article?.author_id?.profile_picture ? (
                  <img
                    src={article.author_id.profile_picture}
                    alt={article.author_id.username || "Author"}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                ) : (
                  <div className="rounded-full w-10 h-10 bg-purple-500 flex items-center justify-center text-white font-bold">
                    {article?.author_id?.username?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[16px]">
                    {article?.author_id?.username || "Unknown"}
                  </p>
                  <p className="text-sm text-neutral-100">{article?.author_id?.bio}</p>
                </div>
              </div>
              {!isPreview && (
                <button
                  onClick={handleFollowClick}
                  className={`ml-auto px-4 py-2 rounded-full text-sm ${
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
            {article && (
              <span className="text-sm text-neutral-100">
                {calculateReadTime(article.content!, article.media || [])} mins Read
              </span>
            )}

            {/* Podcast player or regular audio controls */}
            <div className="my-6 w-full">
              {article?.hasPodcast && podcast ? (
                // Podcast player UI
                <div className="flex items-center gap-4 my-6 p-4 bg-neutral-800 rounded-lg">
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-main-green hover:bg-green-600 flex-shrink-0"
                    aria-label={currentTrack?.id === podcast?.id && isPlaying ? "Pause podcast" : "Play podcast"}
                  >
                    {currentTrack?.id === podcast?.id && isPlaying ? (
                      <LuPause size={20} />
                    ) : (
                      <LuPlay size={20} />
                    )}
                  </button>

                  <div className="flex-grow w-full">
                    <AudioWave isPlaying={currentTrack?.id === podcast?.id && isPlaying} />
                  </div>

                  <span className="text-sm text-neutral-400">{podcast?.duration || "0:00"}</span>
                </div>
              ) : (
                // Default article audio controls
                <ArticleAudioControls article={article} />
              )}
            </div>

            {/* Reading Progress Indicator */}
            {!isPreview && isLoggedIn && isTracking && (
              <div className="w-full mb-4">
                <ReadingProgressBar 
                  progress={readingProgressData} 
                  showDetails={true}
                  className="bg-neutral-800 p-3 rounded-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div id="article-content" className="w-full mb-5">
              <TipTapRichTextEditor
                initialContent={htmlArticleContent}
                editorRef={editorRef}
                disabled={true}
                hideToolbar={true}
                hideBubble={true}
                className="w-full block"
              />
            </div>

            {/* Article Stats */}
            {!isPreview && !isPending && (
              <div className="text-neutral-100 text-md mb-5">{timeAgo(article?.createdAt)}</div>
            )}

            {/* Comments Section */}
            {!isPreview && !isPending && (
              <div ref={commentSectionRef} className="w-full mx-auto mt-10">
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
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
              >
                <ThumbsUp size={20} />
              </button>

              {showReactionsHoverPopup && isLoggedIn && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowReactionsHoverPopup(false)} />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[999] rounded-lg p-2 min-w-[200px]">
                    <div className="relative z-">
                      <ReactionModal article_id={article?._id || ""} />
                    </div>
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
          url={articleUrl} 
          title={articleTitle} 
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
  );
};

export default ArticleViewBySlug;
