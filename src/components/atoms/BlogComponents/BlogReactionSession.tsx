import React, { useContext, useState } from "react";
import "./Blog.scss";
import { thumb_2, tooltip, readAloudIcon } from "../../../assets/icons";
import { VoiceLanguageContext } from "../../../context/VoiceLanguageContext/VoiceLanguageContext";
import ReactionModal from "./ReactionModal";

const BlogReactionSession: React.FC = () => {
  const { selectedVoice } = useContext(VoiceLanguageContext);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(
      `The Tangue, alongside a number of other historic artworks from the fatherland, have not found home yet. These artifacts remain scattered across various countries, awaiting their rightful return to their homeland.`
    );
    utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="blog-reaction-session">
      <button
        onMouseEnter={() => setModalOpen(true)}
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2"
      >
        <img src={thumb_2} alt="thumb" /> React
      </button>
      <button>
        <img src={tooltip} alt="" /> Comment
      </button>
      <button onClick={handleSpeak}>
        <img src={readAloudIcon} alt="" /> Read Aloud
      </button>

      
      <ReactionModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onReact={(reaction) => console.log(`Reacted with ${reaction}`)}
      />
    </div>
  );
};

export default BlogReactionSession;
