import React, { useContext } from "react";
import "./Blog.scss";
import { ellipsisVertical, profileAvatar, VerifiedIcon } from "../../../assets/icons";
import { useRoute } from "../../../hooks/useRoute";
import { useGetUserById } from "../../../feature/Profile/hooks";
import { formatDateWithMonth } from "../../../utils/dateFormater";
import { AuthContext } from "../../../context/AuthContext/authContext";

interface BlogProfileProps { 
  id: string;
  date:string
}

const BlogProfile: React.FC<BlogProfileProps> = ({ id, date }) => {
  const { authState } = useContext(AuthContext);
  const { data} = useGetUserById(id || authState?.userId || "");
  const { goToProfile } = useRoute();

  const handleProfileClick = (id:string) => { 
       goToProfile(id)
  }

 const handleFollowClick = (event: React.MouseEvent) => {
   event.stopPropagation();
   console.log("followed him");
   console.log("User Data:", data);

 };
 
  return (
    <div className="blog-profile cursor-pointer" onClick={()=>handleProfileClick(id)}>
      <img src={profileAvatar} alt="avatar" />
      <div className="profile-info">
        <div className="profile-name" >
          <p>{data?.username}</p> <img src={VerifiedIcon} alt="Verified" /> <div onClick={handleFollowClick} >Follow</div>
        </div>
        <p>Writer @ CMR FA magazine...</p>
        <span>{formatDateWithMonth(date)}</span>
      </div>
      <img src={ellipsisVertical} alt="ellipsis" className="follow-button"/>
    </div>
  );
};

export default BlogProfile;
