import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Calendar } from 'lucide-react';
import { User } from '../../../models/datamodels';

// Interface for the Card component props
interface CardProps {
  title: string; // Card title
  subtitle: string; // Card subtitle
  media: string[]; // Array of image URLs
  date: string; // ISO date string (e.g., "2025-06-25T00:00:00Z")
  user: User; // User object with profile and username
  slug: string; // Slug for navigation
}

// Function to convert ISO date to "MMM DD, YYYY" format
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date
    .toLocaleDateString('en-US', {
      month: 'short', // "JUN"
      day: 'numeric', // "25"
      year: 'numeric', // "2025"
    })
    .toUpperCase(); // Convert to uppercase to match "JUN 25, 2025"
};

const Card: React.FC<CardProps> = ({ title, subtitle, media, date, user, slug }) => {
  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  // Function to handle image cycling
  const handleNextImage = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation(); // Prevent the card's click event from firing
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  return (
    <Link to={`/posts/article/slug/${slug}`} className="block">
      <div className="relative mx-auto rounded-2xl overflow-hidden shadow-lg bg-gray-900 min-h-96">
        {/* Background Image */}
        <div
          className="w-full min-h-96 bg-cover bg-center"
          style={{
            backgroundImage: `url('${media[currentImageIndex]}')`,
          }}
        ></div>

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>

        {/* Content - Positioned 55% on mobile, 50% on larger screens */}
        <div className="absolute top-[55%] md:top-[50%] w-full p-4 text-white">
          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold leading-tight">{title}</h2>

          {/* Subtitle - Hidden on mobile */}
          <p className="hidden md:block text-[14px] text-gray-300 mt-2">{subtitle}</p>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-5 gap-3">
            {/* Author and Date */}
            <div className="flex items-center gap-3">
              {/* Author */}
              <div className="flex items-center">
                <img
                  src={user.profile_picture}
                  alt="Author"
                  className="w-8 h-8 rounded-full mr-2"
                />
                <Link
                  to={`/profile/${user.username}`}
                  className="text-sm font-semibold hover:underline"
                  onClick={(e) => e.stopPropagation()} // Prevent card click from firing
                >
                  {user.username}
                </Link>
              </div>

              {/* Date with Calendar Icon */}
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-xs text-gray-400">{formatDate(date)}</p>
              </div>
            </div>

            {/* Tags - Hidden on mobile */}
            <div className="hidden md:flex gap-2">
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                UI/UX
              </span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                DESIGN SYSTEM
              </span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                SLEEP & CARE
              </span>
            </div>
          </div>
        </div>

        {/* Arrow Icon - Positioned on the right, clickable */}
        <div
          className="absolute top-4 right-4 text-white cursor-pointer"
          onClick={handleNextImage}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default Card;