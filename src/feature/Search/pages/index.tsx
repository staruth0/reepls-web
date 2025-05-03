import React, { useContext, useEffect } from "react"; // Added useEffect
import { useGetSearchSuggestions } from "../hooks";
import { useUser } from "../../../hooks/useUser";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import SearchTopBar from "../components/SearchTopBar";
import Communique from "../../Feed/components/Communique/Communique";
import SuggestionContainer from "../components/SuggestionContainer";
import { SearchContainerContext } from "../../../context/suggestionContainer/isSearchcontainer";
import RecentSearchesSkeleton from "../components/RecentSearchComponent";
import { toast } from "react-toastify"; // Added for toast notifications
import { useTranslation } from "react-i18next";

const Search: React.FC = () => {
  const { authUser } = useUser();
  const { data, isLoading, error } = useGetSearchSuggestions(authUser?.id || ""); // Added error
  const { isSearchContainerOpen } = useContext(SearchContainerContext);
  

  const {t} = useTranslation()

  // Function to get friendly error messages specific to search suggestions
  const getFriendlyErrorMessage = (error: any, query?: string): string => {
    if (!error) return t("search.errors.default");
  
    if (error.message.includes("Network Error")) {
      return t("search.errors.network");
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return t("search.errors.notFound", { query }); // Dynamic query
      }
      if (status === 500) {
        return t("search.errors.server");
      }
      if (status === 429) {
        return t("search.errors.rateLimit");
      }
    }
    return t("search.errors.default");
  };

  // Toast error notification
  useEffect(() => {
    if (error) {
      toast.error(getFriendlyErrorMessage(error));
    }
  }, [error]);

  // Loading state
  if (isLoading) {
    return (
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
    );
  }

  // Error state
  if (error) {
    return (
      <div className="lg:grid font-roboto grid-cols-[4fr_1.65fr] min-h-screen">
        <div className="search w-full lg:border-r-[1px] border-neutral-500">
          <Topbar>
            <SearchTopBar />
          </Topbar>
          <div className="px-5 md:px-10 lg:px-20 w-full flex flex-col">
            <div className="recent space-y-4 mt-8">
              <p className="text-neutral-50 text-center py-8">
                {getFriendlyErrorMessage(error)}
              </p>
            </div>
          </div>
        </div>
        <div className="communique hidden lg:block">
          <Communique />
        </div>
      </div>
    );
  }

  // Success or empty state
  return (
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
  );
};

export default Search;