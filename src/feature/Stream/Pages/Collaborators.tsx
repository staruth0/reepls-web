import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LuArrowLeft, LuUsers } from 'react-icons/lu';
import Topbar from '../../../components/atoms/Topbar/Topbar';
import StreamSidebar from '../components/StreamSidebar';
import { useGetCollaborators, useGetPublicationById } from '../Hooks';
import AuthorCard from '../components/AuthorCard';
import { useRemoveCollaborator } from '../Hooks';

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

const Collaborators: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { data: collaboratorsData, isLoading: collaboratorsLoading, error: collaboratorsError, refetch } = useGetCollaborators(id || '');
  const { data: publicationData, isLoading: publicationLoading } = useGetPublicationById(id || '');
  const removeCollaboratorMutation = useRemoveCollaborator();

  const handleBackClick = () => {
    navigate(`/stream/${id}`);
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      await removeCollaboratorMutation.mutateAsync({
        publicationId: id || '',
        collaboratorId: collaboratorId
      });
      // Refetch collaborators after successful removal
      refetch();
    } catch (error) {
      console.error('Error removing collaborator:', error);
    }
  };

  const handleChangeAccessRights = (collaboratorId: string) => {
    // TODO: Implement change access rights functionality
    console.log('Change access rights for collaborator:', collaboratorId);
  };

  useEffect(() => {
    console.log('Collaborators data received:', collaboratorsData);
  }, [publicationData, collaboratorsData]);

  const collaborators = collaboratorsData?.collaborators || [];

  return (
    <div className="lg:grid grid-cols-[4fr_1.65fr]">
      <div className="min-h-screen lg:border-r-[1px] border-neutral-500">
        <Topbar>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-neutral-700 rounded-full transition-colors"
            >
              <LuArrowLeft className="w-5 h-5 text-neutral-300" />
            </button>
            <div className="flex items-center gap-2">
              <LuUsers className="w-5 h-5 text-neutral-300" />
              <span className="text-neutral-50 font-semibold">
                {publicationLoading ? (
                  <div className="w-32 h-5 bg-neutral-600 rounded animate-pulse"></div>
                ) : (
                  `${publicationData?.title || 'Publication'} Collaborators`
                )}
              </span>
            </div>
          </div>
        </Topbar>

        <div className="max-w-2xl mx-auto space-y-6 p-6">
          {/* Header Stats */}
          <div className="mb-6">
            {collaboratorsLoading ? (
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-neutral-600 rounded-full animate-pulse"></div>
                <div className="w-24 h-4 bg-neutral-600 rounded animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center">
                  <LuUsers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-neutral-50">
                    {collaboratorsData?.totalResults || 0}
                  </span>
                  <span className="ml-2">
                    {collaboratorsData?.totalResults === 1 ? 'Collaborator' : 'Collaborators'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Collaborators List */}
          <div className="space-y-4">
            {collaboratorsLoading ? (
              // Loading skeleton
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="bg-neutral-800 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-neutral-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-neutral-700 rounded w-32 mb-2"></div>
                        <div className="h-3 bg-neutral-700 rounded w-24"></div>
                      </div>
                      <div className="h-8 bg-neutral-700 rounded w-20"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : collaboratorsError ? (
              // Error state
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuUsers className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-50 mb-2">Error loading collaborators</h3>
                <p className="text-neutral-400 text-center mb-4">Something went wrong while loading the collaborators.</p>
                <button
                  onClick={() => refetch()}
                  className="bg-primary-400 text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : !collaborators.length ? (
              // Empty state
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-neutral-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LuUsers className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-50 mb-2">No collaborators yet</h3>
                <p className="text-neutral-400">This publication doesn't have any collaborators at the moment.</p>
              </div>
            ) : (
              // Collaborators list
              collaborators.map((collaborator: Collaborator) => (
                <AuthorCard
                  key={collaborator._id}
                  collaborator={collaborator}
                  onRemoveCollaborator={handleRemoveCollaborator}
                  onChangeAccessRights={handleChangeAccessRights}
                  isOwner={collaborator.role === 'owner'}
                  isRemoving={removeCollaboratorMutation.isPending}
                />
              ))
            )}
          </div>

          {/* Pagination Info */}
          {collaboratorsData && collaboratorsData.totalPages > 1 && (
            <div className="mt-8 text-center text-neutral-400 text-sm">
              Page {collaboratorsData.currentPage} of {collaboratorsData.totalPages}
            </div>
          )}
        </div>
      </div>

      <div className="communique sidebar bg-background hidden lg:block">
         <StreamSidebar />
      </div>
    </div>
  );
};

export default Collaborators;

