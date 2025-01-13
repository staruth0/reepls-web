import React from "react";
import "./Blog.scss";
import { Pics } from "../../../assets/images";

const BlogImagery: React.FC = () => {
  return (
    <div className="blog-imagery">
      <img className="blog-image" src={Pics.blogPic} alt="Blog-Visual" />
      
    </div>
  );
};

export default BlogImagery;
