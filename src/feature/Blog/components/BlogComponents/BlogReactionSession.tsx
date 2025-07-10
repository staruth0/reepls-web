import { MessageCircle, ThumbsUp, Radio } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../../hooks/useUser';
import { Article, User, ReactionReceived } from '../../../../models/datamodels';
import SignInPopUp from '../../../AnonymousUser/components/SignInPopUp';
import CommentSection from '../../../Comments/components/CommentSection';
import ReactionModal from '../../../Interactions/components/ReactionModal';
import { useGetArticleReactions } from '../../../Interactions/hooks';
import { t } from 'i18next';

interface BlogReactionSessionProps {
  message?: string;
  isCommentSectionOpen: boolean;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  article_id: string;
  text_to_speech: string;
  author_of_post: User;
  article: Article;
}

const BlogReactionSession: React.FC<BlogReactionSessionProps> = ({
  isCommentSectionOpen,
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
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

  // Check if the current user has reacted
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
     
            className={`flex items-center gap-2 cursor-pointer group
              ${userReaction ? 'text-primary-500' : 'text-neutral-50'} `}
          >
            <ThumbsUp
         
              className={`size-5
                ${userReaction ? 'fill-primary-500 text-primary-500' : 'text-neutral-50'} group-hover:text-green-500 group-hover:fill-green-500`}
            />
            <span className="group-hover:text-green-500">
              {userReaction ? t("blog.Reacted") : t("blog.React")}
            </span>
          </button>
          {showReactPopup && <SignInPopUp text={t("blog.React")} position="below" onClose={() => setShowReactPopup(false)} />}
        </div>

        {/* Comment Button */}
        <div className="relative">
      
          <button className="text-neutral-50 cursor-pointer flex items-center gap-2 group" onClick={toggleCommentTab}>
            <MessageCircle className="size-5 text-neutral-50 group-hover:text-green-500" />
            <span className="group-hover:text-green-500"> {t("blog.Comment")} </span> 
          </button>
          {showCommentPopup && (
            <SignInPopUp text={t("blog.Comment")} position="below" onClose={() => setShowCommentPopup(false)} />
          )}
        </div>

     
        <div className="relative flex gap-1 items-center text-neutral-50 cursor-pointer group">
          <Radio className='size-5 text-neutral-50 group-hover:text-green-500' /> 
          <span className='text-[14px] text-neutral-50 group-hover:text-green-500'>Repost</span> 
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
      {commentTabState && (
        <CommentSection
          article_id={article_id}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
          author_of_post={author_of_post}
          article={article}
        />
      )}
      {isCommentSectionOpen && (
        <CommentSection
          article_id={article_id}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
          author_of_post={author_of_post}
          article={article}
        />
      )}
    </div>
  );
};

export default BlogReactionSession;