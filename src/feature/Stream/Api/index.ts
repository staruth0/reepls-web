import { Article, Publication } from "../../../models/datamodels";
import { apiClient } from "../../../services/apiClient";


// 1. Get publication details (public-facing)
const getPublicationById = async (id: string) => {
  const { data } = await apiClient.get(`/publications/${id}`);
  return data;
};

// 2. Create new publication (cover_image as a string URL)

const createPublication = async (payload: Publication) => {
  const { data } = await apiClient.post(`/publications/`, payload);
  return data;
};

// 3. Edit publication (cover_image as a string URL)
const editPublication = async (id: string, payload: Publication) => {
  const { data } = await apiClient.put(`/publications/${id}`, payload);
  return data;
};

// 4. Delete publication
const deletePublication = async (id: string) => {
  const { data } = await apiClient.delete(`/publications/${id}`);
  return data;
};

// 5. Get all publications by current user
const getMyPublications = async () => {
  const { data } = await apiClient.get(`/publications/mine`);
  return data;
};

// 7. Create or update article with optional publication assignment

const createOrUpdateArticle = async (payload: Article) => {

  const { data } = await apiClient.post(`/articles`, payload);
  return data;
};

// 8. Get user subscriptions
const getUserSubscriptions = async () => {
  const { data } = await apiClient.get(`/me/subscriptions`);
  return data;
};

// 9. Subscribe/unsubscribe publication toggle
const toggleSubscription = async (id: string) => {
  const { data } = await apiClient.post(`/publications/${id}/subscribe`);
  return data;
};

// 10. Push existing article to publication
const pushArticleToPublication = async (articleId: string, publicationId: string) => {
  const { data } = await apiClient.post(`/publications/${articleId}/articles`, { publication_id: publicationId });
  return data;
};

// 11. Remove article from publication
const removeArticleFromPublication = async (publicationId: string, articleId: string) => {
  const { data } = await apiClient.delete(`/publications/${publicationId}/articles/${articleId}`);
  return data;
};

// 12. Restore publication
const restorePublication = async (id: string) => {
  const { data } = await apiClient.post(`/publications/${id}/restore`);
  return data;
};

// 13. Get suggested publications
const getSuggestedPublications = async () => {
  const { data } = await apiClient.get(`/publications/suggested`);
  return data;
};

// 14. Get publication subscribers
const getPublicationSubscribers = async (id: string) => {
  const { data } = await apiClient.get(`/publications/${id}/subscribers`);
  return data;
};

// 15. Add collaborator
const addCollaborator = async (id: string, userId: string, permission: string) => {
  const { data } = await apiClient.post(`/publications/${id}/collaborators`, { user_id: userId, permission });
  return data;
};

// 16. List all collaborators
const getCollaborators = async (id: string) => {
  const { data } = await apiClient.get(`/publications/${id}/collaborators`);
  return data;
};

// 17. List all publications for a collaborator
const getMyCollaboratorPublications = async () => {
  const { data } = await apiClient.get(`/publications/my-publications`);
  return data;
};

// 18. Update collaborator permission
const updateCollaboratorPermission = async (publicationId: string, collaboratorId: string, permission: string) => {
  const { data } = await apiClient.patch(`/publications/${publicationId}/collaborators/${collaboratorId}`, { permission });
  return data;
};

// 19. Remove collaborator
const removeCollaborator = async (publicationId: string, collaboratorId: string) => {
  const { data } = await apiClient.delete(`/publications/${publicationId}/collaborators/${collaboratorId}`);
  return data;
};

// 20. Collaborator leaves publication
const leavePublication = async (id: string) => {
  const { data } = await apiClient.delete(`/publications/${id}/collaborators/self`);
  return data;
};

// 21. Get publication media
const getPublicationMedia = async (publicationId: string) => {
  const { data } = await apiClient.get(`/publications/${publicationId}/media`);
  return data;
};

// 22. Get publication articles
const getPublicationArticles = async (publicationId: string) => {
  const { data } = await apiClient.get(`/publications/${publicationId}/articles`);
  return data;
};

// 23. Get all publications that a user is a collaborator or an owner of
const getAllUserPublications = async () => {
  const { data } = await apiClient.get(`/publications/all`);
  return data;
};

// 24. Subscribe to publication
const subscribeToPublication = async (publicationId: string) => {
  const { data } = await apiClient.post(`/publications/${publicationId}/subscribe-only`);
  return data;
};

// 25. Unsubscribe from publication
const unsubscribeFromPublication = async (publicationId: string) => {
  const { data } = await apiClient.delete(`/publications/${publicationId}/unsubscribe`);
  return data;
};

// 26. Get my subscriptions
const getMySubscriptions = async () => {
  const { data } = await apiClient.get(`/publications/me/subscriptions`);
  return data;
};

// 27. Get publication subscription status
const getPublicationSubscriptionStatus = async (publicationId: string) => {
  const { data } = await apiClient.get(`/publications/${publicationId}/subscription-status`);
  return data;
};

// 28. Get publication author
const getPublicationAuthor = async (publicationId: string) => {
  const { data } = await apiClient.get(`/publications/${publicationId}/author`);
  return data;
};

export {
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
};
