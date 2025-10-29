import React, { useContext, useEffect } from "react";
import { useGetSearchSuggestions } from "../hooks";
import { useUser } from "../../../hooks/useUser";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import SearchTopBar from "../components/SearchTopBar";
import Communique from "../../Feed/components/Communique/Communique";
import SuggestionContainer from "../components/SuggestionContainer";
import { SearchContainerContext } from "../../../context/suggestionContainer/isSearchcontainer";
import RecentSearchesSkeleton from "../components/RecentSearchComponent";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getBackendErrorMessage } from "../../../utils/errorHandler";
import MainContent from "../../../components/molecules/MainContent";

const Search: React.FC = () => {
  const { authUser } = useUser();
  const { data, isLoading, error } = useGetSearchSuggestions(authUser?.id || "");
  const { isSearchContainerOpen } = useContext(SearchContainerContext);
  const { t } = useTranslation();

  useEffect(() => {
    if (error) {
      const errorMessage = getBackendErrorMessage(error, t);
      toast.error(errorMessage);
    }
  }, [error, t]);

  // Loading state
  if (isLoading) {
    return (
      <MainContent> 
      <div className="lg:grid font-roboto grid-cols-[4fr_1.65fr] min-h-screen">
        <div className="search w-full lg:border-r-[1px] border-neutral-500">
          <Topbar>
         
            <SearchTopBar />
          </Topbar>
          <div className="px-5 md:px-10 lg:px-20 w-full flex flex-col">
            <div className="recent space-y-4 mt-8">
              <RecentSearchesSkeleton />
            </div>
          </div>
        </div>
        <div className="communique hidden lg:block">
          <Communique />
        </div>
      </div>
      </MainContent>
    );
  }

  // Error state
  if (error) {
    return (
      <MainContent> 
      <div className="lg:grid font-roboto grid-cols-[4fr_1.65fr] min-h-screen">
        <div className="search w-full lg:border-r-[1px] border-neutral-500">
          <Topbar>
          
            <SearchTopBar />
          </Topbar>
          <div className="px-5 md:px-10 lg:px-20 w-full flex flex-col">
            <div className="recent space-y-4 mt-8">
              <p className="text-neutral-50 text-center py-8">
                {error ? "An error occurred" : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="communique hidden lg:block">
          <Communique />
        </div>
      </div>
      </MainContent>
    );
  }

  // Success or empty state
  return (
    <MainContent> 
    <div className="lg:grid font-roboto grid-cols-[4fr_1.65fr] min-h-screen">
      <div className="search w-full lg:border-r-[1px] border-neutral-500">
        <Topbar>
       
          <SearchTopBar />
        </Topbar>
        
        <div className="px-5 md:px-10 lg:px-20 w-full flex flex-col">
          {!isSearchContainerOpen && (
            <div className="recent space-y-4 mt-8">
              {data?.searchHistory?.length > 0 ? (
                <>
                  <div className="mb-4 text-neutral-50 text-[18px] font-semibold">
                    {t("search.recentSearches")}
                  </div>
                  {data.searchHistory.map((article: string) => (
                    <SuggestionContainer key={article} text={article} />
                  ))}
                </>
              ) : (
                <p className="text-neutral-400 text-center py-8">
                  No recent searches yet. Start exploring!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Communique Section */}
      <div className="communique bg-background hidden lg:block">
        <Communique />
      </div>
    </div>
    </MainContent>
  );
};

export default Search;