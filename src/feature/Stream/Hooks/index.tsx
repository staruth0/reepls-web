import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getPublicationById,
  createPublication,
  editPublication,
  deletePublication,
  getMyPublications,
  createOrUpdateArticle,
  getUserSubscriptions,
  toggleSubscription,
  pushArticleToPublication,
  removeArticleFromPublication,
  restorePublication,
  getSuggestedPublications,
  getPublicationSubscribers,
  addCollaborator,
  getCollaborators,
  getMyCollaboratorPublications,
  updateCollaboratorPermission,
  removeCollaborator,
  leavePublication,
} from "../Api/";
import { Article, Publication } from "../../../models/datamodels";

// Get publication by ID
export const useGetPublicationById = (id: string) => {
  return useQuery({
    queryKey: ["publication", id],
    queryFn: () => getPublicationById(id),
  });
};

// Create publication
export const useCreatePublication = () => {
  return useMutation({
    mutationFn: (payload: Publication) => createPublication(payload),
  });
};

// Edit publication
export const useEditPublication = () => {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Publication
    }) => editPublication(id, payload),
  });
};

// Delete publication
export const useDeletePublication = () => {
  return useMutation({
    mutationFn: (id: string) => deletePublication(id),
  });
};

// Get current user's publications
export const useGetMyPublications = () => {
  return useQuery({
    queryKey: ["myPublications"],
    queryFn: () => getMyPublications(),
  });
};

// Create or update article with publication assignment
export const useCreateOrUpdateArticle = () => {
  return useMutation({
    mutationFn: (payload:Article) => createOrUpdateArticle(payload),
  });
};

// Get user subscriptions
export const useGetUserSubscriptions = () => {
  return useQuery({
    queryKey: ["userSubscriptions"],
    queryFn: () => getUserSubscriptions(),
  });
};

// Toggle subscription (subscribe/unsubscribe)
export const useToggleSubscription = () => {
  return useMutation({
    mutationFn: ({ id}: { id: string }) => 
      toggleSubscription(id),
  });
};

// Push existing article to publication
export const usePushArticleToPublication = () => {
  return useMutation({
    mutationFn: ({
      articleId,
      publicationId,
    }: {
      articleId: string;
      publicationId: string;
    }) => pushArticleToPublication(articleId, publicationId),
  });
};

// Remove article from publication
export const useRemoveArticleFromPublication = () => {
  return useMutation({
    mutationFn: ({
      publicationId,
      articleId,
    }: {
      publicationId: string;
      articleId: string;
    }) => removeArticleFromPublication(publicationId, articleId),
  });
};

// Restore publication
export const useRestorePublication = () => {
  return useMutation({
    mutationFn: (id: string) => restorePublication(id),
  });
};

// Get suggested publications
export const useGetSuggestedPublications = () => {
  return useQuery({
    queryKey: ["suggestedPublications"],
    queryFn: () => getSuggestedPublications(),
  });
};

// Get publication subscribers
export const useGetPublicationSubscribers = (id: string) => {
  return useQuery({
    queryKey: ["publicationSubscribers", id],
    queryFn: () => getPublicationSubscribers(id),
  });
};

// Add collaborator
export const useAddCollaborator = () => {
  return useMutation({
    mutationFn: ({
      id,
      userId,
      permission,
    }: {
      id: string;
      userId: string;
      permission: string;
    }) => addCollaborator(id, userId, permission),
  });
};

// Get collaborators
export const useGetCollaborators = (id: string) => {
  return useQuery({
    queryKey: ["collaborators", id],
    queryFn: () => getCollaborators(id),
  });
};

// Get my collaborator publications
export const useGetMyCollaboratorPublications = () => {
  return useQuery({
    queryKey: ["myCollaboratorPublications"],
    queryFn: () => getMyCollaboratorPublications(),
  });
};

// Update collaborator permission
export const useUpdateCollaboratorPermission = () => {
  return useMutation({
    mutationFn: ({
      publicationId,
      collaboratorId,
      permission,
    }: {
      publicationId: string;
      collaboratorId: string;
      permission: string;
    }) => updateCollaboratorPermission(publicationId, collaboratorId, permission),
  });
};

// Remove collaborator
export const useRemoveCollaborator = () => {
  return useMutation({
    mutationFn: ({
      publicationId,
      collaboratorId,
    }: {
      publicationId: string;
      collaboratorId: string;
    }) => removeCollaborator(publicationId, collaboratorId),
  });
};

// Leave publication
export const useLeavePublication = () => {
  return useMutation({
    mutationFn: (id: string) => leavePublication(id),
  });
};
