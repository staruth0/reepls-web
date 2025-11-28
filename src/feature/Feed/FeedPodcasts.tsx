import React, {  useRef, useEffect, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../../components/atoms/Topbar/Topbar";
import ToggleFeed from "./components/ToogleFeed";
import PodcastCard from "../Podcast/components/PodcastLayout1";
import PodcastCard2 from "../Podcast/components/PodcastLayout2";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { useGetAllPodcastsInfinite, useGetSuggestedPodcasts } from "../Podcast/hooks";
import { IPodcast, User } from "../../models/datamodels";
import Communique from "./components/Communique/Communique";
import { Pics } from "../../assets/images";
import MainContent from "../../components/molecules/MainContent";
import { LucideLoader2 } from "lucide-react";

interface Podcast {
  id: string;
  thumbnailUrl: string;
  author: User;
  title: string;
  description: string;
  publishDate: string;
  listenTime: string;
  audioUrl: string;
  likes: number;
  comments: number;
  isBookmarked: boolean;
}

const FeedPodcasts: React.FC = () => {
    // const [isBrainActive, setIsBrainActive] = useState<boolean>(false);
    // const { toggleCognitiveMode } = useContext(CognitiveModeContext);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  // Fetch podcasts from API with infinite query
  const { 
    data: podcastsAPI, 
    isLoading, 
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error
  } = useGetAllPodcastsInfinite({
    limit: 10,
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { 
    data: suggestedPodcastsData, 
    isLoading: isLoadingSuggested 
  } = useGetSuggestedPodcasts({
    page: 1,
    limit: 20,
  });

 
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
    // Handle author - prefer p.author, fallback to p.authorId
    let author: User;
    if (p.author) {
      // Map author object from API response (profilePicture -> profile_picture)
      author = {
        id: p.author.id || p.author._id || "",
        name: p.author.name || p.author.username || "",
        username: p.author.username || "",
        profile_picture: (p.author as any).profilePicture || p.author.profile_picture || "",
        is_verified_writer: (p.author as any).isVerifiedWriter || p.author.is_verified_writer || false,
      };
    } else if (p.authorId) {
      // Use authorId if it's already a User object
      author = typeof p.authorId === 'object' 
        ? p.authorId 
        : { id: p.authorId as any, name: "", profile_picture: "", is_verified_writer: false };
    } else {
      // Default fallback
      author = { id: "", name: "", profile_picture: "", is_verified_writer: false };
    }

    return {
      id: p.id ?? "",
      thumbnailUrl:
        p.thumbnailUrl ||
        Pics.podcastimg,
      author: author,
      title: p.title || "Untitled Podcast",
      description: p.description || "",
      publishDate: formatDate(p.createdAt?.toString()),
      listenTime: formatDuration(p.audio?.duration),
      audioUrl: p.audio?.url || "",
      likes: 0,
      comments: p.commentsCount ?? 0,
      isBookmarked: false,
    };
  };

  // Map API data from infinite query or empty array
  const podcasts: Podcast[] = podcastsAPI?.pages && podcastsAPI.pages.length > 0
    ? podcastsAPI.pages.flatMap(page => 
        page?.data?.results?.length > 0 
          ? (page?.data?.results || []).map(apiPodcastToCardPodcast)
          : []
      )
    : [];

  // Map suggested podcasts data
  const suggestedPodcasts: Podcast[] = suggestedPodcastsData?.data?.results?.length > 0
    ? suggestedPodcastsData.data.results.map(apiPodcastToCardPodcast)
    : [];

  // Handlers for actions
  const handleLike = (_podcastId: string) => {
    // Like action handler
  };

  const handleComment = (_podcastId: string) => {
    // Comment action handler
  };
  
  const handlePodcastClick = (podcastId: string) => {
    navigate(`/podcast/${podcastId}`);
  };

  const handleBookmark = (_podcastId: string) => {
    // Bookmark action handler
  };

  const handleFollow = (_authorId: string) => {
    // Follow action handler
  };

  // const handleBrainClick = () => {
  //   // setIsBrainActive((prev) => !prev);
  //       // toggleCognitiveMode();
  //   return;
  // };

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

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Infinite scroll detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Skeleton placeholder component for horizontal cards
  const PodcastCardSkeleton: React.FC = () => (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[365px] mr-3 sm:mr-4 animate-pulse bg-neutral-700 rounded-lg h-[300px] sm:h-[350px] px-3 sm:px-4 py-4 sm:py-5">
      <div className="bg-neutral-600 h-40 sm:h-48 rounded-md mb-3 sm:mb-4 w-full" />
      <div className="h-5 sm:h-6 bg-neutral-600 rounded w-3/4 mb-2 sm:mb-3" />
      <div className="h-3 sm:h-4 bg-neutral-600 rounded w-full mb-2" />
      <div className="h-3 sm:h-4 bg-neutral-600 rounded w-5/6 mb-2" />
      <div className="flex justify-between items-center mt-auto">
        <div className="h-4 sm:h-5 bg-neutral-600 rounded w-1/3" />
        <div className="h-4 sm:h-5 bg-neutral-600 rounded w-1/4" />
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
    <MainContent>
    <div className={`lg:grid grid-cols-[4fr_1.65fr]`}>
      <div className="min-h-screen flex flex-col items-center lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="lg:px-3 flex justify-between items-center w-full">
            <ToggleFeed />
            {/* <CognitiveModeIndicator
              isActive={isBrainActive}
              onClick={handleBrainClick}
            /> */}
          </div>
        </Topbar>

        {/* Suggested for Today Section */}
        <div className="p-3 sm:p-4 md:p-6 bg-neutral-800 rounded-lg mx-2 md:mx-4 sm:mx-6 my-3 max-w-4xl w-full">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-sm sm:text-md font-semibold text-neutral-50">
              Suggested for Today
            </h2>
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={scrollLeft}
                className="p-1.5 sm:p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 transition-colors duration-200"
                aria-label="Scroll left"
              >
                <LuArrowLeft size={16} className="sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="p-1.5 sm:p-2 rounded-full bg-neutral-700 hover:bg-neutral-600 text-neutral-50 transition-colors duration-200"
                aria-label="Scroll right"
              >
                <LuArrowRight size={16} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* Horizontally Scrollable Podcast Cards */}
          <div
            ref={scrollContainerRef}
            className="flex justify-start overflow-x-auto pb-3 sm:pb-4 scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoadingSuggested
              ? // Show 3 skeletons while loading
                [1, 2, 3].map((n) => <PodcastCardSkeleton key={n} />)
              : suggestedPodcasts.length > 0
              ? suggestedPodcasts.map((podcast) => (
                  <div
                    key={podcast.id}
                    className="  flex-shrink-0 w-[280px] sm:w-[320px] md:w-[365px] mr-3 sm:mr-4"
                  >
                    <PodcastCard
                      podcast={podcast}
                      onLike={handleLike}
                      onComment={handleComment}
                      onBookmark={handleBookmark}
                      onFollow={handleFollow}
                      onReadMore={handlePodcastClick}
                    />
                  </div>
                ))
              : // Empty fallback
                <div className="text-neutral-400 italic text-sm sm:text-base">No suggested podcasts available.</div>}
          </div>
        </div>

        {/* Trending Section */}
        <div className="p-3 sm:p-4 md:p-6 bg-neutral-800 flex flex-col rounded-lg mx-2 md:mx-4 sm:mx-6 my-3 max-w-4xl w-full">
          <h2 className="text-sm sm:text-md font-semibold text-neutral-50 mb-3 sm:mb-4">
            Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {isLoading
              ? // Show 2 skeleton cards for grid loading
                [1, 2].map((i) => <PodcastCard2Skeleton key={i} />)
              : podcasts.map((podcast) => (
                  <div 
                    key={podcast.id}
                    className=""
                  >
                    <PodcastCard2
                      podcast={podcast}
                      onLike={handleLike}
                      onComment={handleComment}
                      onBookmark={handleBookmark}
                      onFollow={handleFollow}
                      onReadMore={handlePodcastClick}
                    />
                  </div>
                ))}
          </div>
          
          {/* Load More Button */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingNextPage}
                className="px-6 py-3  text-white rounded-full hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                {isFetchingNextPage ? (
                  <>
                   <LucideLoader2 className="animate-spin text-primary-400 text-2xl" />
                  </>
                ) : (
                  ''
                )}
              </button>
            </div>
          )}
          
          {/* Intersection Observer Trigger */}
          <div ref={loadMoreRef} className="h-4" />
          
          {/* Error State */}
          {isError && (
            <div className="text-center mt-6">
              <p className="text-red-400 mb-4">
                Failed to load podcasts: {error?.message || 'Unknown error'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-neutral-700 text-neutral-300 rounded-lg hover:bg-neutral-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="communique bg-background hidden lg:block">
        <Communique />
      </div>
    </div>
    </MainContent>
  );
};

export default FeedPodcasts;