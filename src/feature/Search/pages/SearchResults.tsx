import React, { useEffect, useState } from "react";
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
import MainContent from "../../../components/molecules/MainContent";


const tabs = [
  { id: "All", title: "All" },
  { id: "Posts", title: "Posts" },
  { id: "Articles", title: "Articles" },
  { id: "People", title: "People" },
];

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [activeTab, setActiveTab] = useState<string | number>(tabs[0].id);
  const { authUser } = useUser();
  const { mutate } = useStoreSearchSuggestion();

  useEffect(() => {
    if (!authUser?.id || !query) return;

    mutate(
      {
        userid: authUser.id,
        searchSuggestions: query,
      },
      {
        onError: (error) => {
          void error;
        },
      }
    );
  }, [query, authUser, mutate]);

  return (
    <MainContent> 
    <div className="lg:grid font-roboto grid-cols-[4fr_1.65fr]">
      <div className="search lg:border-r-[1px] border-neutral-500">
        <Topbar>
          {/* <div className="flex items-center gap-2"><button
              onClick={() => navigate(-1)}
              className="p-2 md:hidden block hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="size-5 text-neutral-300" />
            </button>
            <p className="text-neutral-50 font-semibold">{t("search.recentSearches")}</p>
          </div> */}
          <SearchTopBar initialSearchTerm={query} />
        </Topbar>
        <div className="flex flex-col min-h-screen items-center">
          <div className="mt-10 min-w-[370px] self-center">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              scale={true}
            />
          </div>
          <div className="mt-8 md:px-10 lg:px-20 text-[15px] w-full flex flex-col items-center flex-shrink-0">
            {activeTab === "All" && <SearchAll query={query} />}
            {activeTab === "Posts" && <SearchPosts query={query} />}
            {activeTab === "Articles" && <SearchArticles query={query} />}
            {activeTab === "People" && <SearchPeople query={query} />}
          </div>
        </div>
      </div>
      <div className="communique bg-background hidden lg:block">
        <Communique />
      </div>
    </div>
    </MainContent>
  );
};

export default SearchResults;