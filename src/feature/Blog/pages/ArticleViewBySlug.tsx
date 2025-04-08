import { Bookmark, FilePen, MessageSquare, Share2,ThumbsUp } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Editor } from 'reactjs-tiptap-editor';
import { profileAvatar } from '../../../assets/icons';
import { ArticleAudioControls } from '../../../components/atoms/ReadALoud/ArticleAudioControls';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import SharePopup from '../../../components/molecules/share/SharePopup';
import { PREVIEW_SLUG } from '../../../constants';
import { useUser } from '../../../hooks/useUser';
import { Article, Follow, MediaItem, User } from '../../../models/datamodels';
import { timeAgo } from '../../../utils/dateFormater';
import SignInPopUp from '../../AnonymousUser/components/SignInPopUp';
import { useFollowUser, useGetFollowing, useUnfollowUser } from '../../Follow/hooks';
import ReactionsPopup from '../../Interactions/components/ReactionsPopup';
import { useGetArticleReactions } from '../../Interactions/hooks';
import { useGetSavedArticles, useRemoveSavedArticle, useSaveArticle } from '../../Saved/hooks';

import ReactionModal from '../components/BlogReactionModal';
import CreatePostTopBar from '../components/CreatePostTopBar';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import { useCreateArticle, useGetArticleBySlug } from '../hooks/useArticleHook';
import useDraft from '../hooks/useDraft';
import '../styles/view.scss';
import ArticleViewSkeleton from './ArticleViewSkeleton';
import CommentSection from '../../Comments/components/CommentSection';

const ArticleViewBySlug: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid, slug } = useParams();
  const { authUser, isLoggedIn } = useUser();
  const commentSectionRef = useRef<HTMLDivElement>(null); // Ref for scrolling to comments

  const [title, setTitle] = useState<string>('*This article does not have a title*');
  const [subtitle, setsubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('*This article does not have any content*');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isPreview] = useState<boolean>(articleUid === PREVIEW_SLUG);
  const [showSharePopup, setShowSharePopup] = useState<boolean>(false);
  const [showSignInPopup, setShowSignInPopup] = useState<string | null>(null); // Store action type
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
  const [showReactionsHoverPopup, setShowReactionsHoverPopup] = useState<boolean>(false);

  const articleUrl = `${window.location.origin}/posts/article/${slug}`;
  const articleTitle = title || content.split(' ').slice(0, 10).join(' ') + '...';

   const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(true);
  
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

  const handleShareClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup('share');
      return;
    }
    setShowSharePopup(true);
  };

  // const handleReactionsClick = () => {
  //   if (!isLoggedIn) {
  //     setShowSignInPopup('react');
  //     return;
  //   }
  //   setShowReactionsPopup(true);
  // };

  const handleCommentClick = () => {
    if (!isLoggedIn) {
      setShowSignInPopup('comment');
      return;
    }
    commentSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onPublish = async () => {
    if (!title || !subtitle || !content) {
      toast.error('Please provide a title, subtitle, and content.', { autoClose: 1500 });
      return;
    }

    const articleData: Article = {
      title,
      subtitle,
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
        toast.update(toastId, {
          render: 'Article created successfully',
          type: 'success',
          isLoading: false,
          autoClose: 1500,
        });
        navigate('/feed');
        clearDraftArticle();
      },
      onError: (error) => {
        toast.update(toastId, {
          render: 'Error creating article: ' + error,
          type: 'error',
          isLoading: false,
          autoClose: 1500,
        });
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
      setsubtitle(draftArticle.subtitle);
      setContent(draftArticle.content);
      setHtmlArticleContent(draftArticle.htmlContent);
      setMedia(draftArticle.media);
    }
  }, [articleUid]);

  useEffect(() => {
    if (article) {
      if (article.title) setTitle(article.title);
      if (article.subtitle) setsubtitle(article.subtitle);
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

  const mainAction = {
    label: isPreview ? 'Publish' : 'Save',
    onClick: () => (isPreview ? onPublish() : onSave()),
  };

  const getFollowStatusText = () => {
    if (!isLoggedIn) return 'Follow';
    if (isFollowPending) return 'Following...';
    if (isUnfollowPending) return 'Unfollowing...';
    return isFollowing ? 'Following' : 'Follow';
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Topbar>
        <CreatePostTopBar title={title} mainAction={mainAction} actions={[]} />
      </Topbar>
      <div className="max-w-full h-full mb-56 inline-block overflow-clip self-center flex-grow">
        {!isPreview && isPending ? (
          <div className="max-w-full md:mx-20 mt-10 flex flex-col justify-center items-right">
            <ArticleViewSkeleton />
          </div>
        ) : (
          <div className="max-w-4xl sm:px-10 mx-auto mt-10 flex flex-col justify-center items-left">
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
              <img src={profileAvatar} alt="Author" className="rounded-full w-10 h-10" />
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
               { isCommentSectionOpen && <CommentSection article_id={article?._id || ''} setIsCommentSectionOpen={toggleCommentSection2} author_of_post={article?.author_id as User} />}
              </div>
            )}
          </div>
        )}
      </div>

      {!isPreview && !isPending && (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-neutral-800 rounded-full shadow-lg p-2 flex gap-4 items-center justify-center md:bottom-6">
    {/* Reactions Button with Hover Popup */}
    <div 
      className="relative group" // Added 'group' for hover control
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
        <span className="ml-1 text-sm">{allReactions?.reactions?.length || 0}</span>
      </button>

      {/* Reactions Popup with Overlay */}
      {showReactionsHoverPopup && isLoggedIn && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowReactionsHoverPopup(false)}
          />
          
          {/* Reactions Container */}
          <div 
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-[999]  rounded-lg  p-2 min-w-[200px]"
          >
            <div className="relative z-[9999]">
              <ReactionModal article_id={article?._id || ''} />
            </div>
          </div>
        </>
      )}
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