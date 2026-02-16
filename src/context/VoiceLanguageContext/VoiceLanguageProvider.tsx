import { useState, ReactNode, useEffect } from "react";
import { VoiceLanguageContext } from "./VoiceLanguageContext";

interface VoiceLanguageProviderProps {
  children: ReactNode;
}

const VoiceLanguageProvider: React.FC<VoiceLanguageProviderProps> = ({
  children,
}) => {
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setSelectedVoice(voices[0]);
      }
    };
    window.speechSynthesis.onvoiceschanged = updateVoices;
    updateVoices(); 

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return (
    <VoiceLanguageContext.Provider
      value={{ selectedVoice, setVoiceLanguage: setSelectedVoice }}
    >
      {children}
    </VoiceLanguageContext.Provider>
  );
};

export default VoiceLanguageProvider;
