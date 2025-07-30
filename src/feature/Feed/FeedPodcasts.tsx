import React, { useContext, useState, useRef } from "react";
import Topbar from "../../components/atoms/Topbar/Topbar";
import ToggleFeed from "./components/ToogleFeed";
import CognitiveModeIndicator from "../../components/atoms/CognitiveModeIndicator";
import Communique from "./components/Communique/Communique";
import { CognitiveModeContext } from "../../context/CognitiveMode/CognitiveModeContext";
import PodcastCard from "../Podcast/components/PodcastLayout1";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import PodcastCard2 from "../Podcast/components/PodcastLayout2";

interface Podcast {
  id: string;
  thumbnailUrl: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    isVerified: boolean;
  };
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

  const dummyPodcasts: Podcast[] = [
    {
      id: "1",
      thumbnailUrl:
        "https://placehold.co/600x400/808080/FFFFFF?text=Podcast+Image+1",
      author: {
        id: "author1",
        name: "Ndofor Icha",
        avatarUrl: "https://placehold.co/32x32/333333/FFFFFF?text=NI",
        isVerified: true,
      },
      title: "10 Immutable Truths About being a Cameroonian",
      description:
        "'The Tangue', alongside a number of other historic artwork from the fatherland have not found home yet. of other historic artw...",
      publishDate: "Jun 26",
      listenTime: "32 min",
      likes: 25,
      comments: 24,
      isBookmarked: false,
    },
    {
      id: "2",
      thumbnailUrl:
        "https://placehold.co/600x400/555555/DDDDDD?text=Podcast+Image+2",
      author: {
        id: "author2",
        name: "Jane Doe",
        avatarUrl: "https://placehold.co/32x32/666666/FFFFFF?text=JD",
        isVerified: false,
      },
      title: "The Future of AI in Everyday Life",
      description:
        "An in-depth discussion on how artificial intelligence is shaping our world and what to expect next from this rapidly evolving field...",
      publishDate: "Jul 15",
      listenTime: "45 min",
      likes: 120,
      comments: 50,
      isBookmarked: true,
    },
    {
      id: "3",
      thumbnailUrl:
        "https://placehold.co/600x400/333333/AAAAAA?text=Podcast+Image+3",
      author: {
        id: "author3",
        name: "John Smith",
        avatarUrl: "https://placehold.co/32x32/999999/FFFFFF?text=JS",
        isVerified: true,
      },
      title: "Mastering React Hooks: A Deep Dive",
      description:
        "Explore advanced patterns and best practices for using React Hooks to build robust and scalable applications. Learn about custom hooks, performance optimizations, and more...",
      publishDate: "Aug 01",
      listenTime: "60 min",
      likes: 80,
      comments: 30,
      isBookmarked: false,
    },
  ];

  const trendingPodcasts: Podcast[] = [
    {
      id: "4",
      thumbnailUrl:
        "https://placehold.co/600x400/777777/EEEEEE?text=Trending+1",
      author: {
        id: "author4",
        name: "Alice Wonderland",
        avatarUrl: "https://placehold.co/32x32/777777/FFFFFF?text=AW",
        isVerified: false,
      },
      title: "The Art of Storytelling in Podcasting",
      description:
        "Uncover the secrets to crafting compelling narratives that captivate your audience...",
      publishDate: "Aug 10",
      listenTime: "28 min",
      likes: 145,
      comments: 35,
      isBookmarked: false,
    },
    {
      id: "5",
      thumbnailUrl:
        "https://placehold.co/600x400/666666/CCCCCC?text=Trending+2",
      author: {
        id: "author5",
        name: "Bob The Builder",
        avatarUrl: "https://placehold.co/32x32/555555/FFFFFF?text=BB",
        isVerified: true,
      },
      title: "Building Scalable Web Applications",
      description:
        "A comprehensive guide to designing and implementing web applications that can handle increasing user loads...",
      publishDate: "Sep 01",
      listenTime: "70 min",
      likes: 190,
      comments: 45,
      isBookmarked: false,
    },
  ];

  const handleLike = (podcastId: string) => {
    console.log(`Like action for podcast: ${podcastId}`);
  };

  const handleComment = (podcastId: string) => {
    console.log(`Comment action for podcast: ${podcastId}`);
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

          {/* Horizontally Scrollable Podcast Cards - Scrollbar hidden */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide" // Changed from custom-scrollbar to scrollbar-hide
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Additional hiding for Firefox and IE
          >
            {dummyPodcasts.map((podcast) => (
              <div key={podcast.id} className="flex-shrink-0 w-[365px] mr-4">
                <PodcastCard
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

        {/* Trending Section - Added below Suggested for Today */}
        <div className="p-4 sm:p-6 bg-neutral-800 rounded-lg mx-2 md:mx-4 sm:mx-6 my-3 max-w-4xl">
          <h2 className="text-md font-semibold text-neutral-50 mb-4">
            Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trendingPodcasts.map((podcast) => (
              <PodcastCard2
                key={podcast.id}
                podcast={podcast}
                onLike={handleLike}
                onComment={handleComment}
                onBookmark={handleBookmark}
                onFollow={handleFollow}
              />
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
