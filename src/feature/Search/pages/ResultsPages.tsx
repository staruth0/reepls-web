import React from "react";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Communique from "../../Feed/components/Communique/Communique";
import SearchTopBar from "../components/SearchTopBar";
import { useParams } from "react-router-dom";
import { useGetSearchResults } from "../hooks";
import BlogSkeletonComponent from "../../Blog/components/BlogSkeleton";
import BlogPost from "../../Blog/components/BlogPost";
import { Article } from "../../../models/datamodels";

const ResultsPage: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const { data: results, isPending, error } = useGetSearchResults(query || ""); 

  // Render loading state
  if (isPending) {
    return (
      <div className="grid font-roboto grid-cols-[4fr_1.65fr]">
        <div className="search border-r-[1px] border-neutral-500">
          <Topbar>
            <SearchTopBar />
          </Topbar>
          <div className="flex flex-col items-center pb-8">
            <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col ">
              <BlogSkeletonComponent />
              <BlogSkeletonComponent />
            </div>
          </div>
        </div>
        <div className="communique hidden lg:block">
          <Communique />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="grid font-roboto grid-cols-[4fr_1.65fr]">
        <div className="search border-r-[1px] border-neutral-500">
          <Topbar>
            <SearchTopBar />
          </Topbar>
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col">
            <div className="text-red-500">Error: {error.message}</div>
          </div>
        </div>
        <div className="communique hidden lg:block">
          <Communique />
        </div>
      </div>
    );
  }

  // Render search results
  return (
    <div className="grid font-roboto grid-cols-[4fr_1.65fr]">
      <div className="search border-r-[1px] border-neutral-500">
        <Topbar>
          <SearchTopBar />
        </Topbar>
        <div className="flex flex-col items-center pb-8 ">
          <div className="px-1 sm:px-8 w-[98%] sm:w-[90%] transition-all duration-300 ease-linear flex flex-col-reverse gap-7 ">
            {results && results.length > 0 ? (
              results.map((article:Article) => (
                <BlogPost
                  key={article._id}
                  isArticle={article.isArticle!}
                  images={article.media!}
                  title={article.title!}
                  content={article.content!}
                  id={article.author_id!}
                  date={article.createdAt!}
                  article_id={article._id!}
                />
              ))
            ) : (
              <div>No results found for "{query}".</div>
            )}
          </div>
        </div>
      </div>
      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default ResultsPage;
