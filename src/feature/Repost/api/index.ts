import { apiClient } from "../../../services/apiClient";


interface RepostArticlePayload {
  comment?: string; 
}

/**
 * Repost an article for the user.
 * @param articleId The ID of the article to repost.
 * @param payload An object containing the optional comment.
 * @returns The response data from the API.
 */

export const repostArticle = async (articleId: string, payload: RepostArticlePayload) => {
  const { data } = await apiClient.post(`/reposts/article/${articleId}`, payload);
  return data;
};