import React, { useContext, useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/atoms/Topbar/Topbar";
import ToggleFeed from "./components/ToogleFeed";
import CognitiveModeIndicator from "../../components/atoms/CognitiveModeIndicator";
import { CognitiveModeContext } from "../../context/CognitiveMode/CognitiveModeContext";
import PodcastCard from "../Podcast/components/PodcastLayout1";
import PodcastCard2 from "../Podcast/components/PodcastLayout2";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { useGetAllPodcasts } from "../Podcast/hooks";
import { IPodcast, User } from "../../models/datamodels";
import Communique from "./components/Communique/Communique";
import { Pics } from "../../assets/images";

interface Podcast {
  id: string;
  thumbnailUrl: string;
  author: User;
  title: string;
  description: string;
  publishDate: string;
  listenTime: string;
  likes: number;
  comments: number;
  isBookmarked: boolean;
}

const FeedPodcasts: React.FC = () => {
  const [isBrainActive, setIsBrainActive] = useState<boolean>(false);
  const { toggleCognitiveMode } = useContext(CognitiveModeContext);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  // Fetch podcasts from API
  const { data: podcastsAPI, isLoading } = useGetAllPodcasts({
    page: 1,
    limit: 10,
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(()=>{
    console.log('fetched podcast', podcastsAPI)
  },[podcastsAPI])

 
  function formatDate(iso?: string) {
    if (!iso) return "N/A";
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "short", day: "numeric" });
  }


  function formatDuration(sec?: number) {
    if (!sec || isNaN(sec)) return "0 min";
    return `${Math.round(sec / 60)} min`;
  }


  const apiPodcastToCardPodcast = (p: IPodcast): Podcast => {
    return {
      id: p.id ?? "",
      thumbnailUrl:
        p.thumbnailUrl ||
        Pics.podcastimg,
      author: p.authorId || { id: "", name: "", profile_picture: "", is_verified_writer: false },
      title: p.title || "Untitled Podcast",
      description: p.description || "",
      publishDate: formatDate(p.createdAt?.toString()),
      listenTime: formatDuration(p.audio?.duration),
      likes: 0,
      comments: p.commentsCount ?? 0,
      isBookmarked: false,
    };
  };

  // Map API data or empty array
  const podcasts: Podcast[] =
    podcastsAPI?.data?.results?.length > 0
      ? podcastsAPI.data.results.map(apiPodcastToCardPodcast)
      : [];

  // Handlers for actions
  const handleLike = (podcastId: string) => {
    console.log(`Like action for podcast: ${podcastId}`);
  };

  const handleComment = (podcastId: string) => {
    console.log(`Comment action for podcast: ${podcastId}`);
  };
  
  const handlePodcastClick = (podcastId: string) => {
    navigate(`/podcast/${podcastId}`);
  };

  const handleBookmark = (podcastId: string) => {
    console.log(`Bookmark action for podcast: ${podcastId}`);
  };

  const handleFollow = (authorId: string) => {
    console.log(`Follow action for author: ${authorId}`);
  };

  const handleBrainClick = () => {
    setIsBrainActive((prev) => !prev);
    toggleCognitiveMode();
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  };

  // Skeleton placeholder component for horizontal cards
  const PodcastCardSkeleton: React.FC = () => (
    <div className="flex-shrink-0 w-[365px] mr-4 animate-pulse bg-neutral-700 rounded-lg h-[350px] px-4 py-5">
      <div className="bg-neutral-600 h-48 rounded-md mb-4 w-full" />
      <div className="h-6 bg-neutral-600 rounded w-3/4 mb-3" />
      <div className="h-4 bg-neutral-600 rounded w-full mb-2" />
      <div className="h-4 bg-neutral-600 rounded w-5/6 mb-2" />
      <div className="flex justify-between items-center mt-auto">
        <div className="h-5 bg-neutral-600 rounded w-1/3" />
        <div className="h-5 bg-neutral-600 rounded w-1/4" />
      </div>
    </div>
  );

  // Skeleton placeholder component for grid cards (PodcastCard2)
  const PodcastCard2Skeleton: React.FC = () => (
    <div className="animate-pulse bg-neutral-700 rounded-lg h-56 p-4">
      <div className="bg-neutral-600 h-36 rounded mb-3 w-full" />
      <div className="h-6 bg-neutral-600 rounded w-4/5 mb-2" />
      <div className="h-4 bg-neutral-600 rounded w-3/4" />
    </div>
  );

  return (
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="px-3 flex justify-between items-center w-full">
            <ToggleFeed />
            <CognitiveModeIndicator
              isActive={isBrainActive}
              onClick={handleBrainClick}
            />
          </div>
        </Topbar>

        {/* Suggested for Today Section */}
        <div className="p-4 sm:p-6 bg-neutral-800 rounded-lg mx-2 md:mx-4 sm:mx-6 my-3 max-w-4xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-md font-semibold text-neutral-50">
              Suggested for Today
            </h2>
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 transition-colors duration-200"
                aria-label="Scroll left"
              >
                <LuArrowLeft size={20} />
              </button>
              <button
                onClick={scrollRight}
                className="p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 transition-colors duration-200"
                aria-label="Scroll right"
              >
                <LuArrowRight size={20} />
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Podcast Cards */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading
              ? // Show 3 skeletons while loading
                [1, 2, 3].map((n) => <PodcastCardSkeleton key={n} />)
              : podcasts.length > 0
              ? podcasts.map((podcast) => (
                  <div
                    key={podcast.id}
                    className="flex-shrink-0 w-[365px] mr-4 cursor-pointer"
                    onClick={() => handlePodcastClick(podcast.id)}
                  >
                    <PodcastCard
                      podcast={podcast}
                      onLike={handleLike}
                      onComment={handleComment}
                      onBookmark={handleBookmark}
                      onFollow={handleFollow}
                    />
                  </div>
                ))
              : // Empty fallback
                <div className="text-neutral-400 italic">No podcasts available.</div>}
          </div>
        </div>

        {/* Trending Section */}
        <div className="p-4 sm:p-6 bg-neutral-800 rounded-lg mx-2 md:mx-4 sm:mx-6 my-3 max-w-4xl">
          <h2 className="text-md font-semibold text-neutral-50 mb-4">
            Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading
              ? // Show 2 skeleton cards for grid loading
                [1, 2].map((i) => <PodcastCard2Skeleton key={i} />)
              : podcasts.map((podcast) => (
                  <div 
                    key={podcast.id}
                    className="cursor-pointer"
                    onClick={() => handlePodcastClick(podcast.id)}
                  >
                    <PodcastCard2
                      podcast={podcast}
                      onLike={handleLike}
                      onComment={handleComment}
                      onBookmark={handleBookmark}
                      onFollow={handleFollow}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="communique bg-background hidden lg:block">
        <Communique />
      </div>
    </div>
  );
};

export default FeedPodcasts;