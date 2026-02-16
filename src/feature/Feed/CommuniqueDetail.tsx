import React from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import Communique from './components/Communique/Communique';

import { LuLoader } from 'react-icons/lu';
import { useParams, useNavigate } from 'react-router-dom';
import PostDetail from '../../components/molecules/sidebar/PostDetail';
import BlogProfile from '../Blog/components/BlogComponents/BlogProfile';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import './feed.scss';

const CommuniqueDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useGetArticleById(id!);

  // Handle error state
  if (error) {
    return (
      <div className={`grid grid-cols-[4fr_1.75fr] `}>
        <div className="Feed__Posts border-r-[1px] border-neutral-500 pb-10">
          <Topbar>Communique</Topbar>
          <div className="px-20 mt-10 text-center">
            <p className="text-red-400 text-lg mb-4">Failed to load communique</p>
            <button
              onClick={() => navigate(-1)}
              className="text-primary-400 hover:text-primary-500 underline"
            >
              Go back
            </button>
          </div>
        </div>
        <div className="communique bg-background flex flex-col">
          <Communique />
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-[4fr_1.75fr] `}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts border-r-[1px] border-neutral-500 pb-10">
        <Topbar>Communique</Topbar>
        {isLoading ? (
          <LuLoader className="animate-spin text-primary-400 text-4xl mt-4" />
        ) : !article ? (
          <div className="px-20 mt-10 text-center">
            <p className="text-neutral-400 text-lg">Article not found</p>
            <button
              onClick={() => navigate(-1)}
              className="text-primary-400 hover:text-primary-500 underline mt-4"
            >
              Go back
            </button>
          </div>
        ) : (
          <div className="px-20 mt-10">
            <BlogProfile
              user={article?.author_id}
              content={article?.content}
              title={article?.title}
              date={article?.createdAt}
              article_id={id!}
              isArticle={article?.isArticle ?? false}
              article={article}
            />
            <div className="mt-4">
              <PostDetail content={article?.content} title={article?.title} />
            </div>
          </div>
        )}
      </div>

      {/* Communique Section */}
      <div className="communique bg-background flex flex-col">
        <Communique />
      </div>
    </div>
  );
};

export default CommuniqueDetail;
