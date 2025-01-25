import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  createReport,
  getAllReports,
  getReportsWithFilters,
  getReportById,
  updateReportStatus,
  deleteReport,
  createComment,
  getCommentsByArticleId,
  updateComment,
  deleteComment,
  getRepliesForComment,
} from "../api";
import { Reaction, Report, Comment } from "../../../models/datamodels";

// Reactions Hooks
export const useCreateReaction = () => {
  return useMutation({
    mutationFn: (reaction: Reaction) => createReaction(reaction),
    onSuccess: (data) => {
      console.log("Reaction created:", data);
    },
    onError: (error) => {
      console.error("Error creating reaction:", error);
    },
  });
};

export const useGetReactionById = (reactionId: string) => {
  return useQuery({
    queryKey: ["reaction", reactionId],
    queryFn: () => getReactionById(reactionId),
  });
};

export const useUpdateReaction = () => {
  return useMutation({
    mutationFn: ({ reactionId, type }: { reactionId: string; type: string }) =>
      updateReaction(reactionId, type),
    onSuccess: (data) => {
      console.log("Reaction updated:", data);
    },
    onError: (error) => {
      console.error("Error updating reaction:", error);
    },
  });
};

export const useDeleteReaction = () => {
  return useMutation({
    mutationFn: (reactionId: string) => deleteReaction(reactionId),
    onSuccess: (data) => {
      console.log("Reaction deleted:", data);
    },
    onError: (error) => {
      console.error("Error deleting reaction:", error);
    },
  });
};

export const useGetAuthorScoresByCategory = (category: string) => {
  return useQuery({
    queryKey: ["authorScores", category],
    queryFn: () => getAuthorScoresByCategory(category),
  });
};

// Following Hooks
export const useFollowUser = () => {
  return useMutation({
    mutationFn: (followedId: string) => followUser(followedId),
    onSuccess: (data) => {
      console.log("User followed:", data);
    },
    onError: (error) => {
      console.error("Error following user:", error);
    },
  });
};

export const useUnfollowUser = () => {
  return useMutation({
    mutationFn: (followedId: string) => unfollowUser(followedId),
    onSuccess: (data) => {
      console.log("User unfollowed:", data);
    },
    onError: (error) => {
      console.error("Error unfollowing user:", error);
    },
  });
};

export const useGetFollowers = (userId: string) => {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId),
  });
};

export const useGetFollowing = (userId: string) => {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId)
  });
};

// Reports Hooks
export const useCreateReport = () => {
  return useMutation({
    mutationFn: (report: Report) => createReport(report),
    onSuccess: (data) => {
      console.log("Report created:", data);
    },
    onError: (error) => {
      console.error("Error creating report:", error);
    },
  });
};

export const useGetAllReports = () => {
  return useQuery({
    queryKey: ["allReports"],
    queryFn: () => getAllReports(),
  });
};

export const useGetReportsWithFilters = (
  status: string,
  startDate: string,
  endDate: string
) => {
  return useQuery({
    queryKey: ["reportsWithFilters", status, startDate, endDate],
    queryFn: () => getReportsWithFilters(status, startDate, endDate),
  });
};

export const useGetReportById = (reportId: string) => {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportById(reportId),
  });
};

export const useUpdateReportStatus = () => {
  return useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: string }) =>
      updateReportStatus(reportId, status),
    onSuccess: (data) => {
      console.log("Report status updated:", data);
    },
    onError: (error) => {
      console.error("Error updating report status:", error);
    },
  });
};

export const useDeleteReport = () => {
  return useMutation({
    mutationFn: (reportId: string) => deleteReport(reportId),
    onSuccess: (data) => {
      console.log("Report deleted:", data);
    },
    onError: (error) => {
      console.error("Error deleting report:", error);
    },
  });
};

// Comments Hooks
export const useCreateComment = () => {
  return useMutation({
    mutationFn: (comment: Comment) => createComment(comment),
    onSuccess: (data) => {
      console.log("Comment created:", data);
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
    },
  });
};

export const useGetCommentsByArticleId = (articleId: string) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => getCommentsByArticleId(articleId),
  });
};

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => updateComment(commentId, content),
    onSuccess: (data) => {
      console.log("Comment updated:", data);
    },
    onError: (error) => {
      console.error("Error updating comment:", error);
    },
  });
};

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: (data) => {
      console.log("Comment deleted:", data);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });
};

export const useGetRepliesForComment = (commentId: string) => {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: () => getRepliesForComment(commentId),
  });
};
