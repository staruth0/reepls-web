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

const Search: React.FC = () => {
  const { authUser } = useUser();
  const { data, isLoading, error } = useGetSearchSuggestions(authUser?.id || ""); // Added error
  const { isSearchContainerOpen } = useContext(SearchContainerContext);

  // Function to get friendly error messages specific to search suggestions
  const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return "Something went wrong while loading your search history.";

    // Handle common error cases
    if (error.message.includes("Network Error")) {
      return "Oops! Looks like you’re offline. Check your connection and try again.";
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return "We couldn’t find your recent searches right now.";
      }
      if (status === 500) {
        return "Our search system is taking a break. Please try again soon!";
      }
      if (status === 429) {
        return "Too many searches! Give us a moment to catch up.";
      }
    }

    // Default fallback for unhandled errors
    return "Something unexpected happened while fetching your search history.";
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
                    Recent Searches
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