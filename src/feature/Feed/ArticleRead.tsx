import React from 'react'
import Topbar from '../../components/atoms/Topbar/Topbar';
import BlogProfile from '../Blog/components/BlogComponents/BlogProfile';
import PostDetail from '../../components/molecules/sidebar/PostDetail';
import Communique from './components/Communique/Communique';
import { useParams } from 'react-router-dom';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import { useGetUserById } from '../Profile/hooks';

const ArticleRead: React.FC = () => {
      const { id } = useParams();
    const { data, isLoading } = useGetArticleById(id!); //todo: add error checking
    const {user} = useGetUserById(data?.author_id)

  return (
    <div className={`grid grid-cols-[4fr_1.75fr] `}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts border-r-[1px] border-neutral-500 pb-10">
              <Topbar>{ user?.username}</Topbar>
        {isLoading ? (
          <div> loading.....</div>
        ) : (
          <div className="px-20 mt-10">
            <BlogProfile id={data?.author_id} date={data?.createdAt} />
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
}

export default ArticleRead