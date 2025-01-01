import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../../context/AuthContext/authContext';
import { PostType } from '../../../types';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import InputPost from '../components/InputPost';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import '../styles/Create.scss';

const CreatePost: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const [postType, setPostType] = useState<PostType>('regular_post');
  const navigate = useNavigate();
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPostType(event.target.value as PostType);
  };

  const isLoggedOut = checkTokenExpiration();

  useEffect(() => {
    if (isLoggedOut) {
      navigate('/auth');
    }
  }, [isLoggedOut]);

  return (
    <div className="create__post__container">
      <Sidebar />
      <div className="content__container">
        <CreatePostTopBar postType={postType} handleSelectChange={handleSelectChange} />

        <div className="content__body">
          <ImageSection />
          <div className="input__container__wrapper">
            <InputPost inputType="text" placeholder="Title goes here..." className="input__title" title="Title" />
            <InputPost
              inputType="text"
              placeholder="Subtitle goes here..."
              className="input__sub__title"
              title="Subtitle"
            />
          </div>
          <TipTapRichTextEditor />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
