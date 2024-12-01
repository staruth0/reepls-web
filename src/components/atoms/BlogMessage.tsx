import React, { useState } from "react";
import "./Blog.scss";

const BlogMessage: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="blog-message">
      <h2>
        The long old case of looted art during German colonial rule resuscitates
      </h2>
      <p className={`paragraph ${isExpanded ? "expanded" : ""}`}>
        "The Tangue", alongside a number of other historic artworks from the
        fatherland have not found home yet. These artifacts remain scattered
        across various countries, awaiting their rightful return to their
        homeland.{" "}
        <span onClick={handleToggle} className="toggle-text">
          {isExpanded ? "See less" : "See more"}
        </span>
      </p>
      <button className="show-translation">Show Translation</button>
    </div>
  );
};

export default BlogMessage;
