import { AudioLines, Loader2, MessageCircle, PauseCircle, PlayCircle, ThumbsUp, Volume2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { ReadingControls } from '../../../../components/atoms/ReadALoud/ReadingControls';
import { VoiceLanguageContext } from '../../../../context/VoiceLanguageContext/VoiceLanguageContext';
import { useUser } from '../../../../hooks/useUser';
import { User } from '../../../../models/datamodels';
import { cn } from '../../../../utils';
import SignInPopUp from '../../../AnonymousUser/components/SignInPopUp';
import CommentSection from '../../../Comments/components/CommentSection';
import ReactionModal from '../../../Interactions/components/ReactionModal';

interface BlogReactionSessionProps {
  message: string;
  isCommentSectionOpen: boolean;
  setIsCommentSectionOpen: (isOpen: boolean) => void;
  article_id: string;
  text_to_speech: string;
  author_of_post: User;
}

const BlogReactionSession: React.FC<BlogReactionSessionProps> = ({
  message,
  isCommentSectionOpen,
  article_id,
  setIsCommentSectionOpen,
  author_of_post,
  text_to_speech,
}) => {
  const { selectedVoice } = useContext(VoiceLanguageContext);
  const { isLoggedIn } = useUser(); // Use isLoggedIn instead of authUser
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [commentTabState, setCommentTabState] = useState<boolean>(false);
  const [showReactPopup, setShowReactPopup] = useState(false);
  const [showCommentPopup, setShowCommentPopup] = useState(false);
  const [showReadPopup, setShowReadPopup] = useState(false);

  const synth = window.speechSynthesis;

  const handleSpeak = () => {
    if (!isLoggedIn) {
      setShowReadPopup(true);
      return;
    }
    if (synth.speaking || isPending) return;

    setIsPending(true);
    const utterance = new SpeechSynthesisUtterance(message);
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setIsPending(false);
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
            <ThumbsUp className="size-5" /> React
          </button>
          {showReactPopup && <SignInPopUp text="React" position="below" onClose={() => setShowReactPopup(false)} />}
        </div>

        {/* Read Aloud Button */}
        <div className="relative">
          <ReadingControls article_id={article_id} article_tts={text_to_speech} />
        </div>

        {/* Comment Button */}
        <div className="relative">
          <button className="hover:text-primary-400 cursor-pointer flex items-center gap-2" onClick={toggleCommentTab}>
            <MessageCircle className="size-5" /> Comment
          </button>
          {showCommentPopup && (
            <SignInPopUp text="Comment" position="below" onClose={() => setShowCommentPopup(false)} />
          )}
        </div>

        {/* Read Aloud Button */}
        <div className="relative">
          <button
            className={cn(
              'hover:text-primary-400 cursor-pointer flex items-center gap-2',
              isSpeaking && 'animate-pulse'
            )}
            onClick={isSpeaking ? cancelSpeaking : handleSpeak}>
            {isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : isSpeaking ? (
              <Volume2 className="size-5" />
            ) : (
              <AudioLines className="size-5" />
            )}
            {isSpeaking ? 'Stop' : 'Read Aloud'}
          </button>
          {showReadPopup && (
            <SignInPopUp text="Read Aloud" position="top-right" onClose={() => setShowReadPopup(false)} />
          )}
        </div>

        {/* Pause/Resume Button */}
        {isSpeaking && (
          <button className="hover:text-primary-400 cursor-pointer flex items-center gap-2" onClick={handlePauseResume}>
            {isPaused ? <PlayCircle className="size-5" /> : <PauseCircle className="size-5" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}

        {/* Reaction Modal */}
        <ReactionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onReact={(reaction) => console.log(`Reacted with ${reaction}`)}
          article_id={article_id}
        />
      </div>

      {/* Comment Section */}
      {commentTabState && (
        <CommentSection
          article_id={article_id}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
          author_of_post={author_of_post}
        />
      )}
      {isCommentSectionOpen && (
        <CommentSection
          article_id={article_id}
          setIsCommentSectionOpen={setIsCommentSectionOpen}
          author_of_post={author_of_post}
        />
      )}
    </div>
  );
};

export default BlogReactionSession;
