import { MessageCircle, ThumbsUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ReadingControls } from '../../../../components/atoms/ReadALoud/ReadingControls';
import { useUser } from '../../../../hooks/useUser';
import { Article, User, ReactionReceived } from '../../../../models/datamodels';
import SignInPopUp from '../../../AnonymousUser/components/SignInPopUp';
import CommentSection from '../../../Comments/components/CommentSection';
import ReactionModal from '../../../Interactions/components/ReactionModal';
import { useGetArticleReactions } from '../../../Interactions/hooks';
import { t } from 'i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface BlogReactionSessionProps {
  message?: string;
  isCommentSectionOpen: boolean;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  article_id: string;
  text_to_speech: string;
  author_of_post: User;
  article: Article;
}

const BlogArticleReactionSession: React.FC<BlogReactionSessionProps> = ({
  isCommentSectionOpen,
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
  text_to_speech,
  article
}) => {
  const { isLoggedIn, authUser } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);
  const [commentTabState, setCommentTabState] = useState<boolean>(false);
  const [showReactPopup, setShowReactPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  
  // Get all reactions for this article
  const { data: allReactions } = useGetArticleReactions(article_id);
  
  // Check if the current user has reacted+-
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

  useEffect(() => {
    if (isCommentSectionOpen) {
      setCommentTabState(false);
    }
  }, [isCommentSectionOpen]);

  return (
    <div className="relative">
      <div className="blog-reaction-session border-t border-neutral-500 flex gap-4">
        {/* React Button */}
        <div className="relative">
          <button
            onMouseEnter={() => isLoggedIn && setModalOpen(true)}
            onClick={handleReactClick}
            className={`flex items-center gap-2 hover:text-primary-400 cursor-pointer ${
              userReaction ? 'text-primary-400' : ''
            }`}
          >
            <ThumbsUp 
              className={`size-5 ${userReaction ? 'fill-primary-400 text-primary-400' : ''}`} 
            /> 
            {userReaction? t("blog.Reacted") : t("blog.React")}
          </button>
          {showReactPopup && <SignInPopUp text={t("blog.React")} position="below" onClose={() => setShowReactPopup(false)} />}
        </div>

        {/* Comment Button */}
        <div className="relative">
          <button className="hover:text-primary-400 cursor-pointer flex items-center gap-2" onClick={toggleCommentTab}>
            <MessageCircle className="size-5" /> {t("blog.Comment")}
          </button>
          {showCommentPopup && (
            <SignInPopUp text={t("blog.Comment")} position="below" onClose={() => setShowCommentPopup(false)} />
          )}
        </div>
        
        {/* Read Aloud Button */}
        <div className="relative">
          <ReadingControls article={article} article_id={article_id} article_tts={text_to_speech} />
        </div>

        {/* Reaction Modal */}
        <ReactionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onReact={handleReactionComplete}
          article_id={article_id}
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
              author_of_post={author_of_post}
              article={article}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogArticleReactionSession;