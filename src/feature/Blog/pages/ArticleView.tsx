import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { PREVIEW_SLUG } from '../../../constants';
import BlogReactionStats from '../components/BlogComponents/BlogReactionStats';
import CreatePostTopBar from '../components/CreatePostTopBar';
import useDraft from '../hooks/useDraft';
import '../styles/view.scss';
const ArticleView: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid } = useParams(); // use to fetch article from db
  const [title, setTitle] = useState<string>('Sample Article Headig lorem ipsum dolor sit amet');
  const [description, setDescription] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('');
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const { loadDraftArticle } = useDraft();
  useEffect(() => {
    if (articleUid == PREVIEW_SLUG) {
      const article = loadDraftArticle();
      if (!article) {
        toast.error('No draft article found.');
        navigate('/posts/create');
      }
      setIsDraft(true);
      setTitle(article.title);
      setDescription(article.subtitle);
      setHtmlArticleContent(article.content);
    }
  }, [articleUid]);
  return (
    <div className="">
      <Topbar>
        <CreatePostTopBar title={title} mainAction={{ label: 'Publish', onClick: () => {} }} actions={[]} />
      </Topbar>
      <div className="w-full h-full mb-10">
        <div className="mt-10 flex justify-center">
          <div className="block max-w-3xl mx-20">
            <h1 className="text-4xl font-semibold leading-tight mb-4">
              {title || <div className="skeleton-loader h-10 w-3/4"></div>}
            </h1>
            <div className="text-xl mb-8">{description || <div className="skeleton-loader h-6 w-full"></div>}</div>
            <div className="article-content">
              {htmlArticleContent ? (
                <div dangerouslySetInnerHTML={{ __html: htmlArticleContent }} />
              ) : (
                <div className="skeleton-loader h-96 w-full"></div>
              )}
            </div>
          </div>
        </div>
        {isDraft && (
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
