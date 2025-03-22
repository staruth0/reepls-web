import { MediaItem } from '../../../models/datamodels';

type DraftArticle = {
  title: string;
  subtitle: string;
  content: string;
  htmlContent: string;
  media: MediaItem[];
};

type DraftPost = {
  content: string;
  media: MediaItem[];
};

const useDraft = () => {
  return {
    saveDraftArticle: ({ title, subtitle, content, htmlContent, media }: DraftArticle) => {
      const article: DraftArticle = {
        title,
        subtitle,
        content,
        htmlContent,
        media,
      };
      localStorage.setItem('LocalDraftArticle', JSON.stringify(article));
    },
    saveDraftPost: ({ content, media }: DraftPost) => {
      const post: DraftPost = {
        content,
        media,
      };
      localStorage.setItem('LocalDraftPost', JSON.stringify(post));
    },
    loadDraftArticle: () => {
      const article = localStorage.getItem('LocalDraftArticle');
      if (article) {
        return JSON.parse(article);
      }
      return null;
    },
    loadDraftPost: () => {
      const post = localStorage.getItem('LocalDraftPost');
      if (post) {
        return JSON.parse(post);
      }
      return null;
    },
    clearDraftArticle: () => {
      localStorage.removeItem('LocalDraftArticle');
    },
    clearDraftPost: () => {
      localStorage.removeItem('LocalDraftPost');
    },
  };
};

export default useDraft;
