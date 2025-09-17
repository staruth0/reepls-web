import React, { useState, useMemo, useEffect } from 'react';
import { LuX, LuSearch, LuUserPlus, LuCheck } from 'react-icons/lu';
import { useGetAllUsers, useGetUserByUsername } from '../../Profile/hooks';
import { useGetSearchResults } from '../../Search/hooks';
import { useAddCollaborator } from '../Hooks';
import { User, Article } from '../../../models/datamodels';
import { toast } from 'react-toastify';

interface AddAuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId: string;
}

const AddAuthorModal: React.FC<AddAuthorModalProps> = ({ isOpen, onClose, streamId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  
  const { data: users, isLoading, error, refetch: refetchUsers } = useGetAllUsers();
  const { data: searchResults, isLoading: isSearchLoading, error: searchError, refetch: refetchSearch } = useGetSearchResults(isSearchMode ? searchQuery : '');
  const addCollaboratorMutation = useAddCollaborator();
  
  // Hook to fetch user by username when needed
  const { user: fetchedUser, error: fetchUserError } = useGetUserByUsername(selectedUsername || '');

  // Debug logging
  console.log('Users data structure:', users);
  console.log('Search results data structure:', searchResults);

  // Effect to handle user fetching by username
  useEffect(() => {
    if (isFetchingUser && fetchedUser) {
      console.log('User fetched successfully:', fetchedUser);
      setSelectedUserId(fetchedUser._id || fetchedUser.id || '');
      setIsFetchingUser(false);
    }
    
    if (isFetchingUser && fetchUserError) {
      console.error('Error fetching user:', fetchUserError);
      toast.error('Failed to fetch user details. Please try again.');
      setIsFetchingUser(false);
      setShowConfirmModal(false);
      setSelectedUsername(null);
    }
  }, [isFetchingUser, fetchedUser, fetchUserError]);

  // Handle refresh
  const handleRefresh = async () => {
    console.log('Refresh button clicked, isSearchMode:', isSearchMode);
    try {
      if (isSearchMode) {
        console.log('Refreshing search results...');
        await refetchSearch();
        console.log('Search refresh completed');
      } else {
        console.log('Refreshing users...');
        await refetchUsers();
        console.log('Users refresh completed');
      }
    } catch (error) {
      console.error('Error during refresh:', error);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchMode(true);
    }
  };

  // Reset search mode when query changes
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (isSearchMode) {
      setIsSearchMode(false);
    }
  };

  // Handle adding collaborator
  const handleAddAuthor = async (userId: string) => {
    console.log('handleAddAuthor called with userId:', userId, 'streamId:', streamId);
    try {
      console.log('Calling addCollaboratorMutation.mutateAsync...');
      await addCollaboratorMutation.mutateAsync({
        id: streamId,
        userId: userId,
        permission: 'Edit Access'
      });
      
      console.log('Collaborator added successfully');
      toast.success('Collaborator added successfully!');
      setShowConfirmModal(false);
      setSelectedUserId(null);
      onClose();
    } catch (error: unknown) {
      console.error('Error adding collaborator:', error);
      
      // Extract the actual error message from the API response
      let errorMessage = 'Failed to add collaborator. Please try again.';
      
      if (error && typeof error === 'object') {
        const errorObj = error as Record<string, unknown>;
        if (errorObj?.response && typeof errorObj.response === 'object') {
          const response = errorObj.response as Record<string, unknown>;
          if (response?.data && typeof response.data === 'object') {
            const data = response.data as Record<string, unknown>;
            if (typeof data.message === 'string') {
              errorMessage = data.message;
            } else if (typeof data.error === 'string') {
              errorMessage = data.error;
            }
          }
        } else if (typeof errorObj?.message === 'string') {
          errorMessage = errorObj.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };


  const filteredUsers = useMemo(() => {
    if (isSearchMode && searchResults) {
      // Filter search results to only include users
      const userResults = searchResults.filter((item: User | Article) => {
        // Check if it's a user by looking for user-specific properties
        return 'username' in item || 'name' in item;
      }) as User[];
      
      console.log('Search results filtered users:', userResults);
      return userResults;
    }
    
    if (!users) return [];
    
    // Check if users has a results property or is directly an array
    const userList = Array.isArray(users) ? users : (users as { results?: User[] })?.results || [];
    
    return userList.filter((user: User) => {
      const searchLower = searchQuery.toLowerCase();
      const name = user.name?.toLowerCase() || '';
      const username = user.username?.toLowerCase() || '';
      const bio = user.bio?.toLowerCase() || '';
      
      return name.includes(searchLower) || 
             username.includes(searchLower) || 
             bio.includes(searchLower);
    });
  }, [users, searchQuery, isSearchMode, searchResults]);

  console.log('Filtered users:', filteredUsers);

  const handleAddClick = (userId: string, username?: string) => {
    console.log('handleAddClick called with userId:', userId, 'username:', username);
    
    if (userId) {
      // User has ID, proceed directly
      setSelectedUserId(userId);
      setSelectedUsername(null);
      setShowConfirmModal(true);
    } else if (username) {
      // User doesn't have ID, need to fetch by username
      setSelectedUserId(null);
      setSelectedUsername(username);
      setIsFetchingUser(true);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmAdd = () => {
    console.log('handleConfirmAdd called, selectedUserId:', selectedUserId, 'isFetchingUser:', isFetchingUser);
    
    if (isFetchingUser) {
      // Still fetching user, don't proceed yet
      console.log('Still fetching user, waiting...');
      return;
    }
    
    if (selectedUserId) {
      handleAddAuthor(selectedUserId);
    } else {
      console.error('No selectedUserId found when trying to add author');
      toast.error('Unable to get user ID. Please try again.');
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setSelectedUserId(null);
    setSelectedUsername(null);
    setIsFetchingUser(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
        <div className="bg-background shadow-lg rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-500">
            <h2 className="text-xl font-semibold text-neutral-50">Add Author</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-50 transition-colors"
            >
              <LuX className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 sm:p-6 border-b border-neutral-500 flex flex-col sm:flex-row gap-2">
            <div className="relative w-full">
              <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search authors by name, username, or bio..."
                value={searchQuery}
                onChange={handleSearchQueryChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="w-full pl-10 pr-4 py-3 bg-neutral-600 border border-neutral-700 rounded-full text-neutral-50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSearch}
                className="bg-primary-400 text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors flex items-center gap-2 whitespace-nowrap"
              >
                Search
              </button>
              {(error || searchError) && (
                <button 
                  onClick={(e) => {
                    console.log('Search bar refresh button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    handleRefresh();
                  }}
                  className="bg-neutral-600 text-white px-4 py-2 rounded-full hover:bg-neutral-700 transition-colors flex items-center gap-2"
                  title="Refresh"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {(isLoading || isSearchLoading || addCollaboratorMutation.isPending || isFetchingUser) ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-neutral-400">
                  {isFetchingUser 
                    ? 'Loading user details...' 
                    : isSearchMode 
                      ? 'Searching authors...' 
                      : 'Loading authors...'
                  }
                </div>
              </div>
            ) : (error || searchError || addCollaboratorMutation.error) ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="text-red-400 text-center">
                  {isSearchMode ? 'Error searching authors' : 'Error loading authors'}
                </div>
                <button
                  onClick={(e) => {
                    console.log('Error area refresh button clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    handleRefresh();
                  }}
                  className="bg-primary-400 text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors flex items-center gap-2"
                  type="button"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-neutral-400">
                  {isSearchMode 
                    ? 'No authors found matching your search' 
                    : searchQuery 
                      ? 'No authors found matching your search' 
                      : 'No authors available'
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user: User) => {
                  console.log('Rendering user:', user);
                  console.log('User ID options:', { _id: user._id, id: user.id });
                  return (
                  <div
                    key={user._id || user.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-neutral-800 rounded-lg hover:bg-neutral-750 transition-colors"
                  >
                    {/* Profile Picture */}
                    <div className="flex-shrink-0">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.name || 'User'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-400 flex items-center justify-center text-white font-semibold">
                          {getInitials(user.name || user.username || 'U')}
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-neutral-50 truncate">
                          {user.name || user.username || 'Unknown User'}
                        </h4>
                        {user.is_verified_writer && (
                          <div className="w-2 h-2 bg-primary-400 rounded-full" title="Verified Writer" />
                        )}
                      </div>
                      <p className="text-neutral-400 text-sm truncate">
                        @{user.username || 'no-username'}
                      </p>
                      {user.bio && (
                        <p className="text-neutral-300 text-sm mt-1 line-clamp-2">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    {/* Add Button */}
                    <button
                      onClick={() => {
                        const userId = user._id || user.id || '';
                        const username = user.username || '';
                        console.log('Add button clicked for user:', user);
                        console.log('Extracted userId:', userId, 'username:', username);
                        handleAddClick(userId, username);
                      }}
                      disabled={addCollaboratorMutation.isPending || isFetchingUser}
                      className="bg-primary-400 text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      <LuUserPlus className="w-4 h-4" />
                      {addCollaboratorMutation.isPending ? 'Adding...' : isFetchingUser ? 'Loading...' : 'Add'}
                    </button>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9000] shadow-sm p-4">
          <div className="bg-background shadow-lg rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center">
                <LuCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-50">Confirm Add Author</h3>
            </div>
            
            <p className="text-neutral-300 mb-6">
              {isFetchingUser 
                ? 'Loading user details...' 
                : 'Are you sure you want to add this author to the stream? They will be able to contribute content to this publication.'
              }
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelConfirm}
                disabled={isFetchingUser}
                className="px-4 py-2 text-neutral-400 hover:text-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  console.log('Yes, Add Author button clicked');
                  e.preventDefault();
                  e.stopPropagation();
                  handleConfirmAdd();
                }}
                disabled={addCollaboratorMutation.isPending || isFetchingUser}
                className="bg-primary-400 text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetchingUser 
                  ? 'Loading...' 
                  : addCollaboratorMutation.isPending 
                    ? 'Adding...' 
                    : 'Yes, Add Author'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddAuthorModal;

