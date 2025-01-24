import React, { useContext, useState } from "react";
import {
  AudioLines,
  MessageCircle,
  ThumbsUp,
  Volume2,
  PauseCircle,
  PlayCircle,
  Loader2,
} from "lucide-react"; // Proper import
import { VoiceLanguageContext } from "../../../context/VoiceLanguageContext/VoiceLanguageContext";
import { cn } from "../../../utils";
import ReactionModal from "./ReactionModal";
import CommentTab from "./CommentTab";

interface BlogReactionSessionProps {
  message: string;
}

const BlogReactionSession: React.FC<BlogReactionSessionProps> = ({ message }) => {
  const { selectedVoice } = useContext(VoiceLanguageContext);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [commentTabState, setCommentTabState] = useState<boolean>(false);

  const synth = window.speechSynthesis;

  const handleSpeak = () => {
    if (synth.speaking || isPending) return; // Prevent multiple plays

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
    setCommentTabState(!commentTabState);
  };

  return (
    <div>
      <div className="blog-reaction-session flex gap-4">
        <button
          onMouseEnter={() => setModalOpen(true)}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 hover:text-primary-400 cursor-pointer"
        >
          <ThumbsUp className="size-5" /> React
        </button>
        <button
          className="hover:text-primary-400 cursor-pointer flex items-center gap-2"
          onClick={toggleCommentTab}
        >
          <MessageCircle className="size-5" /> Comment
        </button>
        <button
          className={cn(
            "hover:text-primary-400 cursor-pointer flex items-center gap-2",
            isSpeaking && "animate-pulse"
          )}
          onClick={isSpeaking ? cancelSpeaking : handleSpeak}
        >
          {isPending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : isSpeaking ? (
            <Volume2 className="size-5" />
          ) : (
            <AudioLines className="size-5" />
          )}
          {isSpeaking ? "Stop" : "Read Aloud"}
        </button>
        {isSpeaking && (
          <button
            className="hover:text-primary-400 cursor-pointer flex items-center gap-2"
            onClick={handlePauseResume}
          >
            {isPaused ? (
              <PlayCircle className="size-5" />
            ) : (
              <PauseCircle className="size-5" />
            )}
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
        <ReactionModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onReact={(reaction) => console.log(`Reacted with ${reaction}`)}
        />
      </div>

      {commentTabState && <CommentTab toggleCommentTab={toggleCommentTab} />}
    </div>
  );
};

export default BlogReactionSession;
