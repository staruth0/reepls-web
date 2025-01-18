import React, { useContext} from "react";

import "./Blog.scss";
import { readAloudIcon, thumb_2, tooltip } from "../../../assets/icons";
import { VoiceLanguageContext } from "../../../context/VoiceLanguageContext/VoiceLanguageContext";

const BlogReactionSession: React.FC = () => {
  const { selectedVoice } = useContext(VoiceLanguageContext);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(
      "Entrez votre email pour créer un compte. Notez que s'inscrire avec un email offre plus de personnalisation et d'autres avantages."
    );
    utterance.voice = selectedVoice;
    console.log(selectedVoice);
    window.speechSynthesis.speak(utterance);

  }

  return (
    <div className="blog-reaction-session">
      <button>
        <img src={thumb_2} alt="thumb" /> React
      </button>
      <button>
        <img src={tooltip} alt="" /> Comment
      </button>
      <button onClick={handleSpeak}>
        <img src={readAloudIcon} alt="" /> Read Aloud
      </button>
    </div>
  );
};

export default BlogReactionSession;
