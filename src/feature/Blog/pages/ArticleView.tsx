import React, { useEffect, useRef, useState } from 'react';
import { LuFile } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Editor } from 'reactjs-tiptap-editor';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { PREVIEW_SLUG } from '../../../constants';
import BlogReactionStats from '../components/BlogComponents/BlogReactionStats';
import CreatePostTopBar from '../components/CreatePostTopBar';
import TipTapRichTextEditor from '../components/TipTapRichTextEditor';
import useDraft from '../hooks/useDraft';
import '../styles/view.scss';

const ArticleView: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid } = useParams(); // use to fetch article from db
  const [title, setTitle] = useState<string>('Sample Article Headig lorem ipsum dolor sit amet');
  const [description, setDescription] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('');
  const [isDraft, setIsDraft] = useState<boolean>(true);
  const { loadDraftArticle } = useDraft();
  const editorRef = useRef<{ editor: Editor | null }>(null);
  // const { mutate: updateArticle } = useUpdateArticle();
  useEffect(() => {
    if (articleUid == PREVIEW_SLUG) {
      const article = loadDraftArticle();
      if (!article) {
        toast.error('No draft article found.');
        navigate('/posts/create');
        return;
      }
      setTitle(article.title);
      setDescription(article.subtitle);
      setHtmlArticleContent(article.content);
    } else {
      setIsDraft(false);
    }
  }, [articleUid]);

  useEffect(() => {
    if (editorRef.current?.editor) {
      editorRef.current.editor.commands.setContent(htmlArticleContent);
    }
  }, [htmlArticleContent]);

  return (
    <div className="">
      <Topbar>
        <CreatePostTopBar title={title} mainAction={{ label: 'Publish', onClick: () => {} }} actions={[]} />
      </Topbar>
      <div className="w-full h-full mb-10">
        <div className="mt-10 flex flex-col justify-center items-center">
          <div className="w-2/3 px-8 flex gap-4 mb-4">
            {isDraft && (
              <span className="text-sm font-semibold mr-4 px-4 py-1 bg-foreground text-primary-500 rounded-full flex gap-2 items-center">
                <LuFile className="size-4" />
                Draft
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4 items-left">
            <h1 className="text-4xl ml-20 font-semibold leading-tight mb-4">{title}</h1>
            <div className="text-xl ml-20 mb-2">{description}</div>
            {/* {!isDraft && <BlogProfile user={user} date={new Date().toISOString()} article_id={articleUid!} title={title} content={htmlArticleContent} />} */}
            <div id=" " className="mb-20 ">
              <TipTapRichTextEditor
                initialContent={htmlArticleContent}
                handleContentChange={setHtmlArticleContent}
                editorRef={editorRef}
                disabled={true}
                hideToolbar={true}
                hideBubble={true}
              />
            </div>
          </div>
        </div>
        {!isDraft && (
          <div className="stats mx-auto">
            <div className="flex justify-center">
              <BlogReactionStats article_id={articleUid!} date={new Date().toISOString()} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleView;
