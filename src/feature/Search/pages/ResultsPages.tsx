import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import { useUser } from '../../../hooks/useUser';
import { Article } from '../../../models/datamodels';
import BlogPost from '../../Blog/components/BlogPost';
import BlogSkeletonComponent from '../../Blog/components/BlogSkeleton';
import Communique from '../../Feed/components/Communique/Communique';
import SearchTopBar from '../components/SearchTopBar';
import { useGetSearchResults, useStoreSearchSuggestion } from '../hooks';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const { data: results, isPending, error } = useGetSearchResults(query || '');
  const { authUser } = useUser();
  const { mutate } = useStoreSearchSuggestion();

  useEffect(() => {
    if (!authUser || !query || !authUser?.id) return;
    mutate(
      {
        userid: authUser?.id || '',
        searchSuggestions: query || '',
      },
      {
        onSuccess: () => {
          console.log('Search suggestion saved successfully');
        },
      }
    );

    if (results) console.log(results);
  }, [query, authUser, mutate, results]);

  // Render loading state
  if (isPending) {
    return (
      <div className="grid font-roboto grid-cols-[4fr_1.65fr]">
        <div className="search border-r-[1px] border-neutral-500">
          <Topbar>
            <SearchTopBar initialSearchTerm={query || ''} />
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
              results.map((article: Article) => (
                <BlogPost
                  key={article._id}
                  isArticle={article.isArticle!}
                  media={article.media!}
                  title={article.title!}
                  content={article.content!}
                  user={article.author_id!}
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
