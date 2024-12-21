import React, { useContext} from "react";
import ExpiredToken from "../../../components/atoms/Popups/ExpiredToken";
import { AuthContext } from "../../../context/authContext";
import Sidebar from "../../../components/molecules/sidebar/Sidebar";
import '../styles/Create.scss'
import CreatePostTopBar from "../components/CreatePostTopBar";
import CollapsableBar from "../components/CollapsableBar";
import ImageSection from "../components/ImageSection";
import InputPost from "../components/InputPost";

const CreatePost: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);

  return (
    <div className={`create__post__container`}>
      {checkTokenExpiration() && <ExpiredToken />}
      <Sidebar />
      <div className="content__container">
        <CreatePostTopBar />

        <div className="content__body">
          <ImageSection />
          <div className="input__container__wrapper">
            <InputPost
              inputType="text"
              placeholder="Title goes here..."
              className="input__title"
              title="Title"
            />
            <InputPost
              inputType="text"
              placeholder="SubTitle goes here..."
              className="input__sub__title"
              title="subTitle"
            />
            <InputPost
              inputType="textarea"
              placeholder="SubTitle goes here..."
              className="input__text__area"
              title="body"
            />
          </div>
        </div>
        <CollapsableBar />
      </div>
    </div>
  );
};

export default CreatePost;
