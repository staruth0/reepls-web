import React from "react";
import Topbar from "../../components/atoms/Topbar/Topbar";
import Communique from "./components/Communique/Communique";

import BlogProfile from "../Blog/components/BlogComponents/BlogProfile";
import PostDetail from "../../components/molecules/sidebar/PostDetail";
import "./feed.scss";
import { useParams } from "react-router-dom";
import { useGetArticleById } from "../Blog/hooks/useArticleHook";

const CommuniqueDetail: React.FC = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetArticleById(id!); //todo: add error checking

  return (
    <div className={`grid grid-cols-[4fr_1.75fr] `}>
      {/* Feed Posts Section */}
      <div className="Feed__Posts border-r-[1px] border-neutral-500 pb-10">
        <Topbar>Communique</Topbar>
        {isLoading ? (
          <div> loading.....</div>
        ) : (
          <div className="px-20 mt-10">
            <BlogProfile id={data?.author_id} date={data?.createdAt} article_id={id!} />
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

export default CommuniqueDetail;
