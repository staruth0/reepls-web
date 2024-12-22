import React, { useState, useCallback } from "react";
import { ModalContext } from "./PostModalContext";

interface PostModalProviderProps {
  children: React.ReactNode;
}

const PostModalProvider: React.FC<PostModalProviderProps> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [numberOftimesModalOpened, setNumberOftimesModalOpened] = useState<number>(0);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
    setNumberOftimesModalOpened((prevCount) => prevCount + 1);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <ModalContext.Provider value={{isModalOpen,openModal,closeModal,numberOftimesModalOpened}}>
      {children}
    </ModalContext.Provider>
  );
};

export default PostModalProvider;
