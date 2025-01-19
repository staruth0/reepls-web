import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { sampleArticle2 } from '../../../data';
import CreatePostTopBar from '../components/CreatePostTopBar';
import '../styles/view.scss';
const ArticleView: React.FC = () => {
  const { articleUid } = useParams(); // use to fetch article from db
  const [title, setTitle] = useState<string>('Sample Article Headig lorem ipsum dolor sit amet');
  const [description, setDescription] = useState<string>(
    'Sample Article Description lorem ipsum dolor sit amet and consectetur adipiscing elit'
  );
  const [htmlArticleContent, setHtmlArticleContent] = useState<string>('');

  useEffect(() => {
    if (articleUid == 'preview') {
      setHtmlArticleContent(sampleArticle2);
    }
  }, [articleUid]);
  return (
    <div className="">
      <Topbar>
        <CreatePostTopBar />
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
