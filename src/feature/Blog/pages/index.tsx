import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuEye, LuSave, LuShare, LuTag } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { type Editor } from 'reactjs-tiptap-editor';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { useUser } from '../../../hooks/useUser';
import { Article, MediaItem, MediaType } from '../../../models/datamodels';
import { uploadArticleThumbnail } from '../../../utils/media';
import AuthPromptPopup from '../../AnonymousUser/components/AuthPromtPopup';
import CreatePostTopBar from '../components/CreatePostTopBar';
import ImageSection from '../components/ImageSection';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
// import { useCreateArticle } from '../hooks/useArticleHook';
import useDraft from '../hooks/useDraft';
import { useSendNewArticleNotification } from '../../Notifications/hooks/useNotification';

const CreatePost: React.FC = () => {
  const { authUser, isLoggedIn } = useUser();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isCommunique, setIsCommunique] = useState<boolean>(false);
  const { saveDraftArticle, loadDraftArticle, clearDraftArticle } = useDraft();
  const { mutate: createArticle } = useSendNewArticleNotification();
  const [initialEditorContent, setInitialEditorContent] = useState<{
    title: string;
    subtitle: string;
    content: string;
    htmlContent: string;
    isCommunique: boolean;
  }>({
    title: '',
    subtitle: '',
    content: '',
    htmlContent: '',
    isCommunique: false,
  });
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      label: 'Preview',
      disabled: !isLoggedIn,
      ActionIcon: LuEye,
      onClick: () => {
        if (!isLoggedIn) return;
        saveDraftArticle({ title, subtitle, content, htmlContent, media, isCommunique });
        navigate('/posts/article/preview');
      },
    },
    {
      label: 'Schedule',
      disabled: !isLoggedIn,
      ActionIcon: LuCalendar,
      onClick: () => {
        toast.info('Scheduling is not available yet', {
          autoClose: 1500,
        });
      },
    },
    {
      label: 'Share',
      disabled: true,
      ActionIcon: LuShare,
      onClick: () => {
        if (!isLoggedIn) return;
        console.log('Sharing the post...');
      },
    },
    {
      label: 'Save Draft',
      disabled: !isLoggedIn,
      ActionIcon: LuSave,
      onClick: () => {
        if (!isLoggedIn) return;
        console.log('Saving the draft...');
      },
    },
    {
      label: 'Add Tags',
      ActionIcon: LuTag,
      disabled: true,
      onClick: () => {
        toast.info('Adding tags is not available yet', {
          autoClose: 1500,
        });
      },
    },
  ];

  const onPublish = async () => {
    if (!isLoggedIn) return;
    if (!title || !subtitle || !content) {
      toast.error(t('Please provide a title, subtitle and content.'), {
        autoClose: 1500,
      });
      return;
    }

    if (thumbnail && authUser?.id) {
      const url = await uploadArticleThumbnail(authUser?.id, thumbnail);
      setMedia([{ url, type: MediaType.Image }, ...media]);
    }

    const article: Article = {
      title,
      subtitle,
      content,
      htmlContent,
      media,
      status: 'Published',
      type: 'LongForm',
      isArticle: true,
      is_communiquer:isCommunique,
    };
    const toastId = toast.info(t('Publishing the article...'), {
      isLoading: true,
      autoClose: false,
    });
    createArticle(article, {
      onSuccess: () => {
        toast.update(toastId, {
          render: t('Article created successfully'),
          type: 'success',
          isLoading: false,
          autoClose: 1500,
        });
        navigate('/feed');
        clearDraftArticle();
      },
      onError: (error) => {
        toast.update(toastId, {
          render: t('Error creating article: ') + error,
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
      setInitialEditorContent({
        title: draftArticle.title,
        subtitle: draftArticle.subtitle,
        content: draftArticle.content,
        htmlContent: draftArticle.htmlContent,
        isCommunique: draftArticle.isCommunique || false,
      });
      setTitle(draftArticle.title);
      setSubtitle(draftArticle.subtitle);
      setContent(draftArticle.content);
      setHtmlContent(draftArticle.htmlContent);
      setMedia(draftArticle.media);
      setIsCommunique(draftArticle.isCommunique || false);
    }
    setHasLoadedDraft(true);
  }, []);

  useEffect(() => {
    if (hasLoadedDraft && editorRef.current?.editor) {
      setContent(initialEditorContent.content);
      setHtmlContent(initialEditorContent.htmlContent);
      setTimeout(() => {
        editorRef.current?.editor?.commands?.setContent(initialEditorContent.htmlContent);
      }, 0);
    }
  }, [hasLoadedDraft, initialEditorContent]);

  useEffect(() => {
    if (!hasLoadedDraft) return;
    saveDraftArticle({ title, subtitle, content, htmlContent, media, isCommunique });
  }, [title, subtitle, content, htmlContent, media, isCommunique]);

  return (
    <div className="relative min-h-screen">
      <Topbar>
        <CreatePostTopBar
          title={t('New Article')}
          mainAction={{ label: 'Publish', onClick: onPublish }}
          actions={actions}
          isCommunique={isCommunique}
          onToggleCommunique={setIsCommunique}
        />
      </Topbar>

      <div className="mt-10">
        {isLoggedIn ? (
          <div className="md:px-4">
            <ImageSection onImageChange={(image) => setThumbnail(image as File)} />
            <div className="mx-auto mt-3 px-5 sm:px-0 max-w-4xl">
              <div className="">
                <textarea
                  placeholder={t('Enter your title here...')}
                  className="resize-none w-full h-auto mb-2 text-3xl font-semibold font-instrumentSerif border-none outline-none bg-transparent placeholder-gray-500"
                  value={title}
                  rows={2}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => document.getElementById('subtitle')?.focus())}
                  disabled={!hasLoadedDraft}
                />
                <textarea
                  id="subtitle"
                  placeholder={t('Enter your subtitle here...')}
                  className="resize-none w-full h-auto mb-0 text-lg font-medium font-inter border-none outline-none bg-transparent placeholder-gray-400"
                  value={subtitle}
                  rows={2}
                  onChange={(e) => setSubtitle(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, () => editorRef?.current?.editor?.commands?.focus())}
                  disabled={!hasLoadedDraft}
                />
              </div>
            </div>
            <div id="editor" className="mb-20">
              <TipTapRichTextEditor
                initialContent={htmlContent}
                handleContentChange={setContent}
                editorRef={editorRef}
                handleMediaUpload={(url, type) => setMedia([{ url, type }, ...media])}
                handleHtmlContentChange={setHtmlContent}
                disabled={!hasLoadedDraft}
                className="block max-w-full bg-primary-100 static mx-auto my-1"
              />
            </div>
          </div>
        ) : (
          <AuthPromptPopup text={t('create a post')} />
        )}
      </div>
    </div>
  );
};

export default CreatePost;