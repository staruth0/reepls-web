import moment from 'moment';
import React from 'react';
import { LuLoader } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import Topbar from '../../components/atoms/Topbar/Topbar';
import PostDetail from '../../components/molecules/sidebar/PostDetail';
import BlogProfile from '../Blog/components/BlogComponents/BlogProfile';
import { useGetArticleById } from '../Blog/hooks/useArticleHook';
import { useGetUserById } from '../Profile/hooks';
import Communique from './components/Communique/Communique';

const PostView: React.FC = () => {
  const { id } = useParams();
  const { data: article, isPending } = useGetArticleById(id!); //todo: add error checking
  const { user } = useGetUserById(article?.author_id);

  return (
    <div className={`grid grid-cols-[4fr_1.75fr] `}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts border-r-[1px] border-neutral-500 pb-10">
        <Topbar>
          Post by {user?.username || 'Unknown'} {moment(article?.createdAt ?? Date.now()).fromNow()}
        </Topbar>
        {isPending ? (
          <LuLoader className="animate-spin text-primary-400 text-2xl m-4" />
        ) : (
          <div className="px-20 mt-10">
            <BlogProfile
              user={article?.author_id}
              content={article?.content ?? ''}
              title={article?.title ?? ''}
              date={article?.createdAt ?? ''}
              article_id={id!}
              isArticle={article?.isArticle ?? false}
            />
            <div className="mt-4">
              <PostDetail content={article?.content ?? ''} title={article?.title ?? ''} />
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

export default PostView;
