import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { saveArticle, removeSavedArticle, getSavedArticles, getSavedArticle, getSavedPosts, getReadingHistory, updateReadingHistory, deleteReadingHistory } from "../api";
import { handleMutationError } from "../../../utils/mutationErrorHandler";

// Assuming your getSavedArticles API returns an object like { articles: [...] }
// where each item in articles is an object potentially like { article: { _id: "..." } }
// If your Article type directly has _id, adjust the structure accordingly.
interface SavedArticleItem {
  article: {
    _id: string;
    // ... other article properties if needed for optimistic display
  };
  // ... other properties of the saved item (e.g., savedDate)
}

interface SavedArticlesResponse {
  articles: SavedArticleItem[];
  totalArticles?: number; // From useGetSavedArticle's lastPage
  // ... other properties from your getSavedArticles API response
}


export const useSaveArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => saveArticle(articleId), // Call your API to save the article

    // onMutate is called before the mutation function (saveArticle) is fired.
    // It's the perfect place for an optimistic update.
    onMutate: async (articleId: string) => {
      // 1. Cancel any outgoing refetches for 'savedArticles'.
      // This ensures that our optimistic update isn't immediately overwritten by stale data.
      await queryClient.cancelQueries({ queryKey: ["savedArticles"] });

      // 2. Snapshot the current 'savedArticles' data before we make any changes.
      // This snapshot is crucial for rolling back if the mutation fails.
      const previousSavedArticles = queryClient.getQueryData<SavedArticlesResponse>(["savedArticles"]);

      // 3. Optimistically update the 'savedArticles' cache.
      // This will immediately re-render any components using 'useGetSavedArticles'.
      queryClient.setQueryData(["savedArticles"], (old: SavedArticlesResponse | undefined) => {
        // Ensure 'old' exists and has an 'articles' array
        const currentArticles = old?.articles || [];

        // Check if the article is already saved to prevent duplicates in optimistic state
        const isAlreadySaved = currentArticles.some(
          (item) => item.article._id === articleId
        );

        if (isAlreadySaved) {
          return old; // No change needed if already optimistically saved
        }

        // Add the new article to the saved list.
        // The structure of the added item ({ article: { _id: articleId } })
        // MUST match the structure of items returned by your getSavedArticles API.
        const newSavedItem: SavedArticleItem = {
          article: { _id: articleId }
          // Add other properties if your UI relies on them for optimistic display
        };

        return {
          ...old, // Spread any other properties from the old response (e.g., totalArticles)
          articles: [...currentArticles, newSavedItem],
        };
      });

      // 4. Return a context object. This context is passed to onError and onSettled,
      // allowing us to access the 'previousSavedArticles' for rollback.
      return { previousSavedArticles };
    },

    // onSuccess is called if the mutation (saveArticle) is successful.
    // We primarily use it here for invalidation to ensure eventual consistency.
    onSuccess: () => {
      // The optimistic update handled the immediate UI change.
      // Now, invalidate the query to prompt a background refetch.
      // This refetch will confirm the server state and ensure our cache is accurate.
      queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
    },

    // onError is called if the mutation (saveArticle) fails.
    // This is where we implement the rollback logic using the context from onMutate.
    onError: (error) => {
      handleMutationError(error);
    },
    // onSettled is called regardless of success or failure.
    // It's often used for final invalidation or cleanup.
    onSettled: () => {
      // In this case, onSuccess already calls invalidateQueries.
      // You could move it here if you want it to always refetch, even on error (after rollback).
      // For this specific case, having it in onSuccess is sufficient as onError handles rollback.
    },
  });
};

export const useRemoveSavedArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => removeSavedArticle(articleId), // Call your API to remove the article

    // onMutate for optimistic removal.
    onMutate: async (articleId: string) => {
      // 1. Cancel any outgoing refetches for 'savedArticles'.
      await queryClient.cancelQueries({ queryKey: ["savedArticles"] });

      // 2. Snapshot the current 'savedArticles' data.
      const previousSavedArticles = queryClient.getQueryData<SavedArticlesResponse>(["savedArticles"]);

      // 3. Optimistically update the 'savedArticles' cache by removing the article.
      queryClient.setQueryData(["savedArticles"], (old: SavedArticlesResponse | undefined) => {
        const currentArticles = old?.articles || [];

        // Filter out the article that is being removed
        return {
          ...old,
          articles: currentArticles.filter(
            (item) => item.article._id !== articleId
          ),
        };
      });

      // 4. Return context for rollback.
      return { previousSavedArticles };
    },

    // onSuccess for successful removal.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedArticles"] });
    },

    // onError for failed removal, implement rollback.
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

export const useGetSavedArticles = () => {
  return useQuery({
    queryKey: ["savedArticles"],
    queryFn: () => getSavedArticles(),
  });
};


export const useGetSavedPosts = () => {
  return useInfiniteQuery({
    queryKey: ["savedPosts"],
    queryFn: ({ pageParam = 1 }) => getSavedPosts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {

      const postsFetched = allPages.length * 10; // Assumes 10 posts per page
      if (lastPage?.totalPosts && postsFetched < lastPage.totalPosts) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: true,

  });
};

export const useGetSavedArticle = () => {
  return useInfiniteQuery({
    queryKey: ["savedArticles"], // This query key conflicts with useGetSavedArticles
    queryFn: ({ pageParam = 1 }) => getSavedArticle({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {

      const articlesFetched = allPages.length * 10;
      if (lastPage?.totalArticles && articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: true,

  });
};

// Hook for updating reading history
export const useUpdateReadingHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleSlug: string) => updateReadingHistory(articleSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readingHistory"] });
    },
  });
};

// Hook for getting reading history
export const useGetReadingHistory = () => {
  return useQuery({
    queryKey: ["readingHistory"],
    queryFn: () => getReadingHistory(),
  });
};

// Hook for deleting reading history
export const useDeleteReadingHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (articleSlug: string) => deleteReadingHistory(articleSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["readingHistory"] });
    },
  });
};