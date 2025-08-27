import { Article, Publication } from "../../../models/datamodels";
import { apiClient } from "../../../services/apiClient";


// 1. Get publication details (public-facing)
const getPublicationById = async (id: string) => {
  const { data } = await apiClient.get(`/api-v1/publications/${id}`);
  return data;
};

// 2. Create new publication (cover_image as a string URL)

const createPublication = async (payload: Publication) => {
  const { data } = await apiClient.post(`/api-v1/publications`, payload);
  return data;
};

// 3. Edit publication (cover_image as a string URL)
const editPublication = async (id: string, payload: Publication) => {
  const { data } = await apiClient.put(`/api-v1/publications/${id}`, payload);
  return data;
};

// 4. Delete publication
const deletePublication = async (id: string) => {
  const { data } = await apiClient.delete(`/api-v1/publications/${id}`);
  return data;
};

// 5. Get all publications by current user
const getMyPublications = async () => {
  const { data } = await apiClient.get(`/api-v1/publications/mine`);
  return data;
};

// 7. Create or update article with optional publication assignment

const createOrUpdateArticle = async (payload: Article) => {

  const { data } = await apiClient.post(`/api-v1/articles`, payload);
  return data;
};

// 8. Get user subscriptions
const getUserSubscriptions = async () => {
  const { data } = await apiClient.get(`/api-v1/me/subscriptions`);
  return data;
};

// 9. Subscribe/unsubscribe publication toggle
const toggleSubscription = async (id: string) => {
  const { data } = await apiClient.post(`/api-v1/publications/${id}/subscribe`);
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
};
