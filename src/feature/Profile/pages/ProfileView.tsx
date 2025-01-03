import React, { useState } from "react";
import ProfileBody from "../components/ProfileBody";
import ProfileDetails from "../components/ProfileDetails";
import ProfileAbout from "../components/ProfileAbout";
import ProfilePosts from "../components/ProfilePosts";
import ProfileArticles from "../components/ProfileArticles";
import ProfileMedia from "../components/ProfileMedia";
import { useNavigate } from "react-router-dom";

const ProfileView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"about" | "posts" | "articles" | "media">("about");

  const handleTabChange = ( newTab: "about" | "posts" | "articles" | "media" ) => {
    setActiveTab(newTab);
    };
    
    const navigate = useNavigate();
    const handleEditProfile = () => {
      navigate("/profile/edit");
    };
    const handleViewAnalytics = () => {
        navigate("/profile/analytics");
    }

  return (
    <div className="profile__view px-20">
      <ProfileBody>
        <div className="flex items-center">
          <div className="flex-1">
            <ProfileDetails />
          </div>

          <div className="flex gap-2 text-neutral-50 justify-center items-center">
            <button className="px-8 py-3 border border-gray-300 rounded-full text-sm hover:bg-gray-100" onClick={handleEditProfile}>
              Edit Profile
            </button>
            <button className="px-8 py-3 bg-neutral-600 rounded-full text-sm hover:bg-gray-200" onClick={handleViewAnalytics}>
              View Analytics
            </button>
          </div>
        </div>
      </ProfileBody>

    
      <div className="relative mt-6 border-b-[1px] border-neutral-500 text-[14px] pb-2">
        <div className="flex justify-between px-4 text-neutral-400">
          <p
            className={`cursor-pointer ${
              activeTab === "about" && "text-neutral-50 font-bold"
            }`}
            onClick={() => handleTabChange("about")}
          >
            About
          </p>
          <p
            className={`cursor-pointer ${
              activeTab === "posts" && "text-neutral-50 font-bold"
            }`}
            onClick={() => handleTabChange("posts")}
          >
            Posts
          </p>
          <p
            className={`cursor-pointer ${
              activeTab === "articles" && "text-neutral-50 font-bold"
            }`}
            onClick={() => handleTabChange("articles")}
          >
            Articles
          </p>
          <p
            className={`cursor-pointer ${
              activeTab === "media" && "text-neutral-50 font-bold"
            }`}
            onClick={() => handleTabChange("media")}
          >
            Media
          </p>
        </div>

        
        <div
          className={`absolute bottom-0 h-[2px] bg-primary-400 transition-all duration-300`}
          style={{
            width: "50px",
            left:
              activeTab === "about"
                ? "2.1%"
                : activeTab === "posts"
                ? "30.8%"
                : activeTab === "articles"
                ? "60%"
                : "89.7%",
          }}
        ></div>
      </div>

    
      <div className="mt-10 ">
        {activeTab === "about" && <ProfileAbout />}
        {activeTab === "posts" && <ProfilePosts />}
        {activeTab === "articles" && <ProfileArticles />}
        {activeTab === "media" && <ProfileMedia />}
      </div>
    </div>
  );
};

export default ProfileView;
