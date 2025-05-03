import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const topics = [
  'Technology',
  'Life',
  'Job Announcement',
  'Cybersecurity',
  'Sports',
  'Business',
  'Environment',
  'Evolution'
];

const TopicsToExplore: React.FC = () => {
  const { t } = useTranslation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 200;
      const newScrollLeft = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Update button visibility after scroll completes
      setTimeout(() => {
        checkScrollPosition();
      }, 300);
    }
  };

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftButton(container.scrollLeft > 0);
      setShowRightButton(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    }
  };

  return (
    <div className="topics-explore mb-6 w-full">
      <h2 className="text-neutral-50 text-lg font-semibold mb-3">
        {t("search.topicsToExplore")}
      </h2>
      <div className="relative">
        {showLeftButton && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary-400 text-white p-1.5 rounded-full hover:bg-primary-500 shadow-md"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide"
          onScroll={checkScrollPosition}
          style={{ scrollbarWidth: 'none' }}
        >
          {topics.map((title) => (
            <Link
              key={title}
              to={`/search/results?query=${title}`}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-primary-400 text-white font-medium text-sm hover:bg-primary-500 transition-colors duration-200 whitespace-nowrap"
            >
              #{title}
            </Link>
          ))}
        </div>
        
        {showRightButton && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-primary-400 text-white p-1.5 rounded-full hover:bg-primary-500 shadow-md"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopicsToExplore;