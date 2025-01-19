import { createContext } from "react";

interface VoiceLanguageContextType {
  selectedVoice: SpeechSynthesisVoice | null;
  setVoiceLanguage: (voice: SpeechSynthesisVoice) => void;
}

const initialState: VoiceLanguageContextType = {
  selectedVoice: null,
  setVoiceLanguage: () => {},
};

const VoiceLanguageContext =
  createContext<VoiceLanguageContextType>(initialState);

export { VoiceLanguageContext };
