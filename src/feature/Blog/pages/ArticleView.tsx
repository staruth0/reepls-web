import React, { useEffect, useRef, useState } from 'react';
import { LuFilePen } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Editor } from 'reactjs-tiptap-editor';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { PREVIEW_SLUG } from '../../../constants';
import { Article } from '../../../models/datamodels';
import { useSaveArticle } from '../../Saved/hooks';
import BlogReactionStats from '../components/BlogComponents/BlogReactionStats';
import CreatePostTopBar from '../components/CreatePostTopBar';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import { useCreateArticle, useGetArticleById } from '../hooks/useArticleHook';
import useDraft from '../hooks/useDraft';
import '../styles/view.scss';
import ArticleViewSkeleton from './ArticleViewSkeleton';

const ArticleView: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid } = useParams(); // use to fetch article from db
  const [title, setTitle] = useState<string>('*This article does not have a title*');
  const [subTitle, setSubTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('*This article does not have any content*');
  const [media, setMedia] = useState<string[]>([]);
  const [isPreview, _] = useState<boolean>(articleUid === PREVIEW_SLUG);
  const { loadDraftArticle } = useDraft();
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const { mutate: createArticle } = useCreateArticle();
  const { mutate: saveArticle } = useSaveArticle();
  const { clearDraftArticle } = useDraft();
  const { data: article, isError, isPending } = useGetArticleById(articleUid!);

  const onPublish = async () => {
    if (!title || !subTitle || !content) {
      toast.error('Please provide a title, subtitle and content.', {
        autoClose: 1500,
      });
      return;
    }

    const article: Article = {
      title,
      subTitle,
      content,
      htmlContent: htmlArticleContent,
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

  const onSave = async () => {
    if (isPreview) return;
    saveArticle(articleUid!, {
      onSuccess: () => {
        toast.success('Article saved successfully');
      },
      onError: () => toast.error('Failed to save article'),
    });
  };

  useEffect(() => {
    if (articleUid == PREVIEW_SLUG) {
      const draftArticle = loadDraftArticle();
      if (!draftArticle) {
        toast.error('No draft article found.');
        navigate('/posts/create');
        return;
      }
      setTitle(draftArticle.title);
      setSubTitle(draftArticle.subTitle);
      setContent(draftArticle.content);
      setHtmlArticleContent(draftArticle.htmlContent);
      setMedia(draftArticle.media);
      console.log('draftArticle', draftArticle);
    }
  }, [articleUid]);

  useEffect(() => {
    if (article) {
      if (article.title) {
        setTitle(article.title);
      }
      if (article.subTitle) {
        setSubTitle(article.subTitle);
      }
      if (article.content) {
        setHtmlArticleContent(article.content);
      }
      if (article.htmlContent) {
        setContent(article.htmlContent);
      }
    }
  }, [article, isPending]);

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching article.');
      navigate('/posts/create');
    }
  }, [isError]);

  useEffect(() => {
    if (editorRef.current?.editor) {
      setTimeout(() => {
        editorRef?.current?.editor?.commands.setContent(htmlArticleContent);
      }, 0);
    }
  }, [htmlArticleContent]);

  const mainAction = {
    label: isPreview ? 'Publish' : 'Save',
    onClick: () => {
      if (isPreview) {
        onPublish();
      } else {
        onSave();
      }
    },
  };

  return (
    <div className="">
      <Topbar>
        <CreatePostTopBar title={title} mainAction={mainAction} actions={[]} />
      </Topbar>
      <div className="max-w-full h-full mb-10 inline-block overflow-clip">
        {!isPreview && isPending ? (
          <div className="max-w-full md:mx-20 mt-10 flex flex-col justify-center items-right">
            <ArticleViewSkeleton />
          </div>
        ) : (
          <div className="max-w-full md:mx-20 mt-10 flex flex-col justify-center items-left">
            <div className="mx-20 flex gap-4 mb-4">
              {/**
               * Info section
               * - Draft tag, in future stuff like (sponsored, featured, writer's pick, written by notable like govenment official, etc.)
               */}
              {isPreview && (
                <span className="text-sm font-semibold mr-4 px-4 py-1 bg-foreground text-primary-500 rounded-full flex gap-2 items-center">
                  <LuFilePen className="size-4" />
                  Draft
                </span>
              )}
            </div>
            <div className="max-w-full flex flex-col gap-4 items-left">
              <h1 className="text-5xl mx-20 font-semibold leading-tight mb-2">{title}</h1>
              {subTitle && <h3 className="text-xl mx-20 mb-2">{subTitle}</h3>}

              <div id="article-content" className="w-full mb-20">
                <TipTapRichTextEditor
                  initialContent={htmlArticleContent}
                  handleContentChange={setContent}
                  handleHtmlContentChange={setHtmlArticleContent}
                  editorRef={editorRef}
                  disabled={true}
                  hideToolbar={true}
                  hideBubble={true}
                  className="w-full block"
                />
              </div>
            </div>
          </div>
        )}
        {!isPreview && !isPending && (
          <div className="stats mx-auto">
            <div className="flex justify-center">
              <BlogReactionStats article_id={articleUid!} date={new Date().toISOString()} />
            </div>
          </div>
        )}
        {/**
         * comments section
         */}
      </div>
    </div>
  );
};

export default ArticleView;
