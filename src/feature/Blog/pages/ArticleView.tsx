import React, { useEffect, useRef, useState } from 'react';
import { LuFilePen } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Editor } from 'reactjs-tiptap-editor';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { PREVIEW_SLUG } from '../../../constants';
import BlogReactionStats from '../components/BlogComponents/BlogReactionStats';
import CreatePostTopBar from '../components/CreatePostTopBar';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import { useGetArticleById } from '../hooks/useArticleHook';
import useDraft from '../hooks/useDraft';
import '../styles/view.scss';

const ArticleView: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid } = useParams(); // use to fetch article from db
  const [title, setTitle] = useState<string>('*This article does not have a title*');
  const [subTitle, setSubTitle] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('*This article does not have any content*');
  const [isPreview, _] = useState<boolean>(articleUid === PREVIEW_SLUG);
  const { loadDraftArticle } = useDraft();
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const { data: article, isError, isPending } = useGetArticleById(articleUid!);
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
      setHtmlArticleContent(draftArticle.content);
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
        console.log('publish');
      } else {
        console.log('save');
      }
    },
  };

  return (
    <div className="">
      <Topbar>
        <CreatePostTopBar title={title} mainAction={mainAction} actions={[]} />
      </Topbar>
      <div className="max-w-full h-full mb-10 inline-block overflow-clip">
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
            {isPreview ? (
              <h1 className="text-5xl mx-20 font-semibold leading-tight mb-2">{title}</h1>
            ) : isPending ? (
              <h1 className="text-5xl mx-20 font-semibold leading-tight mb-2">Loading...</h1>
            ) : (
              <h1 className="text-5xl mx-20 font-semibold leading-tight mb-2">{title}</h1>
            )}

            {isPreview ? (
              <h3 className="text-3xl mx-20 mb-2">{subTitle}</h3>
            ) : isPending ? (
              <h3 className="text-3xl mx-20 mb-2">Loading...</h3>
            ) : (
              subTitle && <h3 className="text-xl mx-20 mb-2">{subTitle}</h3>
            )}

            {/** What goes here?
             * 1.Author's profile(name, avatar, bio, handle)
             * 2.Article's tags, published date, reading time, etc.
             * 3.Share, Save, Edit? buttons
             */}
            {/* {!isDraft && <BlogProfile user={user} date={new Date().toISOString()} article_id={articleUid!} title={title} content={htmlArticleContent} />} */}

            {/* <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img src={article?.author.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
                <p className="text-sm font-semibold">{article?.author.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">Published on {new Date().toISOString()}</p>
                <p className="text-sm font-semibold">Reading time {article?.readingTime}</p>
              </div>
            </div> */}

            <div id="article-content" className="w-full mb-20 ">
              <TipTapRichTextEditor
                initialContent={htmlArticleContent}
                handleContentChange={setHtmlArticleContent}
                editorRef={editorRef}
                disabled={true}
                hideToolbar={true}
                hideBubble={true}
                className="w-full block"
              />
            </div>
          </div>
        </div>
        {!isPreview && (
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
