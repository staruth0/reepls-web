import React from 'react';
import Topbar from '../../components/atoms/Topbar/Topbar';
import Communique from './components/Communique/Communique';

import { LuLoader } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import PostDetail from '../../components/molecules/sidebar/PostDetail';
import BlogProfile from '../Blog/components/BlogComponents/BlogProfile';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import './feed.scss';

const CommuniqueDetail: React.FC = () => {
  const { id } = useParams();
  const { data: article, isLoading } = useGetArticleById(id!); //todo: add error checking

  return (
    <div className={`grid grid-cols-[4fr_1.75fr] `}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts border-r-[1px] border-neutral-500 pb-10">
        <Topbar>Communique</Topbar>
        {isLoading ? (
          <LuLoader className="animate-spin text-primary-400 text-4xl mt-4" />
        ) : (
          <div className="px-20 mt-10">
            <BlogProfile
              user={article?.author_id}
              content={article?.content}
              title={article?.title}
              date={article?.createdAt}
              article_id={id!}
              isArticle={article?.isArticle ?? false}
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
