import React, { useEffect, useRef, useState, useContext } from 'react';
import { FilePen, Volume2, Bookmark, Share2, PauseCircle, PlayCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Editor } from 'reactjs-tiptap-editor';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { PREVIEW_SLUG } from '../../../constants';
import { Article, Follow, User } from '../../../models/datamodels';
import { useSaveArticle, useRemoveSavedArticle, useGetSavedArticles } from '../../Saved/hooks';
import { useFollowUser, useUnfollowUser, useGetFollowing } from '../../Follow/hooks';
import { VoiceLanguageContext } from '../../../context/VoiceLanguageContext/VoiceLanguageContext';
import { useUser } from '../../../hooks/useUser';
import CreatePostTopBar from '../components/CreatePostTopBar';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import { useCreateArticle, useGetArticleBySlug } from '../hooks/useArticleHook';
import { useGetArticleReactions } from '../../Interactions/hooks';
import useDraft from '../hooks/useDraft';
import '../styles/view.scss';
import ArticleViewSkeleton from './ArticleViewSkeleton';
import { profileAvatar } from '../../../assets/icons';
import { timeAgo } from '../../../utils/dateFormater';
import CommentSection from '../components/BlogCommentSection';
import SharePopup from '../../../components/molecules/share/SharePopup';
import SignInPopUp from '../../AnonymousUser/components/SignInPopUp';
import ReactionModal from '../components/BlogReactionModal';
import ReactionsPopup from '../../Interactions/components/ReactionsPopup';

const ArticleViewBySlug: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid, slug } = useParams();
  const { authUser, isLoggedIn } = useUser();
  const { selectedVoice } = useContext(VoiceLanguageContext);
  const [title, setTitle] = useState<string>('*This article does not have a title*');
  const [subTitle, setSubTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('*This article does not have any content*');
  const [media, setMedia] = useState<string[]>([]);
  const [isPreview] = useState<boolean>(articleUid === PREVIEW_SLUG);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isPendingSpeech, setIsPendingSpeech] = useState<boolean>(false);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false);
  const [showSignInPopup, setShowSignInPopup] = useState<boolean>(false);
  const [showReactionsPopup, setShowReactionsPopup] = useState<boolean>(false);

  const { loadDraftArticle, clearDraftArticle } = useDraft();
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const { mutate: createArticle } = useCreateArticle();
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } = useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { data: followings } = useGetFollowing(authUser?.id || '');
  const { data: article, isError, isPending } = useGetArticleBySlug(slug!);
  const { data: allReactions } = useGetArticleReactions(article?._id || '');

  const synth = window.speechSynthesis;
  const articleUrl = `${window.location.origin}/posts/article/${articleUid}`;
  const articleTitle = title || content.split(" ").slice(0, 10).join(" ") + "...";

  // Follow/Unfollow State Management
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  useEffect(() => {
    const followedIds = followings?.data?.map((following: Follow) => following.followed_id?.id) || [];
    setIsFollowing(followedIds.includes(article?.author_id?._id));
  }, [followings, article?.author_id?._id]);

  // Saved State Management
  const [isSaved, setIsSaved] = useState<boolean>(false);
  useEffect(() => {
    const isArticleSaved = savedArticles?.articles?.some((a: Article) => a._id === article?._id);
    setIsSaved(isArticleSaved || false);
  }, [savedArticles, article?._id]);

  const handleFollowClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }
    if (isFollowPending || isUnfollowPending || !article?.author_id?._id) return;

    if (isFollowing) {
      unfollowUser(article.author_id._id, {
        onSuccess: () => {
          toast.success("User unfollowed successfully");
          setIsFollowing(false);
        },
        onError: () => toast.error("Failed to unfollow user"),
      });
    } else {
      followUser(article.author_id._id, {
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
      setShowSignInPopup(true);
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

  const handleShareClick = () => {
    setShowSharePopup(true);
  };

  const handleSpeak = () => {
    if (!isLoggedIn) {
      setShowSignInPopup(true);
      return;
    }
    if (synth.speaking || isPendingSpeech) return;

    setIsPendingSpeech(true);
    const utterance = new SpeechSynthesisUtterance(content);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setIsPendingSpeech(false);
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    synth.speak(utterance);
  };

  const handlePauseResume = () => {
    if (synth.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    } else if (synth.paused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const cancelSpeaking = () => {
    synth.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const onPublish = async () => {
    if (!title || !subTitle || !content) {
      toast.error('Please provide a title, subtitle, and content.', { autoClose: 1500 });
      return;
    }

    const articleData: Article = {
      title,
      subTitle,
      content,
      htmlContent: htmlArticleContent,
      media,
      status: 'Published',
      type: 'LongForm',
      isArticle: true,
    };
    const toastId = toast.info('Publishing the article...', { isLoading: true, autoClose: false });
    createArticle(articleData, {
      onSuccess: () => {
        toast.update(toastId, { render: 'Article created successfully', type: 'success', isLoading: false, autoClose: 1500 });
        navigate('/feed');
        clearDraftArticle();
      },
      onError: (error) => {
        toast.update(toastId, { render: 'Error creating article: ' + error, type: 'error', isLoading: false, autoClose: 1500 });
      },
    });
  };

  const onSave = async () => {
    if (isPreview || !articleUid) return;
    saveArticle(articleUid, {
      onSuccess: () => toast.success('Article saved successfully'),
      onError: () => toast.error('Failed to save article'),
    });
  };

  useEffect(() => {
    if (articleUid === PREVIEW_SLUG) {
      const draftArticle = loadDraftArticle();
      if (!draftArticle) {
        toast.error('No draft article found.');
        navigate('/posts/create');
        return;
      }
      setTitle(draftArticle.title);
      setSubTitle(draftArticle.subTitle);
      setContent(draftArticle.content);
      setHtmlArticleContent(draftArticle.htmlContent);
      setMedia(draftArticle.media);
    }
  }, [articleUid]);

  useEffect(() => {
    if (article) {
      if (article.title) setTitle(article.title);
      if (article.subTitle) setSubTitle(article.subTitle);
      if (article.content) setHtmlArticleContent(article.content);
      if (article.htmlContent) setContent(article.htmlContent);
    }
  }, [article, isPending]);

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching article.');
      navigate('/posts/create');
    }
  }, [isError]);

  useEffect(() => {
    if (editorRef.current?.editor) {
      setTimeout(() => {
        editorRef?.current?.editor?.commands.setContent(htmlArticleContent);
      }, 0);
    }
  }, [htmlArticleContent]);

  const mainAction = {
    label: isPreview ? 'Publish' : 'Save',
    onClick: () => isPreview ? onPublish() : onSave(),
  };

  const getFollowStatusText = () => {
    if (!isLoggedIn) return 'Follow';
    if (isFollowPending) return 'Following...';
    if (isUnfollowPending) return 'Unfollowing...';
    return isFollowing ? 'Following' : 'Follow';
  };

  const getSaveStatusText = () => {
    if (!isLoggedIn) return 'Save';
    if (isSavePending) return 'Saving...';
    if (isRemovePending) return 'Removing...';
    return isSaved ? 'Saved' : 'Save';
  };

  return (
    <div className="flex flex-col">
      <Topbar>
        <CreatePostTopBar title={title} mainAction={mainAction} actions={[]} />
      </Topbar>
      <div className="max-w-full h-full mb-10 inline-block overflow-clip self-center">
        {!isPreview && isPending ? (
          <div className="max-w-full md:mx-20 mt-10 flex flex-col justify-center items-right">
            <ArticleViewSkeleton />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mt-10 flex flex-col justify-center items-left">
            {isPreview && (
              <div className="mb-4">
                <span className="text-sm font-semibold px-4 py-1 bg-foreground text-primary-500 rounded-full flex gap-2 items-center">
                  <FilePen className="size-4" />
                  Draft
                </span>
              </div>
            )}

            <h1 className="text-5xl font-semibold leading-tight mb-2 text-justify">{title}</h1>
            {subTitle && <h3 className="text-xl mb-2">{subTitle}</h3>}

            {/* Author Profile Section */}
            <div className="flex items-center gap-4 mt-8 mb-4 relative">
              <img src={profileAvatar} alt="Author" className="rounded-full w-10 h-10" />
              <div>
                <p className="font-semibold text-[16px]">{article?.author_id?.username || 'Unknown'}</p>
                <p className="text-sm text-neutral-500">{article?.author_id?.bio}</p>
              </div>
              {!isPreview && (
                <button
                  onClick={handleFollowClick}
                  className={`ml-auto px-4 py-2 rounded-full text-sm ${
                    isFollowing ? 'bg-neutral-600 text-neutral-50 hover:bg-neutral-700' : 'bg-main-green text-white hover:bg-green-600'
                  }`}
                  disabled={isFollowPending || isUnfollowPending} // Only disable during pending states
                >
                  {getFollowStatusText()}
                </button>
              )}
            </div>

            {/* Read Aloud Controls */}
            <div className="flex justify-end my-4 gap-2">
              <button
                onClick={isSpeaking ? cancelSpeaking : handleSpeak}
                className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2"
              >
                {isPendingSpeech ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : isSpeaking ? (
                  <Volume2 className="size-5 text-neutral-500" />
                ) : (
                  <Volume2 className="size-5 text-neutral-500" />
                )}
                {isSpeaking ? 'Stop' : 'Read Aloud'}
              </button>
              {isSpeaking && (
                <button
                  onClick={handlePauseResume}
                  className="p-2 rounded-full hover:bg-neutral-800 flex items-center gap-2"
                >
                  {isPaused ? (
                    <PlayCircle className="size-5 text-neutral-500" />
                  ) : (
                    <PauseCircle className="size-5 text-neutral-500" />
                  )}
                  {isPaused ? 'Resume' : 'Pause'}
                </button>
              )}
            </div>

            {/* Article Content */}
            <div id="article-content" className="w-full mb-14">
              <TipTapRichTextEditor
                initialContent={htmlArticleContent}
                handleContentChange={setContent}
                handleHtmlContentChange={setHtmlArticleContent}
                editorRef={editorRef}
                disabled={true}
                hideToolbar={true}
                hideBubble={true}
                className="w-full block"
              />
            </div>
          </div>
        )}

        {/* Reactions Section */}
        {!isPreview && !isPending && (
          <div className="max-w-4xl mx-auto mt-1 flex justify-between items-center">
            <div className="flex gap-4 items-center">
              {/* Reaction Stats */}
              <div className="flex items-center gap-2 relative cursor-pointer">
              <ReactionModal article_id={article?._id || ''} />
              <div
                    className="ml-1 hover:underline underline-offset-1 text-[17px] text-neutral-50"
                    onClick={() => setShowReactionsPopup(true)}
                  >
                    {allReactions?.reactions?.length || 0}
                  </div>
              </div>

             
             

              <button
                onClick={handleSaveClick}
                className="flex items-center gap-2 px-3 py-1 bg-neutral-800 text-neutral-50 rounded-full hover:bg-neutral-700"
              >
                <Bookmark size={18} />
                {getSaveStatusText()}
              </button>
              <button
                onClick={handleShareClick}
                className="flex items-center gap-2 px-3 py-1 bg-neutral-800 text-neutral-50 rounded-full hover:bg-neutral-700"
              >
                <Share2 size={18} /> Share
              </button>
            </div>
            <div className="text-neutral-500 text-xs">• {timeAgo(article?.createdAt)}</div>
          </div>
        )}

        {/* Comments Section */}
        {!isPreview && !isPending && (
          <div className="max-w-4xl mx-auto mt-10">
            <h2 className="text-2xl font-semibold mb-4">Comments</h2>
            <CommentSection article_id={article?._id || ''} author_of_post={article?.author_id as User} />
          </div>
        )}

        {/* Popups */}
        {showSharePopup && (
          <SharePopup url={articleUrl} title={articleTitle} onClose={() => setShowSharePopup(false)} />
        )}
        {showSignInPopup && (
          <SignInPopUp
            text="access this feature"
            position="below"
            onClose={() => setShowSignInPopup(false)}
          />
        )}
        {showReactionsPopup && (
          <ReactionsPopup
            isOpen={showReactionsPopup}
            onClose={() => setShowReactionsPopup(false)}
            article_id={article?._id || ''}
          />
        )}
      </div>
    </div>
  );
};

export default ArticleViewBySlug;