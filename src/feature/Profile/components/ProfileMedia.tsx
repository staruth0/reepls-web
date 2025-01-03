import React from "react";
import { Pics } from "../../../assets/images";

const ProfileMedia: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <img
        src={Pics.blogPic}
        alt="blogpic"
        className="w-full h-auto rounded-lg"
      />
      <img
        src={Pics.blogPic}
        alt="blogpic"
        className="w-full h-auto rounded-lg"
      />
      <img
        src={Pics.blogPic}
        alt="blogpic"
        className="w-full h-auto rounded-lg"
      />
      <img
        src={Pics.blogPic}
        alt="blogpic"
        className="w-full h-auto rounded-lg"
      />
      <img
        src={Pics.blogPic}
        alt="blogpic"
        className="w-full h-auto rounded-lg"
      />
      <img
        src={Pics.blogPic}
        alt="blogpic"
        className="w-full h-auto rounded-lg"
      />
    </div>
  );
};

export default ProfileMedia;
