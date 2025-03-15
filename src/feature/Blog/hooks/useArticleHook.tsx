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
  getArticlesByCategory,
  getCommuniquerArticles,
  getFollowedArticles,
  getRecommendedArticles,
  updateArticle,
} from '../api';
// Hook for creating an article
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (article: Article) => createArticle(article),
    onSuccess: (data) => {
      console.log('Article created:', data);
      // Invalidatx the "articles" query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate('/articles');
    },
    onError: (error) => {
      console.error('Error creating article:', error);
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
      console.log('lastpage', lastPage);
      console.log('allpage', allPages);
      const articlesFetched = allPages.length * 10; // 10 articles per page
      if (articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1; // Next page number
      }
      return undefined; // Stop when we’ve fetched all articles
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
      console.log('lastPage', lastPage);
      console.log('allPages', allPages);
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
      console.log('lastPage', lastPage);
      console.log('allPages', allPages);
      const articlesFetched = allPages.length * 10; 
      if (articlesFetched < lastPage.totalArticles) {
        return allPages.length + 1; 
      }
      return undefined; // No more pages
    },
  });
};

// Hook for fetching recommended articles
export const useGetRecommendedArticles = () => {
  return useQuery({
    queryKey: ['recommended-articles'],
    queryFn: () => getRecommendedArticles(),
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

// Hook for updating an article
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ articleId, article }: { articleId: string; article: Article }) => updateArticle(articleId, article),
    onSuccess: (data, variables) => {
      console.log('Article updated:', data);
      // Invalidatx the "article" and "articles" queries to refresh the data
      queryClient.invalidateQueries({
        queryKey: ['article', variables.articleId],
      });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate(`/articles/${variables.articleId}`);
    },
    onError: (error) => {
      console.error('Error updating article:', error);
    },
  });
};

// Hook for deleting an article
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (articleId: string) => deleteArticle(articleId),
    onSuccess: () => {
      console.log('Article deleted');
      // Invalidatx the "articles" query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      navigate('/articles');
    },
    onError: (error) => {
      console.error('Error deleting article:', error);
    },
  });
};
