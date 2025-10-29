import { Article } from "../../../models/datamodels";

export interface CommentCountData {
  articleComments?: {
    pages?: Array<{
      data?: {
        totalComments?: number;
      };
    }>;
  };
  repostComments?: {
    parentCommentsCount?: number;
  };
}

export const getCommentCount = (
  article: Article,
  articleComments: CommentCountData['articleComments'],
  repostComments: CommentCountData['repostComments']
): number => {
  if (article.type === "Repost") {
    return repostComments?.parentCommentsCount ?? 0;
  }
  return articleComments?.pages?.[0]?.data?.totalComments ?? 0;
};

export const validateComment = (content: string): { valid: boolean; message?: string } => {
  if (!content.trim()) {
    return { valid: false, message: "Comment cannot be empty." };
  }
  if (content.trim().length > 500) {
    return { valid: false, message: "Comment must be less than 500 characters." };
  }
  return { valid: true };
};

export const isArticleType = (article: Article): boolean => {
  return article.type !== "Repost" && article.type !== "ShortForm";
};

export const isRepostType = (article: Article): article is Article & { type: "Repost"; repost: { repost_id: string } } => {
  return article.type === "Repost" && !!article.repost?.repost_id;
};

