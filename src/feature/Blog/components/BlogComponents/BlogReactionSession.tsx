import {  MessageCircle, ThumbsUp,  } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ReadingControls } from '../../../../components/atoms/ReadALoud/ReadingControls';
import { useUser } from '../../../../hooks/useUser';
import { Article, User } from '../../../../models/datamodels';
import SignInPopUp from '../../../AnonymousUser/components/SignInPopUp';
import CommentSection from '../../../Comments/components/CommentSection';
import ReactionModal from '../../../Interactions/components/ReactionModal';
import { t } from 'i18next';

interface BlogReactionSessionProps {
  message?: string;
  isCommentSectionOpen: boolean;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  article_id: string;
  text_to_speech: string;
  author_of_post: User;
  article:Article
}

const BlogReactionSession: React.FC<BlogReactionSessionProps> = ({

  isCommentSectionOpen,
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
  text_to_speech,
  article
}) => {

  const { isLoggedIn } = useUser(); 
  const [isModalOpen, setModalOpen] = useState(false);
  const [commentTabState, setCommentTabState] = useState<boolean>(false);
  const [showReactPopup, setShowReactPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  

  const toggleCommentTab = () => {
    if (!isLoggedIn) {
      setShowCommentPopup(true);
      return;
    }
    if (!isCommentSectionOpen) {
      setCommentTabState(!commentTabState);
    } else {
      console.log('Comment section is not opened');
    }
  };

  const handleReactClick = () => {
    if (!isLoggedIn) {
      setShowReactPopup(true);
      return;
    }
    setModalOpen(true);
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
            className="flex items-center gap-2 hover:text-primary-400 cursor-pointer">
            <ThumbsUp className="size-5" /> {t("blog.React")}
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
          onReact={(reaction) => console.log(`Reacted with ${reaction}`)}
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
