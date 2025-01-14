import React from "react";
import "./Blog.scss";
import { ellipsisVertical, profileAvatar, VerifiedIcon } from "../../../assets/icons";
import { useRoute } from "../../../hooks/useRoute";

const BlogProfile: React.FC = () => {
  const { goToProfile } = useRoute();

  const handleProfileClick = (id:string) => { 
       goToProfile(id)
  }

 const handleFollowClick = (event: React.MouseEvent) => {
   event.stopPropagation();
   console.log("followed him");
 };
 
  return (
    <div className="blog-profile cursor-pointer" onClick={()=>handleProfileClick('Thiago')}>
      <img src={profileAvatar} alt="avatar" />
      <div className="profile-info">
        <div className="profile-name" >
          <p>Ndifor Icha</p> <img src={VerifiedIcon} alt="Verified" /> <div onClick={handleFollowClick} >Follow</div>
        </div>
        <p>Writer @ CMR FA magazine...</p>
        <span>20 Oct</span>
      </div>
      <img src={ellipsisVertical} alt="ellipsis" className="follow-button"/>
    </div>
  );
};

export default BlogProfile;
