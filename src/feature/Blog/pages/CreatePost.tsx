import React, { useContext, useState } from 'react';
import ExpiredToken from '../../../components/atoms/Popups/ExpiredToken';
import Sidebar from '../../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../../context/AuthContext/authContext';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import InputPost from '../components/InputPost';
import '../styles/Create.scss';

const CreatePost: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const [postType, setPostType] = useState<string>('regular post');

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPostType(event.target.value);
  };

  return (
    <div className="create__post__container">
      {checkTokenExpiration() && <ExpiredToken />}
      <Sidebar />
      <div className="content__container">
        <CreatePostTopBar postType={postType} handleSelectChange={handleSelectChange} />

        <div className="content__body">
          <ImageSection />
          {postType === 'Article' ? (
            <div className="input__container__wrapper">
              <InputPost inputType="text" placeholder="Title goes here..." className="input__title" title="Title" />
              <InputPost
                inputType="text"
                placeholder="Subtitle goes here..."
                className="input__sub__title"
                title="Subtitle"
              />
              <InputPost
                inputType="textarea"
                placeholder="Body goes here..."
                className="input__text__area"
                title="Body"
              />
            </div>
          ) : (
            <div className="input__container__wrapper">
              {/* <InputPost
                inputType="textarea"
                placeholder="Body goes here..."
                className="input__text__area"
                title="Body"
              /> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
