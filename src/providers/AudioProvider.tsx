import { createContext, ReactNode, useContext, useState } from 'react';

type AudioPlayerContextType = {
  activeAudio: HTMLAudioElement | null;
  setActiveAudio: (audio: HTMLAudioElement | null) => void;
};

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  activeAudio: null,
  setActiveAudio: () => {},
});

export const useAudioPlayer = () => useContext(AudioPlayerContext);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);

  return <AudioPlayerContext.Provider value={{ activeAudio, setActiveAudio }}>{children}</AudioPlayerContext.Provider>;
};
