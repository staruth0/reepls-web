import React from 'react';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import PostDetail from '../../../components/molecules/sidebar/PostDetail';

import '../styles/Create.scss';

const PostPreview: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="">
      <Topbar>
       ''
      </Topbar>

      <div className="mt-10 flex justify-center">
        <PostDetail title={title}  />
      </div>
    </div>
  );
};

export default PostPreview;
