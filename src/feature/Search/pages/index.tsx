import React, { useContext } from "react";
import { useGetSearchSuggestions } from "../hooks";
import { useUser } from "../../../hooks/useUser";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import SearchTopBar from "../components/SearchTopBar";
import Communique from "../../Feed/components/Communique/Communique";
import SuggestionContainer from "../components/SuggestionContainer";
import { SearchContainerContext } from "../../../context/suggestionContainer/isSearchcontainer";
import RecentSearchesSkeleton from "../components/RecentSearchComponent";

const Search: React.FC = () => {
  const { authUser } = useUser();
  const { data, isLoading } = useGetSearchSuggestions(authUser?.id || "");
  const { isSearchContainerOpen } = useContext(SearchContainerContext);

  return (
    <div className="lg:grid font-roboto grid-cols-[4fr_1.65fr] min-h-screen">
      <div className="search w-full lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <SearchTopBar />
        </Topbar>
        <div className="px-5 md:px-10 lg:px-20 w-full flex flex-col">
          {!isSearchContainerOpen && (
            <div className="recent space-y-4 mt-8">
              {isLoading ? (
                <RecentSearchesSkeleton />
              ) : (
                <>
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
                      No recent searches
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Communique Section */}
      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default Search;