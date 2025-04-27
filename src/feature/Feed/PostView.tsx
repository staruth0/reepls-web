import moment from 'moment';
import React, { useState, useRef, useEffect } from 'react';
import { LuLoader } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import Topbar from '../../components/atoms/Topbar/Topbar';
import BlogProfile from '../Blog/components/BlogComponents/BlogProfile';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import { useGetUserById } from '../Profile/hooks';
import CommentSection from '../Comments/components/CommentSection';
import { User } from '../../models/datamodels';
import TipTapRichTextEditor from '../Blog/components/TipTapRichTextEditor';
import { Editor } from 'reactjs-tiptap-editor';
import { toast } from 'react-toastify';

const PostView: React.FC = () => {
  const { id } = useParams();
  const { data: article, isLoading, isError } = useGetArticleById(id!);
  const { user } = useGetUserById(article?.author_id);
  const editorRef = useRef<{ editor: Editor | null }>(null);
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('*This article does not have any content*');

  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState<boolean>(true);
  const toggleCommentSection2 = () => {
    setIsCommentSectionOpen(true);
  };

  useEffect(() => {
    if (article?.htmlContent) {
      setHtmlArticleContent(article.htmlContent);
    }
  }, [article]);

  useEffect(() => {
    if (isError) {
      toast.error('Error fetching article.');
    }
  }, [isError]);

  useEffect(() => {
    if (editorRef.current?.editor && htmlArticleContent) {
      setTimeout(() => {
        editorRef?.current?.editor?.commands.setContent(htmlArticleContent);
      }, 0);
    }
  }, [htmlArticleContent]);

  return (
    <div className={`grid`}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts  pb-10">
        <Topbar>
          Post by {user?.username || 'Unknown'} {moment(article?.createdAt ?? Date.now()).fromNow()}
        </Topbar>
        {isLoading ? (
          <LuLoader className="animate-spin text-primary-400 text-2xl m-4" />
        ) : (
          <div className="px-1 sm:px-8  md:px-10 mt-10">
            <BlogProfile
              user={article?.author_id}
              content={article?.content ?? ''}
              title={article?.title ?? ''}
              date={article?.createdAt ?? ''}
              article_id={id!}
              isArticle={article?.isArticle ?? false}
              article={article}
            />
            
            {/* Article Content with TipTap Editor */}
            <div id="article-content" className="w-full mb-5">
              <TipTapRichTextEditor
                initialContent={htmlArticleContent}
                editorRef={editorRef}
                disabled={true}
                hideToolbar={true}
                hideBubble={true}
                className="w-full block"
              />
            </div>
            {isCommentSectionOpen && (
              <CommentSection
                article_id={article?._id || ''}
                article={article}
                setIsCommentSectionOpen={toggleCommentSection2}
                author_of_post={article?.author_id as User}
              />
            )}
          </div>
        )}
      </div>

     
    </div>
  );
};

export default PostView;