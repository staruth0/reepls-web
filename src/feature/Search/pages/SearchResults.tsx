import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Tabs from "../../../components/molecules/Tabs/Tabs";
import Communique from "../../Feed/components/Communique/Communique";
import SearchTopBar from "../components/SearchTopBar";
import SearchPeople from "./SearchPeople";
import SearchPosts from "./searchPosts";
import SearchArticles from "./SearchArticles";
import SearchAll from "./SearchAll";
import { useUser } from "../../../hooks/useUser";
import { useStoreSearchSuggestion } from "../hooks";
import { SearchContainerContext } from "../../../context/suggestionContainer/isSearchcontainer";

const tabs = [
  { id: "All", title: "All" },
  { id: "Posts", title: "Posts" },
  { id: "Articles", title: "Articles" },
  { id: "People", title: "People" },
];

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || ""; 
  const [activeTab, setActiveTab] = useState<number | string>(tabs[0].id);
  const {setSearchContainerOpen} = useContext(SearchContainerContext)

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
          setSearchContainerOpen(false)
        },
      }

    );

    
  }, [query, authUser]);

  return (
    <div className={`grid font-roboto grid-cols-[4fr_1.65fr]`}>
      <div className="search border-r-[1px] border-neutral-500 ">
        <Topbar>
          <SearchTopBar />
        </Topbar>
        <div className="px-10 flex flex-col min-h-screen items-center">
          <div className="mt-10 min-w-[370px] self-center">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={true}
            />
          </div>

          <div className="mt-8 text-[15px]">
          
          {activeTab === "All" && <SearchAll query={query} />}
            {activeTab === "Posts" && <SearchPosts query={query} />}
            {activeTab === "Articles" && <SearchArticles query={query} />}
            {activeTab === "People" && <SearchPeople query={query} />}
          </div>
        </div>
      </div>

      {/* Communique Section */}
      <div className="communique hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default SearchResults;