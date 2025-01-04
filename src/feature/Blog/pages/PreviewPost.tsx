import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pics } from '../../../assets/images';
import Sidebar from '../../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../../context/AuthContext/authContext';
import CreatePostTopBar from '../components/CreatePostTopBar';
import '../styles/Create.scss';

const PreviewPost: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const navigate = useNavigate();

  const isLoggedOut = checkTokenExpiration();

  useEffect(() => {
    if (isLoggedOut) {
      navigate('/auth/login');
    }
  }, [isLoggedOut]);

  return (
    <div className="create__post__container">
      <Sidebar />
      <div className="content__container">
        <CreatePostTopBar />

        <div className="content__body content__body__preview__post">
          <div className="image__section__container">
            <img className="thumbnail__image" src={Pics.blogPic} alt="" />
          </div>
          <div className="content__title">
            The long, old case of looted art during German colonial rule resuscitates
          </div>
          <div className="content__sub__title">
            The Tangue, alongside a number of other historic artwork from the fatherland have not found home yet.
          </div>
          <div className="content__text">
            The Tangue people of Cameroon possess a rich cultural heritage, particularly renowned for their exquisite
            wooden sculptures. These sculptures, often depicting ancestral figures, spirits, and animals, are not only
            aesthetically pleasing but also hold deep spiritual significance within the Tangue culture.
            <br /> The repatriation of these looted Tangue sculptures is a pressing issue. Returning these artifacts to
            their rightful owners would allow the Tangue people to reconnect with their cultural heritage and to
            preserve their traditions for future generations. It would also contribute to a more just and
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPost;
