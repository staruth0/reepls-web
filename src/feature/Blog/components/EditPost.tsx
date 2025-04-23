import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCalendar, LuEye, LuSave, LuShare, LuTag } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useGetArticleById, useUpdateArticle } from '../hooks/useArticleHook';

const EditPost: React.FC = () => {
  const { authUser, isLoggedIn } = useUser();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isCommunique, setIsCommunique] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams(); 
  const articleId = id;
  const { data: article, isLoading: isFetchingArticle } = useGetArticleById(articleId || '');
  const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticle();

  // Actions similar to CreatePost, adjusted for editing
  const actions = [
    {
      label: 'Preview',
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuEye,
      onClick: () => {
        if (!isLoggedIn) return;
        navigate(`/posts/article/preview?id=${articleId}`); // Pass ID to preview if needed
      },
    },
    {
      label: 'Schedule',
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuCalendar,
      onClick: () => {
        toast.info('Scheduling is not available yet', { autoClose: 1500 });
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
      disabled: !isLoggedIn || isUpdating,
      ActionIcon: LuSave,
      onClick: () => {
        if (!isLoggedIn) return;
        toast.info('Draft saving not implemented for editing yet', { autoClose: 1500 });
      },
    },
    {
      label: 'Add Tags',
      ActionIcon: LuTag,
      disabled: true,
      onClick: () => {
        toast.info('Adding tags is not available yet', { autoClose: 1500 });
      },
    },
  ];

  // Populate fields with fetched article data
  useEffect(() => {
    if (article && isFetchingArticle === false) {
      setTitle(article.title || '');
      setSubtitle(article.subtitle || '');
      setContent(article.content || '');
      setHtmlContent(article.htmlContent || '');
      setMedia(article.media || []);
      setIsCommunique(article.is_communiquer || false);
      // If there's a thumbnail in media, we could set it here (assuming first image is thumbnail)
      const thumbnailMedia = article.media?.find((m:MediaItem) => m.type === MediaType.Image);
      if (thumbnailMedia) {
        // Note: We can't set a File directly from a URL; this would need a fetch if editable
        // For now, we'll assume thumbnail editing starts fresh unless you have a File blob
      }
      setIsLoading(false);
    }
  }, [article, isFetchingArticle]);

  // Set editor content once loaded
  useEffect(() => {
    if (!isLoading && editorRef.current?.editor) {
      setTimeout(() => {
        editorRef.current?.editor?.commands?.setContent(htmlContent);
      }, 0);
    }
  }, [isLoading, htmlContent]);

  const onUpdate = async () => {
    if (!isLoggedIn || !articleId) return;
    if (!title || !subtitle || !content) {
      toast.error(t('Please provide a title, subtitle, and content.'), { autoClose: 1500 });
      return;
    }

    let updatedMedia = [...media];
    if (thumbnail && authUser?.id) {
      const url = await uploadArticleThumbnail(authUser.id, thumbnail);
      updatedMedia = [{ url, type: MediaType.Image }, ...media];
    }

    const updatedArticleData: Article = {
      _id: articleId,
      title,
      subtitle,
      content,
      htmlContent,
      media: updatedMedia,
      status: 'Published',
      type: 'LongForm',
      isArticle: true,
      is_communiquer:isCommunique,
    };

    const toastId = toast.info(t('Updating the article...'), { isLoading: true, autoClose: false });
    updateArticle(
      { articleId, article: updatedArticleData }, // Match the expected type
      {
        onSuccess: () => {
          toast.update(toastId, {
            render: t('Article updated successfully'),
            type: 'success',
            isLoading: false,
            autoClose: 1500,
          });
          navigate(`/posts/article/slug/${article?.slug || articleId}`); // Navigate to article page
        },
        onError: (error: any) => {
          toast.update(toastId, {
            render: t('Error updating article: ') + (error?.response?.data?.message || error?.message),
            type: 'error',
            isLoading: false,
            autoClose: 1500,
          });
        },
      }
    );
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>, nextFocus: () => void) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      nextFocus();
    }
  };

  if (!articleId) {
    return <div className="text-center mt-10">No article ID provided</div>;
  }

  return (
    <div className="relative min-h-screen">
      <Topbar>
        <CreatePostTopBar
          title={t('Edit Article')}
          mainAction={{ label: 'Update', onClick: onUpdate }}
          actions={actions}
          isCommunique={isCommunique}
          onToggleCommunique={setIsCommunique}
        />
      </Topbar>

      <div className="mt-10">
        {isLoggedIn ? (
          isFetchingArticle || isLoading ? (
            <div className="text-center mt-10">Loading article...</div>
          ) : (
            <div className=" sm:max-w-xl md:max-w-4xl  m-auto md:px-4">
              <ImageSection onImageChange={(image) => setThumbnail(image as File)} />
              <div className=" mt-5">
                <div className=" px-5 sm:px-0">
                  <textarea
                    placeholder={t('Enter your title here...')}
                    className="resize-none w-full  mb-2 text-[20px] sm:text-3xl font-semibold font-instrumentSerif border-none outline-none bg-transparent placeholder-gray-500"
                    value={title}
                    rows={2}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => document.getElementById('subtitle')?.focus())}
                    disabled={isUpdating}
                  />
                  <textarea
                    id="subtitle"
                    placeholder={t('Enter your subtitle here...')}
                    className="resize-none w-full h-auto mb-0 text-lg font-medium font-inter border-none outline-none bg-transparent placeholder-gray-400"
                    value={subtitle}
                    rows={2}
                    onChange={(e) => setSubtitle(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, () => editorRef?.current?.editor?.commands?.focus())}
                    disabled={isUpdating}
                  />
                </div>
              </div>
              <div id="editor" className=" mb-20">
                <TipTapRichTextEditor
                  initialContent={htmlContent}
                  handleContentChange={setContent}
                  editorRef={editorRef}
                  handleMediaUpload={(url, type) => setMedia([{ url, type }, ...media])}
                  handleHtmlContentChange={setHtmlContent}
                  disabled={isUpdating}
                  className="block max-w-full bg-primary-100 static mx-auto my-1"
                />
              </div>
            </div>
          )
        ) : (
          <AuthPromptPopup text={t('edit a post')} />
        )}
      </div>
    </div>
  );
};

export default EditPost;