import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/molecules/sidebar/Sidebar';
import { AuthContext } from '../../../context/AuthContext/authContext';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import '../styles/Create.scss';

const CreatePost: React.FC = () => {
  const { checkTokenExpiration } = useContext(AuthContext);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const editorRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, nextFocus: () => void) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextFocus();
    }
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
        <CreatePostTopBar />
        <div className="md:px-4">
          <ImageSection />
          <div
            className="mx-auto my-2 max-w-full mt-3"
            style={{
              maxWidth: 1024,
            }}>
            <textarea
              style={{
                scrollbarGutter: 'stable',
              }}
              placeholder="Enter your title here..."
              className="w-full mb-0 text-3xl font-light font-instrumentSerif border-none outline-none bg-transparent placeholder-gray-500"
              value={title}
              rows={2}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, () => document.getElementById('subtitle')?.focus())}
            />
            <textarea
              id="subtitle"
              placeholder="Enter your subtitle here..."
              className="w-full mb-2 text-lg font-normal font-inter border-none outline-none bg-transparent placeholder-gray-400"
              value={subtitle}
              rows={2}
              onChange={(e) => setSubtitle(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, () => editorRef?.current?.editor?.commands?.focus())}
            />
          </div>
          <div id="editor">
            <TipTapRichTextEditor handleContentChange={setContent} editorRef={editorRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
