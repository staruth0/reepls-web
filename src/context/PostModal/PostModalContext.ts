import { createContext } from "react";

interface ModalContextType { 
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
    numberOftimesModalOpened: number

}

const initialModalContext: ModalContextType = {
    isModalOpen: false,
    openModal: () => { },
    closeModal: () => { },
    numberOftimesModalOpened: 0
}


const ModalContext = createContext(initialModalContext);
export { ModalContext };