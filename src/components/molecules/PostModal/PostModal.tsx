import React, { useContext } from "react";
import "./PostModal.scss";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../../../context/PostModal/PostModalContext";

const PostModal: React.FC = () => {
    const navigate = useNavigate()
    const {closeModal} = useContext(ModalContext)

    const handleNavigate = () => {
        navigate("/posts/create");
        closeModal();
    }
    
  return (
    <div className="overlay">
      <div className="modal">
        <h3>Create</h3>
        <div className="modal-option" onClick={handleNavigate}>Regular post</div>
        <hr />
        <div className="modal-option" onClick={handleNavigate}>Article</div>
      </div>
    </div>
  );
};

export default PostModal;
