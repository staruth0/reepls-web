import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuEye, LuSave, LuShare, LuTag } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { type Editor } from 'reactjs-tiptap-editor';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { Article } from '../../../models/datamodels';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import { useCreateArticle } from '../hooks/useArticleHook';
import useDraft from '../hooks/useDraft';

const CreatePost: React.FC = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  // const { checkTokenExpiration } = useContext(AuthContext);
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const { saveDraftArticle, loadDraftArticle, clearDraftArticle } = useDraft();

  const { mutate: createArticle, isPending } = useCreateArticle();

  // const [isSaving, setIsSaving] = useState(false);
  const [initialEditorContent, setInitialEditorContent] = useState<{
    title: string;
    subtitle: string;
    content: string;
  }>({
    title: '',
    subtitle: '',
    content: '',
  });

  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  // const editorRef = useRef<any>(null);
  const editorRef = useRef<{ editor: Editor | null }>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      label: 'Preview',
      disabled: false,
      ActionIcon: LuEye,
      onClick: () => {
        saveDraftArticle({ title, subTitle, content });
        navigate('/posts/article/preview');
      },
    },
    {
      label: 'Schedule',
      disabled: false,
      ActionIcon: LuCalendar,
      onClick: () => {
        console.log(editorRef.current?.editor?.getText());
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
    if (!title || !subTitle || !content) {
      toast.error('Please provide a title, subtitle and content.', {
        autoClose: 1500,
      });
      return;
    }
    const media = thumbnailUrl ? [thumbnailUrl] : [];
    const article: Article = {
      title,
      subTitle,
      content,
      media,
      status: 'Published',
      type: 'LongForm',
      isArticle: true,
    };
    const toastId = toast.info('Publishing the article...', {
      isLoading: true,
      autoClose: false,
    });
    createArticle(article, {
      onSuccess: () => {
        toast.update(toastId, {
          render: 'Article created successfully',
          type: 'success',
          isLoading: false,
          autoClose: 1500,
        });
        navigate('/feed');
        clearDraftArticle();
      },
      onError: (error) => {
        toast.update(toastId, {
          render: 'Error creating article: ' + error,
          type: 'error',
          isLoading: false,
          autoClose: 1500,
        });
      },
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, nextFocus: () => void) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextFocus();
    }
  };

  useEffect(() => {
    if (hasLoadedDraft) return;
    const draftArticle = loadDraftArticle();
    if (draftArticle) {
      setInitialEditorContent(draftArticle);
      console.log({ initialEditorContent });
      setTitle(draftArticle.title);
      setSubTitle(draftArticle.subTitle);
      setContent(draftArticle.content);
      // editorRef.current?.editor?.commands?.setContent(draftArticle.content);
    }

    setHasLoadedDraft(true);
  }, []);

  useEffect(() => {
    if (hasLoadedDraft && editorRef.current?.editor) {
      setContent(initialEditorContent.content);
      editorRef.current?.editor?.commands?.setContent(initialEditorContent.content);
    }
  }, [hasLoadedDraft, initialEditorContent]);

  useEffect(() => {
    if (!hasLoadedDraft) return;
    saveDraftArticle({ title, subTitle, content });
  }, [title, subTitle, content]);

  // const isLoggedOut = checkTokenExpiration();

  // useEffect(() => {
  //   console.log(content);
  //   console.log(title);
  //   console.log(subTitle);
  //   console.log(thumbnailUrl);
  //   if (isLoggedOut) {
  //     navigate('/auth');
  //   }
  // }, [isLoggedOut]);

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
                disabled={!hasLoadedDraft}
              />
              <textarea
                id="subtitle"
                placeholder={t(`Enter your subtitle here...`)}
                className="resize-none w-full h-auto mb-0 text-lg font-medium font-inter border-none outline-none bg-transparent placeholder-gray-400"
                value={subTitle}
                rows={2}
                onChange={(e) => setSubTitle(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => editorRef?.current?.editor?.commands?.focus())}
                disabled={!hasLoadedDraft}
              />
            </div>
          </div>
          <div id="editor relative" className="mb-20">
            <TipTapRichTextEditor
              initialContent={content}
              handleContentChange={setContent}
              editorRef={editorRef}
              disabled={!hasLoadedDraft}
              className="block max-w-full bg-primary-100 static mx-auto my-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
