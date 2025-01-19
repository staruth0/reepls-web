import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { PREVIEW_SLUG } from '../../../constants';
import CreatePostTopBar from '../components/CreatePostTopBar';
import '../styles/view.scss';
const ArticleView: React.FC = () => {
  const navigate = useNavigate();
  const { articleUid } = useParams(); // use to fetch article from db
  const [title, setTitle] = useState<string>('Sample Article Headig lorem ipsum dolor sit amet');
  const [description, setDescription] = useState<string>('');
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('');

  useEffect(() => {
    if (articleUid == PREVIEW_SLUG) {
      const articleData = localStorage.getItem('articleDraft') as string;
      if (!articleData) {
        navigate('/posts/create');
      }
      let article = JSON.parse(articleData);
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

      <div className="mt-10 flex justify-center">
        <div className="relative block max-w-3xl mx-20">
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
    </div>
  );
};

export default ArticleView;
