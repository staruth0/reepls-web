import React from 'react';
import { LuLoader } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import Topbar from '../../components/atoms/Topbar/Topbar';
import PostDetail from '../../components/molecules/sidebar/PostDetail';
import BlogProfile from '../Blog/components/BlogComponents/BlogProfile';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import { useGetUserById } from '../Profile/hooks';
import Communique from './components/Communique/Communique';
const ArticleRead: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetArticleById(id!); //todo: add error checking
  const { user } = useGetUserById(data?.author_id);

  return (
    <div className={`grid grid-cols-[4fr_1.75fr] `}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts border-r-[1px] border-neutral-500 pb-10">
        <Topbar>{user?.username}</Topbar>
        {isLoading ? (
          <LuLoader className="animate-spin text-primary-400 text-2xl m-4" />
        ) : (
          <div className="px-20 mt-10">
            <BlogProfile
              user={data?.author_id}
              content={data?.content}
              title={data?.title}
              date={data?.createdAt}
              article_id={id!}
            />
            <div className="mt-4">
              <PostDetail content={data?.content} title={data?.title} />
            </div>
          </div>
        )}
      </div>

      {/* Communique Section */}
      <div className="communique flex flex-col">
        <Communique />
      </div>
    </div>
  );
};

export default ArticleRead;
