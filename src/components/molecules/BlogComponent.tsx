import React from 'react';
import BlogPost from './BlogPost';
import './index.scss';

const BlogComponent: React.FC = () => {
  return (
    <div className="blog__component">
      <BlogPost />
      <BlogPost />
    </div>
  );
};

export default BlogComponent;