import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuEye, LuSave, LuShare, LuTag } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { AuthContext } from '../../../context/AuthContext/authContext';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import useDraft from '../hooks/useDraft';

const CreatePost: React.FC = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { checkTokenExpiration } = useContext(AuthContext);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const { saveDraftArticle, loadDraftArticle } = useDraft();

  const editorRef = useRef<any>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      label: 'Preview',
      disabled: false,
      ActionIcon: LuEye,
      onClick: () => {
        saveDraftArticle({ title, subtitle, content });
        navigate('/posts/article/preview/view');
      },
    },
    {
      label: 'Schedule',
      disabled: false,
      ActionIcon: LuCalendar,
      onClick: () => {
        console.log('Scheduling the post...');
      },
    },
    {
      label: 'Share',
      disabled: false,
      ActionIcon: LuShare,
      onClick: () => {
        console.log('Sharing the post...');
      },
    },
    {
      label: 'Save Draft',
      disabled: false,
      ActionIcon: LuSave,
      onClick: () => {
        console.log('Saving the draft...');
      },
    },
    {
      label: 'Add Tags',
      ActionIcon: LuTag,
      disabled: false,
      onClick: () => {
        console.log('Adding tags...');
      },
    },
  ];

  const onPublish = () => {
    console.log('Publishing the post...');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, nextFocus: () => void) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextFocus();
    }
  };

  useEffect(() => {
    loadDraftArticle();
    const interval = setInterval(() => {
      saveDraftArticle({ title, subtitle, content });
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  const isLoggedOut = checkTokenExpiration();

  useEffect(() => {
    console.log(content);
    console.log(title);
    console.log(subtitle);
    console.log(thumbnailUrl);
    if (isLoggedOut) {
      navigate('/auth');
    }
  }, [isLoggedOut]);

  return (
    <div className="">
      <Topbar>
        <CreatePostTopBar
          title={t(`New Article`)}
          mainAction={{ label: 'Publish', onClick: onPublish }}
          actions={actions}
        />
      </Topbar>

      <div className="mt-10">
        <div className="md:px-4">
         <ImageSection onImageChange={setThumbnailUrl} />
          <div className="mx-auto mt-3 pl-20 max-w-5xl">
            <div className="">
              <textarea
                placeholder={t(`Enter your title here...`)}
                className="resize-none w-full h-auto mb-2 text-3xl font-semibold font-instrumentSerif border-none outline-none bg-transparent placeholder-gray-500"
                value={title}
                rows={2}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => document.getElementById('subtitle')?.focus())}
              />
              <textarea
                id="subtitle"
                placeholder={t(`Enter your subtitle here...`)}
                className="resize-none w-full h-auto mb-0 text-lg font-medium font-inter border-none outline-none bg-transparent placeholder-gray-400"
                value={subtitle}
                rows={2}
                onChange={(e) => setSubtitle(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => editorRef?.current?.editor?.commands?.focus())}
              />
            </div>
          </div>
          <div id="editor relative" className="mb-20">
            <TipTapRichTextEditor handleContentChange={setContent} editorRef={editorRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
