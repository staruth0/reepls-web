import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Topbar from "../../../components/atoms/Topbar/Topbar";
import Communique from "../../Feed/components/Communique/Communique";
import SearchTopBar from "../components/SearchTopBar";
import SearchPeople from "./SearchPeople";
import SearchPosts from "./searchPosts";
import SearchArticles from "./SearchArticles";
import SearchAll from "./SearchAll";
import SearchPodcast from "./SearchPodcast";
import { useUser } from "../../../hooks/useUser";
import { useStoreSearchSuggestion } from "../hooks";
import MainContent from "../../../components/molecules/MainContent";


const tabs = [
  { id: "All", title: "All" },
  { id: "Posts", title: "Posts" },
  { id: "Articles", title: "Articles" },
  { id: "Podcast", title: "Podcast" },
  { id: "People", title: "People" },
];

interface SearchTabsProps {
  tabs: { id: string; title: string }[];
  activeTab: string | number;
  setActiveTab: (tabId: string | number) => void;
}

const SearchTabs: React.FC<SearchTabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Scroll active tab into view on mobile
  useEffect(() => {
    if (activeTabRef.current && tabRef.current) {
      const container = tabRef.current;
      const activeElement = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      
      // Check if active tab is out of view
      if (activeRect.left < containerRect.left) {
        container.scrollTo({
          left: container.scrollLeft + (activeRect.left - containerRect.left) - 16,
          behavior: 'smooth'
        });
      } else if (activeRect.right > containerRect.right) {
        container.scrollTo({
          left: container.scrollLeft + (activeRect.right - containerRect.right) + 16,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab]);

  return (
    <div className="w-full">
      <div 
        ref={tabRef}
        className="relative flex overflow-x-auto scroll-smooth
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          border-b border-neutral-300
          justify-between lg:overflow-x-visible"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative flex-shrink-0 px-4 py-3 cursor-pointer 
                transition-all duration-300 whitespace-nowrap
                flex items-center justify-center
                font-medium text-base
                ${isActive 
                  ? 'text-neutral-50' 
                  : 'text-neutral-400 hover:text-neutral-300'
                }
              `}
            >
              <span className="relative z-10">{tab.title}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary-400 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

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
          <div className="mt-10 w-full px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl">
            <SearchTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>
          <div className="mt-8 md:px-10 lg:px-20 text-[15px] w-full flex flex-col items-center flex-shrink-0">
            {activeTab === "All" && <SearchAll query={query} />}
            {activeTab === "Posts" && <SearchPosts query={query} />}
            {activeTab === "Articles" && <SearchArticles query={query} />}
            {activeTab === "Podcast" && <SearchPodcast query={query} />}
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