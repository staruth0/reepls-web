import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: Publication) => createPublication(payload),
    onSuccess: () => {
      // Invalidate publications-related queries
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
    },
  });
};

// Edit publication
export const useEditPublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Publication
    }) => editPublication(id, payload),
    onSuccess: (variables) => {
      // Invalidate specific publication and related queries
      queryClient.invalidateQueries({ queryKey: ["publication", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
    },
  });
};

// Delete publication
export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deletePublication(id),
    onSuccess: (id) => {
      // Invalidate specific publication and related queries
      queryClient.invalidateQueries({ queryKey: ["publication", id] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["publicationSubscribers", id] });
      queryClient.invalidateQueries({ queryKey: ["collaborators", id] });
    },
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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload:Article) => createOrUpdateArticle(payload),
    onSuccess: (variables) => {
      // Invalidate article-related queries
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
      queryClient.invalidateQueries({ queryKey: ["followed-articles"] });
      
      // If article has publication_id, invalidate publication queries
      if (variables.publication_id) {
        queryClient.invalidateQueries({ queryKey: ["publication", variables.publication_id] });
        queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      }
    },
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
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id}: { id: string }) => 
      toggleSubscription(id),
    onSuccess: (variables) => {
      // Invalidate subscription-related queries
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["publication", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["publicationSubscribers", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
    },
  });
};

// Push existing article to publication
export const usePushArticleToPublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      articleId,
      publicationId,
    }: {
      articleId: string;
      publicationId: string;
    }) => pushArticleToPublication(articleId, publicationId),
    onSuccess: (variables) => {
      // Invalidate article and publication queries
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", variables.articleId] });
      queryClient.invalidateQueries({ queryKey: ["publication", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
    },
  });
};

// Remove article from publication
export const useRemoveArticleFromPublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      publicationId,
      articleId,
    }: {
      publicationId: string;
      articleId: string;
    }) => removeArticleFromPublication(publicationId, articleId),
    onSuccess: (variables) => {
      // Invalidate article and publication queries
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article", variables.articleId] });
      queryClient.invalidateQueries({ queryKey: ["publication", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
    },
  });
};

// Restore publication
export const useRestorePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => restorePublication(id),
    onSuccess: ( id) => {
      // Invalidate publication-related queries
      queryClient.invalidateQueries({ queryKey: ["publication", id] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
    },
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
  const queryClient = useQueryClient();
  
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
    onSuccess: (variables) => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["publication", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
    },
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
  const queryClient = useQueryClient();
  
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
    onSuccess: ( variables) => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["publication", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
    },
  });
};

// Remove collaborator
export const useRemoveCollaborator = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      publicationId,
      collaboratorId,
    }: {
      publicationId: string;
      collaboratorId: string;
    }) => removeCollaborator(publicationId, collaboratorId),
    onSuccess: (variables) => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["publication", variables.publicationId] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
    },
  });
};

// Leave publication
export const useLeavePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => leavePublication(id),
    onSuccess: (id) => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators", id] });
      queryClient.invalidateQueries({ queryKey: ["publication", id] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
    },
  });
};

// Export subscription status hooks
export { 
  useSubscriptionStatus, 
  useActiveSubscriptions, 
  useMultipleSubscriptionStatus 
} from "./useSubscriptionStatus";