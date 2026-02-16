import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetUserByUsername } from '../../Profile/hooks';
import { LuBadgeCheck } from 'react-icons/lu';
import { timeAgo } from '../../../utils/dateFormater';

interface SubscriberPersonProps {
  username: string;
  subscriptionDate: string;
  subscriptionStatus: string;
}

const SubscriberPerson: React.FC<SubscriberPersonProps> = ({
  username,
  subscriptionDate,
  subscriptionStatus
}) => {
  const navigate = useNavigate();
  const { user, isLoading, error } = useGetUserByUsername(username);

  const handleProfileClick = () => {
    if (user?.username) {
      navigate(`/profile/${user.username}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg animate-pulse">
        <div className="w-12 h-12 bg-neutral-700 rounded-full"></div>
        <div className="flex-1">
          <div className="w-32 h-4 bg-neutral-700 rounded mb-2"></div>
          <div className="w-48 h-3 bg-neutral-700 rounded"></div>
        </div>
        <div className="w-20 h-6 bg-neutral-700 rounded"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg border border-red-500/20">
        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
          <span className="text-red-400 text-sm">!</span>
        </div>
        <div className="flex-1">
          <p className="text-red-400 text-sm">Failed to load user</p>
          <p className="text-neutral-500 text-xs">@{username}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg hover:bg-neutral-750 transition-colors cursor-pointer group"
      onClick={handleProfileClick}
    >
      {/* Profile Picture */}
      <div className="relative">
        {user.profile_picture && user.profile_picture !== "https://example.com/default-profile.png" ? (
          <img
            src={user.profile_picture}
            alt={user.username || "User"}
            className="w-12 h-12 rounded-full object-cover border-2 border-neutral-600 group-hover:border-primary-400 transition-colors"
            loading="lazy"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-bold text-lg border-2 border-neutral-600 group-hover:border-primary-400 transition-colors">
            {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
        
        {/* Verified Badge */}
        {user.is_verified_writer && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-400 rounded-full flex items-center justify-center">
            <LuBadgeCheck className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-neutral-50 truncate group-hover:text-primary-400 transition-colors">
            {user.name || user.username}
          </h3>
          {user.is_verified_writer && (
            <LuBadgeCheck className="w-4 h-4 text-primary-400 flex-shrink-0" />
          )}
        </div>
        
        {/* <p className="text-neutral-100 text-sm truncate mb-1">
          @{user.username}
        </p> */}
        
        {user.bio && (
          <p className="text-neutral-100 text-sm line-clamp-2 group-hover:text-neutral-200 transition-colors">
            {user.bio}
          </p>
        )}
        
        <p className="text-neutral-200 text-xs mt-1">
          Subscribed {timeAgo(subscriptionDate)}
        </p>
      </div>

      {/* Subscription Status */}
      <div className="flex flex-col items-end gap-1">
        <span 
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            subscriptionStatus === 'active' 
              ? 'bg-primary-500/20 text-primary-400' 
              : 'bg-neutral-500/20 text-neutral-200'
          }`}
        >
          {subscriptionStatus}
        </span>
        
        {user.role && (
          <span className="text-xs text-neutral-200 capitalize">
            {user.role}
          </span>
        )}
      </div>
    </div>
  );
};

export default SubscriberPerson;
