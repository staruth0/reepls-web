import React from "react";
import "../styles/CreatePostTopBar.scss";
import { useLocation, useNavigate } from "react-router-dom";

interface CreateTopBarProps {
  postType?: string;
  handleSelectChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const CreatePostTopBar: React.FC<CreateTopBarProps> = ({postType,handleSelectChange,}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handlePublishClick = () => {
    if (location.pathname === "/posts/create") {
      navigate("/posts/create/preview");
    } else if (location.pathname === "/posts/create/preview") {
    console.log("Publishing the post...")
    }

  }

  return (
    <div className="create__post__top__bar">
      <div>Create Post</div>
      {location.pathname === "/posts/create" && (
        <select value={postType} onChange={handleSelectChange}>
          <option value="regular post">Regular post</option>
          <option value="Article">Article</option>
        </select>
      )}
      <button className="publish__btn" onClick={handlePublishClick}>
        {location.pathname === "/posts/create/preview" ? "Publish" : "Preview"}
      </button>
    </div>
  );
};

export default CreatePostTopBar;
