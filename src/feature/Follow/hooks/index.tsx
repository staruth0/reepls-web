import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { followUser, getFollowers, getFollowing, unfollowUser } from '../api';
import { handleMutationError } from '../../../utils/mutationErrorHandler';

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => followUser(followedId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({
        queryKey: ['following'],
      });
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (followedId: string) => unfollowUser(followedId),
    onSuccess: () => {
      // Invalidate queries to refetch data in the background
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({
        queryKey: ['following'],
      });
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });
};

export const useGetFollowers = (userId: string) => {
  return useQuery({
    queryKey: ['followers', userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
};

export const useGetFollowing = (userId: string) => {
  return useQuery({
    queryKey: ['following', userId],
    queryFn: () => getFollowing(userId),
    enabled: !!userId,
  });
};
