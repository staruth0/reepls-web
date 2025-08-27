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
} from "../Api/";
import { Publication } from "../../../models/datamodels";

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
    mutationFn: (payload: {
      title: string;
      content: string;
      tags: string[];
      publication_id?: string;
    }) => createOrUpdateArticle(payload),
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
    mutationFn: (id: string) => toggleSubscription(id),
  });
};
