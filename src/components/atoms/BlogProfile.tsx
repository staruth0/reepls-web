import React from "react";
import "./Blog.scss";
import { ellipsisVertical, profileAvatar, VerifiedIcon } from "../../assets/icons";

const BlogProfile: React.FC = () => {
  return (
    <div className="blog-profile">
      <img src={profileAvatar} alt="avatar" />
      <div className="profile-info">
        <h4>
          <p>Ndifor Icha</p> <img src={VerifiedIcon} alt="Verified" /> <div>Follow</div>
        </h4>
        <p>Writer @ CMR FA magazine...</p>
        <span>20 Oct</span>
      </div>
      <img src={ellipsisVertical} alt="ellipsis" className="follow-button"/>
    </div>
  );
};

export default BlogProfile;
