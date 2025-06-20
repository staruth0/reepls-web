import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PREVIEW_SLUG } from '../../../constants';
import { Article } from '../../../models/datamodels';
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleByAuthorId,
  getArticleById,
  getArticleBySlug,
  getArticlesByCategory,
  getAuthorArticles,
  getAuthorPosts,
  getCommuniquerArticles,
  getFollowedArticles,
  getRecommendedArticles,
getArticleStatitics,
  updateArticle,
} from '../api';
// Hook for creating an article
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (article: Article) => createArticle(article),
    onSuccess: () => {
      // Invalidatx the "articles" query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['recommended-articles'] });
      navigate('/articles');
    },
    onError: (error) => {
      void error;
    },
  });
};

// Hook for fetching a single article by ID
export const useGetArticleById = (articleId: string) => {
  return useQuery({
    queryKey: ['article', articleId],
    queryFn: () => getArticleById(articleId),
    enabled: articleId !== PREVIEW_SLUG,
  });
};
// Hook for fetching a single article by ID
export const useGetArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug),
    enabled:slug !== PREVIEW_SLUG,
  });
};

// Hook for fetching articles by an author with ID
export const useGetArticlesByAuthorId = (authorId: string) => {
  return useQuery({
    queryKey: ['articles-by-author', authorId],
    queryFn: () => getArticleByAuthorId(authorId),
  });
};


// Hook for fetching all articles with infinite scrolling
export const useGetAllArticles = () => {
  return useInfiniteQuery({
    queryKey: ['articles'],
    queryFn: getAllArticles,
    initialPageParam: 1, // Start fetching from page 1
    getNextPageParam: (lastPage, allPages) => {
      const articlesFetched = allPages.length * 10; // 10 articles per page
      if (articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1; // Next page number
      }
      return undefined; // Stop when we’ve fetched all articles
    },
  });
};


// Hook for fetching recommended articles with infinite scrolling
export const useGetRecommendedArticles = () => {
  return useInfiniteQuery({
    queryKey: ['recommended-articles'],
    queryFn: getRecommendedArticles,
    initialPageParam: 1, 
    getNextPageParam: (lastPage, allPages) => {
      
      const articlesFetched = allPages.length * 10; 
      if (articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1; // Next page number
      }
      return undefined; 
    },
  });
};

// Hook for fetching followed articles with infinite scrolling

export const useGetFollowedArticles = () => {
  return useInfiniteQuery({
    queryKey: ['followed-articles'],
    queryFn: getFollowedArticles,
    initialPageParam: 1, 
    getNextPageParam: (lastPage, allPages) => {
      
      const articlesFetched = allPages.length * 10; 
      if (articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1; // Next page number
      }
      return undefined; 
    },
  });
};

// Hook for fetching communique articles
export const useGetCommuniquerArticles = () => {
  return useInfiniteQuery({
    queryKey: ['communiquer-articles'],
    queryFn: getCommuniquerArticles,
    initialPageParam: 1, // Start with page 1
    getNextPageParam: (lastPage, allPages) => {
     
      const articlesFetched = allPages.length * 10; 
      if (articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1; 
      }
      return undefined; // No more pages
    },
  });
};




export const useGetAuthorPosts = (authorId: string) => {
  return useInfiniteQuery({
    queryKey: ["authorPosts", authorId],
    queryFn: ({ pageParam }) => getAuthorPosts({ pageParam, authorId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const postsFetched = allPages.length * 10; // 10 posts per page
      if (postsFetched < lastPage.totalPosts) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!authorId, 
  });
};

export const useGetAuthorArticles = (authorId: string) => {
  return useInfiniteQuery({
    queryKey: ["authorArticles", authorId],
    queryFn: ({ pageParam }) => getAuthorArticles({ pageParam, authorId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const articlesFetched = allPages.length * 10; // 10 articles per page
      if (articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!authorId, 
  });
};




// Hook for fetching articles by category
export const useGetArticlesByCategory = (category: string) => {
  return useQuery({
    queryKey: ['articles-by-category', category],
    queryFn: () => getArticlesByCategory(category),
    enabled: !!category,
  });
};
// Hook for fetching articles by category
export const useGetArticleStatitics = (id: string) => {
  return useQuery({
    queryKey: ['articles-by-category'],
    queryFn: () => getArticleStatitics(id),
    enabled: !!id,
  });
};

// Hook for updating an article
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ articleId, article }: { articleId: string; article: Article }) => updateArticle(articleId, article),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['articles'],
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
     
    },
    onError: (error) => {
      void error;
    },
  });
};

// Hook for deleting an article
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => deleteArticle(articleId),
    onSuccess: () => {
      // Invalidatx the "articles" query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      
    },
    onError: (error) => {
      void error;
    },
  });
};
