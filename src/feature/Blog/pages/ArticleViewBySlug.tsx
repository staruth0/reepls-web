import { Bookmark, FilePen, MessageSquare, Share2, ThumbsUp, ArrowLeft } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Editor } from 'reactjs-tiptap-editor';
import { ArticleAudioControls } from '../../../components/atoms/ReadALoud/ArticleAudioControls';
import SharePopup from '../../../components/molecules/share/SharePopup';
import { PREVIEW_SLUG } from '../../../constants';
import { useUser } from '../../../hooks/useUser';
import { Article, Follow, MediaItem, User } from '../../../models/datamodels';
import { timeAgo } from '../../../utils/dateFormater';
import SignInPopUp from '../../AnonymousUser/components/SignInPopUp';
import { useFollowUser, useGetFollowing, useUnfollowUser } from '../../Follow/hooks';
import { useGetArticleReactions } from '../../Interactions/hooks';
import { useGetSavedArticles, useRemoveSavedArticle, useSaveArticle, useUpdateReadingHistory } from '../../Saved/hooks';
import ReactionModal from '../components/BlogReactionModal';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import { useGetArticleById, useGetArticleBySlug } from '../hooks/useArticleHook';
import useDraft from '../hooks/useDraft';
import '../styles/view.scss';
import ArticleViewSkeleton from './ArticleViewSkeleton';
import CommentSection from '../../Comments/components/CommentSection';
import ReactionsPopup from '../../Interactions/components/ReactionsPopup';

const ArticleViewBySlug: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid,id, slug } = useParams();
  const { authUser, isLoggedIn } = useUser();
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState<string>('*This article does not have a title*');
  const [subtitle, setSubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('*This article does not have any content*');
  const [_, setMedia] = useState<MediaItem[]>([]);
  const [isPreview] = useState<boolean>(articleUid === PREVIEW_SLUG);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false);
  const [showSignInPopup, setShowSignInPopup] = useState<string | null>(null);
  const [showReactionsPopup, setShowReactionsPopup] = useState<boolean>(false);

  const { loadDraftArticle } = useDraft();
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const { mutate: saveArticle, isPending: isSavePending } = useSaveArticle();
  const { mutate: removeSavedArticle, isPending: isRemovePending } = useRemoveSavedArticle();
  const { data: savedArticles } = useGetSavedArticles();
  const { mutate: followUser, isPending: isFollowPending } = useFollowUser();
  const { mutate: unfollowUser, isPending: isUnfollowPending } = useUnfollowUser();
  const { data: followings } = useGetFollowing(authUser?.id || '');
  const { data: articleslug, isError, isPending } = useGetArticleBySlug(slug!);
  const {data:articleid} = useGetArticleById(id!)

  const article = slug? articleslug: articleid;
  const { data: allReactions } = useGetArticleReactions(article?._id || '');
  const [showReactionsHoverPopup, setShowReactionsHoverPopup] = useState<boolean>(false);

  const articleUrl = `${window.location.origin}/posts/article/slug/${slug}`;
  const articleTitle = title || content.split(' ').slice(0, 10).join(' ') + '...';

  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(true);
   const { mutate } = useUpdateReadingHistory();
  // Handle mutation and show toast on error
  useEffect(() => {
    if (slug) {
      mutate(slug, {
        onError: () => {
          console.log('error adding article to reading history');
        },
      });
    }
  }, [slug, mutate]);

  const toggleCommentSection2 = () => {
    setIsCommentSectionOpen(true);
  };

  

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
      setShowSignInPopup('follow');
      return;
    }
    if (isFollowPending || isUnfollowPending || !article?.author_id?._id) return;

    if (isFollowing) {
      unfollowUser(article.author_id._id, {
        onSuccess: () => {
          toast.success('User unfollowed successfully');
          setIsFollowing(false);
        },
        onError: () => toast.error('Failed to unfollow user'),
      });
    } else {
      followUser(article.author_id._id, {
        onSuccess: () => {
          toast.success('User followed successfully');
          setIsFollowing(true);
        },
        onError: () => toast.error('Failed to follow user'),
      });
    }
  };

  const handleSaveClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup('save');
      return;
    }
    if (isSavePending || isRemovePending || !article?._id) return;

    if (isSaved) {
      removeSavedArticle(article._id, {
        onSuccess: () => {
          toast.success('Article removed from saved');
          setIsSaved(false);
        },
        onError: () => toast.error('Failed to remove article'),
      });
    } else {
      saveArticle(article._id, {
        onSuccess: () => {
          toast.success('Article saved successfully');
          setIsSaved(true);
        },
        onError: () => toast.error('Failed to save article'),
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleShareClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup('share');
      return;
    }
    setShowSharePopup(true);
  };

  const handleCommentClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup('comment');
      return;
    }
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      setSubtitle(draftArticle.subtitle);
      setContent(draftArticle.content);
      setHtmlArticleContent(draftArticle.htmlContent);
      setMedia(draftArticle.media);
    }
  }, [articleUid]);

  useEffect(() => {
    if (article) {
      if (article.title) setTitle(article.title);
      if (article.subtitle) setSubtitle(article.subtitle);
      if (article.content) setContent(article.content);
      if (article.htmlContent) setHtmlArticleContent(article.htmlContent);
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

  const getFollowStatusText = () => {
    if (!isLoggedIn) return 'Follow';
    if (isFollowPending) return 'Following...';
    if (isUnfollowPending) return 'Unfollowing...';
    return isFollowing ? 'Following' : 'Follow';
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="max-w-full h-full mb-56 inline-block overflow-clip self-center flex-grow">
        {!isPreview && isPending ? (
          <div className="max-w-full md:mx-20 mt-10 flex flex-col justify-center items-right">
            <ArticleViewSkeleton />
          </div>
        ) : (
          <div className="max-w-4xl sm:px-10 mx-auto mt-10 flex flex-col justify-center items-left">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-neutral-100 md:hidden hover:text-neutral-200 mb-6 px-4 md:px-0"
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

            <h1 className="md:text-4xl px-4 md:px-0 text-[26px] lg:text-5xl font-semibold leading-normal lg:leading-tight mb-2">{title}</h1>
            {subtitle && <h3 className="text-xl my-4 px-4 md:px-0">{subtitle}</h3>}

       {/* Author Profile Section */}
<div className="flex my-4 items-center gap-4 mt-8 mb-4 px-3 md:px-0">
  <div className='flex gap-2'>
    {article?.author_id?.profile_picture ? (
      <img 
        src={article.author_id.profile_picture} 
        alt={article.author_id.username || 'Author'} 
        className="rounded-full w-10 h-10 object-cover"
      />
    ) : (
      <div className="rounded-full w-10 h-10 bg-purple-500 flex items-center justify-center text-white font-bold">
        {article?.author_id?.username?.charAt(0) || 'A'}
      </div>
    )}
    <div>
      <p className="font-semibold text-[16px]">{article?.author_id?.username || 'Unknown'}</p>
      <p className="text-sm text-neutral-500">{article?.author_id?.bio}</p>
    </div>
  </div>
  {!isPreview && (
    <button
      onClick={handleFollowClick}
      className={`ml-auto px-4 py-2 rounded-full text-sm ${
        isFollowing
          ? 'bg-neutral-600 text-neutral-50 hover:bg-neutral-700'
          : 'bg-main-green text-white hover:bg-green-600'
      }`}
      disabled={!isLoggedIn || isFollowPending || isUnfollowPending}
    >
      {getFollowStatusText()}
    </button>
  )}
</div>

            {/* Audio Controls */}
            <div className="my-6 px-2 md:px-0">{article && <ArticleAudioControls article={article} />}</div>

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
              <div className="text-neutral-100 text-md px-3 mb-5">{timeAgo(article?.createdAt)}</div>
            )}

            {/* Comments Section */}
            {!isPreview && !isPending && (
              <div ref={commentSectionRef} className="w-[100%] px-3 md:px-0 mx-auto mt-10">
                <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                {isCommentSectionOpen && <CommentSection article_id={article?._id || ''} article={article} setIsCommentSectionOpen={toggleCommentSection2} author_of_post={article?.author_id as User} />}
              </div>
            )}
          </div>
        )}
      </div>

      {!isPreview && !isPending && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-800 rounded-full shadow-lg p-2 flex gap-4 items-center justify-center md:bottom-6">
          {/* Reactions Button with Hover Popup */}
       {/* Reactions Button with Hover Popup */}
<div className='flex items-center'>
  <div 
    className="relative group"
    onMouseEnter={() => isLoggedIn && setShowReactionsHoverPopup(true)}
    onMouseLeave={() => setShowReactionsHoverPopup(false)}
  >
    <button
      className={`p-2 rounded-full flex items-center ${
        isLoggedIn ? 'text-neutral-50 hover:bg-neutral-700' : 'text-neutral-500 cursor-not-allowed'
      }`}
      title="React"
    >
      <ThumbsUp size={20} />
    </button>

    {showReactionsHoverPopup && isLoggedIn && (
      <>
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowReactionsHoverPopup(false)}
        />
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[999] rounded-lg p-2 min-w-[200px]"
        >
          <div className="relative z-[9999]">
            <ReactionModal article_id={article?._id || ''} />
          </div>
        </div>
      </>
    )}
  </div>
  <span 
    className="ml-1 text-sm hover:underline cursor-pointer"
    onClick={() => setShowReactionsPopup(true)} // Add this to trigger the popup
  >
    {allReactions?.reactions?.length || 0}
  </span>
</div>
        

          <button
            onClick={handleCommentClick}
            className={`p-2 rounded-full ${
              isLoggedIn ? 'hover:bg-neutral-700 text-neutral-50' : 'text-neutral-500 cursor-not-allowed'
            }`}
            title="Comment"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={handleSaveClick}
            className={`p-2 rounded-full ${
              isLoggedIn ? 'hover:bg-neutral-700 text-neutral-50' : 'text-neutral-500 cursor-not-allowed'
            }`}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            <Bookmark size={20} className={isSaved && isLoggedIn ? 'fill-current' : ''} />
          </button>
          <button
            onClick={handleShareClick}
            className={`p-2 rounded-full ${
              isLoggedIn ? 'hover:bg-neutral-700 text-neutral-50' : 'text-neutral-500 cursor-not-allowed'
            }`}
            title="Share"
          >
            <Share2 size={20} />
          </button>
        </div>
      )}

      {/* Popups */}
      {showSharePopup && (
        <SharePopup url={articleUrl} title={articleTitle} onClose={() => setShowSharePopup(false)} />
      )}
      {showSignInPopup && (
        <SignInPopUp
          text={showSignInPopup}
          position="above"
          onClose={() => setShowSignInPopup(null)}
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
  );
};

export default ArticleViewBySlug;