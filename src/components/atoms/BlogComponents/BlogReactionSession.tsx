import React, { useContext, useState } from 'react';
import { LuAudioLines, LuMessageCircle, LuThumbsUp, LuVolumeX } from 'react-icons/lu';
import { VoiceLanguageContext } from '../../../context/VoiceLanguageContext/VoiceLanguageContext';
import { cn } from '../../../utils';

const BlogReactionSession: React.FC = () => {
  const { selectedVoice } = useContext(VoiceLanguageContext);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const handleSpeak = () => {
    const message = `The Tangue", alongside a number of other historic artworks from the fatherland have not found home yet. These artifacts remain scattered across various countries, awaiting their rightful return to their homeland.`;
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(message);
    if (selectedVoice) utterance.voice = selectedVoice;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(false);
  };

  const cancelSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="blog-reaction-session">
      <button className="hover:text-primary-400 cursor-pointer">
        <LuThumbsUp className="size-5" /> React
      </button>
      <button className="hover:text-primary-400 cursor-pointer">
        <LuMessageCircle className="size-5" /> Comment
      </button>
      <button
        className={cn('hover:text-primary-400 cursor-pointer', isSpeaking && 'animate-pulse')}
        onClick={isSpeaking ? cancelSpeaking : handleSpeak}>
        {isSpeaking ? <LuVolumeX className="size-5 animate-spin" /> : <LuAudioLines className="size-5" />}
        {isSpeaking ? 'Stop' : 'Read Aloud'}
      </button>
    </div>
  );
};

export default BlogReactionSession;
