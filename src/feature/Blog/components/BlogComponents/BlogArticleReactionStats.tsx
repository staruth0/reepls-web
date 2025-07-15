import React, { useState, useEffect, useRef } from 'react';
import { PenLine, MessageSquare, ThumbsUp,Bookmark, Radio } from 'lucide-react';
import { useGetCommentsByArticleId } from '../../../Comments/hooks';
import ReactionsPopup from '../../../Interactions/components/ReactionsPopup';
import ReactionModal from '../../../Interactions/components/ReactionModal';
import { useGetArticleReactions } from '../../../Interactions/hooks';
import { t } from 'i18next';
import { Article, ReactionReceived, User } from '../../../../models/datamodels'; // Import User
import { motion } from 'framer-motion';
import { cn } from '../../../../utils';
import { useUser } from '../../../../hooks/useUser';
import SignInPopUp from '../../../AnonymousUser/components/SignInPopUp';
import CommentSection from '../../../Comments/components/CommentSection'; // Import CommentSection
import BlogRepostModal from './BlogRepostModal';


interface BlogReactionStatsProps {
  date: string;
  toggleCommentSection?: () => void;
  article_id: string;
  article: Article;
  author_of_post: User; 
}

const BlogArticleReactionStats: React.FC<BlogReactionStatsProps> = ({
  toggleCommentSection,
  article_id,
  article,
  author_of_post
}) => {
  const { isLoggedIn, authUser } = useUser();
  const [showReactions, setShowReactions] = useState(false);
  const [showNoReactionsPopup, setShowNoReactionsPopup] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
   const [showRepostModal, setShowRepostModal] = useState(false);
   const [isRepostModalOpen, setIsRepostModalOpen] = useState(false);
   const repostRef = useRef<HTMLDivElement>(null);
  // Reaction-related states
  const [isReactionModalOpen, setIsReactionModalOpen] = useState(false);
  const [showReactSignInPopup, setShowReactSignInPopup] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);


  const [commentTabState, setCommentTabState] = useState<boolean>(false); 
  const [showCommentSignInPopup, setShowCommentSignInPopup] = useState(false); 

  const { data: articleComments, isLoading: commentsLoading } = useGetCommentsByArticleId(article_id);
  const { data: allReactions, isLoading: reactionsLoading } = useGetArticleReactions(article_id);

  const totalComments = articleComments?.pages?.[0]?.data?.totalComments;
  const reactionCount = allReactions?.reactions?.length || 0;

  // Effect for user reaction status
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

  // Effect for screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 400);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      setShowCommentSignInPopup(true); // Show sign-in pop-up if not logged in
      return;
    }
    setCommentTabState(!commentTabState); // Toggle local comment section state

    if (toggleCommentSection) {
      toggleCommentSection(); // If the parent provided a toggle, call it too.
    }
  };

  const handleRepostClick = () => {
    if (!isLoggedIn) {
      // You can add a sign-in popup here if needed
      return;
    }
    setShowRepostModal(!showRepostModal);
  };

  const handleRepostOnly = () => {
    // Handle repost only logic here
    console.log('Repost only');
    setShowRepostModal(false);
  };

  const handleRepostWithThought = () => {
    setIsRepostModalOpen(true);
    setShowRepostModal(false);
  };

  // Close repost modal when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (repostRef.current && !repostRef.current.contains(event.target as Node)) {
          setShowRepostModal(false);
        }
      };
  
      if (showRepostModal) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showRepostModal]);


  const popupVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
  <>
    <div className="flex justify-between items-center p-4 text-neutral-50 text-sm font-roboto">
      {/* Reaction and Comment controls */}
      <div className="flex items-center gap-5 h-[30px] relative cursor-pointer">
        {/* Reaction Icons and Count */}
        <div className="flex gap-0 items-center group"
            
        >
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
                 onMouseEnter={() => isLoggedIn && setIsReactionModalOpen(true)}
                 onClick={handleThumbsUpClick}
                  className={cn(
                    'size-4',
                    userReaction ? 'fill-primary-400 text-primary-400' : ''
                  )}
                />
              </>
            )}
          </div>
          {/* Reaction Count - Clicking this opens the ReactionsPopup to see all reactions */}
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

        {/* Sign-in popup for reactions */}
        {showReactSignInPopup && (
          <SignInPopUp text={t("blog.React")} position="below" onClose={() => setShowReactSignInPopup(false)} />
        )}

        {/* Reaction Modal (for adding/changing a user's reaction) */}
        <ReactionModal
          isOpen={isReactionModalOpen}
          onClose={() => setIsReactionModalOpen(false)}
          onReact={handleReactionComplete}
          article_id={article_id}
          article={article}
        />

        {/* No Reactions Popup */}
        {showNoReactionsPopup && (
          <motion.div
            className={cn(
              'absolute top-0 right-12 w-64 p-4 rounded-lg shadow-lg bg-background',
              'z-50'
            )}
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <p className="text-sm font-light leading-relaxed">No reactions to view yet</p>
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
          onClick={toggleCommentSectionInternal} // Call our internal toggle function
        >
          {commentsLoading ? (
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-neutral-500 rounded-full animate-pulse" />
              <div className="w-20 h-4 bg-neutral-500 rounded-md animate-pulse" />
            </div>
          ) : (
            totalComments > 0 ? (
              <div className='flex items-center gap-1'>
                <MessageSquare className='size-4'/>
                {totalComments}
              </div>
            ) : (
              <>
                <PenLine size={16} />
                {isSmallScreen ? 'Your thoughts?' : 'What are your thoughts'}
              </>
            )
          )}
        </div>

        {/* Sign-in popup for comments */}
        {showCommentSignInPopup && (
          <SignInPopUp text={t("blog.Comment")} position="below" onClose={() => setShowCommentSignInPopup(false)} />
        )}
      </div>


      {showReactions && reactionCount > 0 && (
        <ReactionsPopup
          isOpen={showReactions}
          onClose={handleCloseReactionPopup}
          article_id={article_id}
        />
      )}

      {/* Time Posted */}
      <div className="flex items-center gap-12 text-neutral-70 text-xs mx-1">
       

          <div className=" relative flex items-center gap-1 text-neutral-50  cursor-pointer"
               
               ref={repostRef} 
               >
           <button onClick={handleRepostClick} className="flex hover:text-primary-500 items-center gap-1">
             <Radio className='size-4' /> Repost
           </button>

          {/* Repost Modal */}
          {showRepostModal && (
            <div className="absolute bg-background bottom-full right-0 mt- border border-neutral-700 rounded-md shadow-lg z-50 min-w-[190px] p-2">
              <div className="py-1">
                <button
                  onClick={handleRepostOnly}
                  className="py-2 text-s hover:text-primary-400 transition-colors"
                >
                  Repost only
                </button>
                <div className='w-full h-[.5px] bg-neutral-500'></div>
                <button
                  onClick={handleRepostWithThought}
                  className="  py-2 text-s hover:text-primary-400 transition-colors"
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

          {/* Bookmark Icon */}
          <div className="flex items-center text-neutral-50 hover:text-primary-500 cursor-pointer"
               >
            <Bookmark className='size-4'/>
          </div>

      </div>
    </div>
    {commentTabState && (
        <CommentSection
          article_id={article_id}
          // The setIsCommentSectionOpen prop passed to CommentSection now closes it
          // based on the internal state, effectively self-managing.
          setIsCommentSectionOpen={setCommentTabState} // Pass the local state setter
          author_of_post={author_of_post}
          article={article}
        />
      )}
  </>
  );
};

export default BlogArticleReactionStats;