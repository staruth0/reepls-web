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
  getPublicationMedia,
  getPublicationArticles,
  getAllUserPublications,
  subscribeToPublication,
  unsubscribeFromPublication,
  getMySubscriptions,
  getPublicationSubscriptionStatus,
  getPublicationAuthor,
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
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
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
    onSuccess: () => {
      // Invalidate specific publication and related queries
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
    },
  });
};

// Delete publication
export const useDeletePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deletePublication(id),
    onSuccess: () => {
      // Invalidate specific publication and related queries
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
      queryClient.invalidateQueries({ queryKey: ["publicationSubscribers"] });
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
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
    onSuccess: () => {
      // Invalidate article-related queries
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
      queryClient.invalidateQueries({ queryKey: ["followed-articles"] });
      
     
        queryClient.invalidateQueries({ queryKey: ["publication"] });
        queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      
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
    onSuccess: () => {
      // Invalidate subscription-related queries
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["publicationSubscribers"] });
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
    onSuccess: () => {
      // Invalidate article and publication queries
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
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
    onSuccess: () => {
      // Invalidate article and publication queries
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["article"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
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
          onSuccess: () => {
      // Invalidate publication-related queries
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["myPublications"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
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
    onSuccess: () => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
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
    onSuccess: () => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
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
    onSuccess: () => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
    },
  });
};

// Leave publication
export const useLeavePublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => leavePublication(id),
    onSuccess: () => {
      // Invalidate collaborator and publication queries
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["myCollaboratorPublications"] });
      queryClient.invalidateQueries({ queryKey: ["allUserPublications"] });
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
    },
  });
};

// Get publication media
export const useGetPublicationMedia = (publicationId: string) => {
  return useQuery({
    queryKey: ["publicationMedia", publicationId],
    queryFn: () => getPublicationMedia(publicationId),
    enabled: !!publicationId,
  });
};

// Get publication articles
export const useGetPublicationArticles = (publicationId: string) => {
  return useQuery({
    queryKey: ["publicationArticles", publicationId],
    queryFn: () => getPublicationArticles(publicationId),
    enabled: !!publicationId,
  });
};

// Get all publications that a user is a collaborator or an owner of
export const useGetAllUserPublications = () => {
  return useQuery({
    queryKey: ["allUserPublications"],
    queryFn: () => getAllUserPublications(),
  });
};

// Subscribe to publication
export const useSubscribeToPublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (publicationId: string) => subscribeToPublication(publicationId),
    onSuccess: () => {
      // Invalidate subscription-related queries
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["publicationSubscribers"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
    },
  });
};

// Unsubscribe from publication
export const useUnsubscribeFromPublication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (publicationId: string) => unsubscribeFromPublication(publicationId),
    onSuccess: () => {
      // Invalidate subscription-related queries
      queryClient.invalidateQueries({ queryKey: ["userSubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["publication"] });
      queryClient.invalidateQueries({ queryKey: ["publicationSubscribers"] });
      queryClient.invalidateQueries({ queryKey: ["suggestedPublications"] });
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
    },
  });
};

// Get my subscriptions
export const useGetMySubscriptions = () => {
  return useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: () => getMySubscriptions(),
  });
};

// Get publication subscription status
export const useGetPublicationSubscriptionStatus = (publicationId: string) => {
  return useQuery({
    queryKey: ["subscriptionStatus", publicationId],
    queryFn: () => getPublicationSubscriptionStatus(publicationId),
    enabled: !!publicationId,
  });
};

// Get publication author
export const useGetPublicationAuthor = (publicationId: string) => {
  return useQuery({
    queryKey: ["publicationAuthor", publicationId],
    queryFn: () => getPublicationAuthor(publicationId),
    enabled: !!publicationId,
  });
};

