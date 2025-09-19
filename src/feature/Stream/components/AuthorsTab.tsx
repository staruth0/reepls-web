import React, { useState } from 'react';
import { Publication } from '../../../models/datamodels';
import { LuUserPlus } from 'react-icons/lu';
import AddAuthorModal from './AddAuthorModal';
import AuthorCard from './AuthorCard';
import { useGetCollaborators, useRemoveCollaborator } from '../Hooks';
import { useUser } from '../../../hooks/useUser';

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

interface AuthorsTabProps {
  stream: Publication;
}

const AuthorsTab: React.FC<AuthorsTabProps> = ({ stream }) => {
  const [isAddAuthorModalOpen, setIsAddAuthorModalOpen] = useState(false);
  const { data: collaboratorsData, isLoading, error, refetch } = useGetCollaborators(stream._id || '');
  const removeCollaboratorMutation = useRemoveCollaborator();

  const {authUser} = useUser()

  console.log('Collaborators data:', collaboratorsData);

  const collaborators = collaboratorsData?.collaborators || [];

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      await removeCollaboratorMutation.mutateAsync({
        publicationId: stream.id || '',
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

  const isCurrentAuthorstream = authUser?.id === stream?.owner_id;

  return (
    <div className="pb-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-center">
      
        {isCurrentAuthorstream && (
          <div
          onClick={() => setIsAddAuthorModalOpen(true)}
          className="text-primary-400 cursor-pointer hover:text-primary-500 transition-colors text-sm"
        >
          <LuUserPlus className="w-4 h-4 inline mr-2" />
          Add Author
          </div>
        )}
      </div>

      {/* Authors List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-neutral-400">Loading collaborators...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <div className="text-red-400 text-center">Error loading collaborators</div>
            <button
              onClick={() => refetch()}
              className="bg-primary-400 text-white px-4 py-2 rounded-full hover:bg-primary-500 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : collaborators.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-neutral-400 text-center">
              <p>No collaborators yet</p>
              <p className="text-sm mt-1">Add authors to start collaborating</p>
            </div>
          </div>
        ) : (
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

      {/* Add Author Modal */}
      <AddAuthorModal
        isOpen={isAddAuthorModalOpen}
        onClose={() => setIsAddAuthorModalOpen(false)}
        streamId={stream._id || stream.id || ''}
      />
    </div>
  );
};

export default AuthorsTab;