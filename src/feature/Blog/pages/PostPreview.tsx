import React from 'react'
import Topbar from '../../../components/atoms/Topbar/Topbar';
import CreatePostTopBar from '../components/CreatePostTopBar';
import "../styles/Create.scss";
import PostDetail from '../../../components/molecules/sidebar/PostDetail';

const PostPreview:React.FC = () => {
  return (
    <div className="">
      <Topbar>
        <CreatePostTopBar />
      </Topbar>

      <div className="mt-10 flex justify-center">
       <PostDetail/>
      </div>
    </div>
  );
}

export default PostPreview