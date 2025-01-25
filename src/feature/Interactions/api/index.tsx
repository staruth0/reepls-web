import { apiClient } from "../../../services/apiClient";
import { Reaction } from "../../../models/datamodels";
import { Comment } from "../../../models/datamodels";

// Create a new reaction
const createReaction = async (reaction: Reaction) => {
  console.log("Creating reaction:", reaction);
  const { data } = await apiClient.post("/react", reaction);
  return data;
};

// Fetch a reaction by ID
const getReactionById = async (reactionId: string) => {
  console.log("Fetching reaction with ID:", reactionId);
  const { data } = await apiClient.get(`/react/${reactionId}`);
  return data;
};

// Update a reaction
const updateReaction = async (reactionId: string, type: string) => {
  console.log("Updating reaction with ID:", reactionId, "Type:", type);
  const { data } = await apiClient.put(`/react/${reactionId}`, { type });
  return data;
};

// Delete a reaction
const deleteReaction = async (reactionId: string) => {
  console.log("Deleting reaction with ID:", reactionId);
  const { data } = await apiClient.delete(`/react/${reactionId}`);
  return data;
};

// Fetch author scores by category
const getAuthorScoresByCategory = async (category: string) => {
  console.log("Fetching author scores for category:", category);
  const { data } = await apiClient.get(`/author/${category}/scores`);
  return data;
};



//Following

// Follow a user
const followUser = async (followedId: string) => {
  console.log('Following user with ID:', followedId);
  const { data } = await apiClient.post('/follow', { followedId });
  return data;
};

// Unfollow a user
const unfollowUser = async (followedId: string) => {
  console.log('Unfollowing user with ID:', followedId);
  const { data } = await apiClient.delete('/follow', { data: { followedId } });
  return data;
};

// Get followers of a user
const getFollowers = async (userId: string) => {
  console.log('Fetching followers for user with ID:', userId);
  const { data } = await apiClient.get(`/follow/${userId}/followers`);
  return data;
};

// Get users followed by a user
const getFollowing = async (userId: string) => {
    console.log('Fetching users followed by user with ID:', userId);
    const { data } = await apiClient.get(`/follow/${userId}/following`);
    return data;
}


//Comments

// Create a comment
const createComment = async (comment: Comment) => {
  console.log("Creating comment:", comment);
  const { data } = await apiClient.post("/comment", comment);
  return data;
};

// Get comments for an article
const getCommentsByArticleId = async (articleId: string) => {
  console.log("Fetching comments for article with ID:", articleId);
  const { data } = await apiClient.get(`/comment/article/${articleId}`);
  return data;
};

// Update a comment
const updateComment = async (commentId: string, content: string) => {
  console.log("Updating comment with ID:", commentId, "Content:", content);
  const { data } = await apiClient.put(`/comment/${commentId}`, { content });
  return data;
};

// Delete a comment
const deleteComment = async (commentId: string) => {
  console.log("Deleting comment with ID:", commentId);
  const { data } = await apiClient.delete(`/comment/${commentId}`);
  return data;
};

// Get replies for a comment
const getRepliesForComment = async (commentId: string) => {
  console.log("Fetching replies for comment with ID:", commentId);
  const { data } = await apiClient.get(`/comment/replies/${commentId}`);
  return data;
};



// Reports

import { Report } from "../../../models/datamodels";

// Create a new report
const createReport = async (report: Report) => {
  console.log("Creating report:", report);
  const { data } = await apiClient.post("/report", report);
  return data;
};

// Get all reports
const getAllReports = async () => {
  console.log("Fetching all reports");
  const { data } = await apiClient.get("/report");
  return data;
};

// Get all reports with filters
const getReportsWithFilters = async (
  status: string,
  startDate: string,
  endDate: string
) => {
  console.log("Fetching reports with filters");
  const { data } = await apiClient.get(
    `/report?status=${status}&startDate=${startDate}&endDate=${endDate}`
  );
  return data;
};

// Get a report by ID
const getReportById = async (reportId: string) => {
  console.log("Fetching report with ID:", reportId);
  const { data } = await apiClient.get(`/report/${reportId}`);
  return data;
};

// Update report status
const updateReportStatus = async (reportId: string, status: string) => {
  console.log(
    "Updating report status for report with ID:",
    reportId,
    "Status:",
    status
  );
  const { data } = await apiClient.patch(`/report/${reportId}/status`, {
    status,
  });
  return data;
};

// Delete a report
const deleteReport = async (reportId: string) => {
  console.log("Deleting report with ID:", reportId);
  const { data } = await apiClient.delete(`/report/${reportId}`);
  return data;
};

export {
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
  createReaction,
  getReactionById,
  updateReaction,
  deleteReaction,
  getAuthorScoresByCategory,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
