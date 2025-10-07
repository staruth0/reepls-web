// Reading Progress Types

export interface ReadingProgress {
  _id: string;
  user_id: string;
  article_id: string;
  read_time: number;
  scroll_length: number;
  created_at: string;
  updated_at: string;
}

export interface ReadingProgressWithArticle extends Omit<ReadingProgress, 'article_id'> {
  article_id: {
    _id: string;
    title: string;
  };
}

export interface CreateReadingProgressRequest {
  article_id: string;
  read_time: number;
  scroll_length: number;
}

export interface UpdateReadingProgressRequest {
  read_time: number;
  scroll_length: number;
}

export interface ReadingProgressResponse {
  message: string;
  data: ReadingProgress;
}

export interface ReadingProgressWithArticleResponse {
  message: string;
  data: ReadingProgressWithArticle;
}

export interface ReadingProgressListResponse {
  message: string;
  data: ReadingProgressWithArticle[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
