import React, { useState } from 'react';
import { LuCrown, LuUsers, LuBadgeCheck,  LuTrash2, LuSettings } from 'react-icons/lu';
import { useGetUserByUsername } from '../../Profile/hooks';
import { EllipsisVertical } from 'lucide-react';

interface Collaborator {
  _id: string;
  collaborator_id: string;
  username: string;
  name: string | null;
  bio: string | null;
  permission: string;
  role: string;
  is_verified_writer: boolean;
  joinedAt: string;
}

interface AuthorCardProps {
  collaborator: Collaborator;
  onRemoveCollaborator: (collaboratorId: string) => void;
  onChangeAccessRights: (collaboratorId: string) => void;
  isOwner?: boolean;
  isRemoving?: boolean;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ 
  collaborator, 
  onRemoveCollaborator, 
  onChangeAccessRights,
  isOwner = false,
  isRemoving = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, isLoading, error } = useGetUserByUsername(collaborator.username);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <LuCrown className="w-4 h-4 text-yellow-400" />;
      case 'collaborator':
        return <LuUsers className="w-4 h-4 text-blue-400" />;
      default:
        return <LuUsers className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner':
        return 'Owner';
      case 'collaborator':
        return 'Collaborator';
      default:
        return 'Member';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleRemoveCollaborator = () => {
    onRemoveCollaborator(collaborator._id);
    setShowMenu(false);
  };

  const handleChangeAccessRights = () => {
    onChangeAccessRights(collaborator._id);
    setShowMenu(false);
  };

  // Use user data if available, otherwise fall back to collaborator data
  const displayName = user?.name || collaborator.name || collaborator.username;
  const displayBio = user?.bio || collaborator.bio || 'No bio available';
  const profilePicture = user?.profile_picture;
  const isVerified = user?.is_verified_writer || collaborator.is_verified_writer;

  if (isLoading) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6 animate-pulse">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-neutral-700 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-neutral-700 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-neutral-700 rounded w-1/2 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-neutral-800 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-neutral-700 rounded-full flex items-center justify-center">
            <span className="text-neutral-400 text-sm">?</span>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-neutral-50">{collaborator.username}</h4>
            <p className="text-red-400 text-sm">Error loading user details</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-neutral-800 rounded-lg p-6 hover:bg-neutral-750 transition-colors relative ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Profile Picture */}
        <div className="relative flex-shrink-0">
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-400 flex items-center justify-center text-white font-semibold text-lg">
              {getInitials(displayName)}
            </div>
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-lg font-semibold text-neutral-50 truncate">{displayName}</h4>
            {isVerified && (
              <LuBadgeCheck className="w-4 h-4 text-primary-400 flex-shrink-0" />
            )}
            <div className="flex items-center gap-1 text-sm text-neutral-400">
              {getRoleIcon(collaborator.role)}
              <span>{getRoleLabel(collaborator.role)}</span>
            </div>
          </div>
          
          {/* <p className="text-neutral-100 text-sm mb-2">@{collaborator.username}</p> */}
          <p className="text-neutral-200 text-sm mb-2 line-clamp-2">{displayBio}</p>
          
          <div className="flex items-center gap-4 text-xs text-neutral-200">
            <span>Joined: {formatDate(collaborator.joinedAt)}</span>
            <span>Permission: {collaborator.permission}</span>
          </div>
        </div>

        {/* Actions Menu */}
        {!isOwner && (
          <div className="relative">
            {isRemoving ? (
              <div className="p-2 text-neutral-400">
                <div className="w-5 h-5 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <button
                onClick={handleMenuToggle}
                className="p-2 text-neutral-100 hover:text-neutral-50 hover:bg-neutral-700 rounded-full transition-colors"
              >
                <EllipsisVertical className="w-5 h-5" />
              </button>
            )}

            {showMenu && !isRemoving && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-20">
                  <div className="py-2">
                    <button
                      onClick={handleChangeAccessRights}
                      className="w-full px-4 py-3 text-left text-sm text-neutral-300 hover:bg-neutral-700 flex items-center gap-3"
                    >
                      <LuSettings className="w-4 h-4" />
                      Change Access Rights
                    </button>
                    <button
                      onClick={handleRemoveCollaborator}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-neutral-700 flex items-center gap-3"
                    >
                      <LuTrash2 className="w-4 h-4" />
                      Remove Collaborator
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorCard;
