type DraftArticle = {
  title: string;
  subtitle: string;
  content: string;
};

type DraftPost = {
  content: string;
  imageUrls: string[];
  videoUrls: string[];
};

const useDraft = () => {
  return {
    saveDraftArticle: ({ title, subtitle, content }: DraftArticle) => {
      const article: DraftArticle = {
        title,
        subtitle,
        content,
      };
      localStorage.setItem('LocalDraftArticle', JSON.stringify(article));
    },
    saveDraftPost: ({ content, imageUrls, videoUrls }: DraftPost) => {
      const post: DraftPost = {
        content,
        imageUrls,
        videoUrls,
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
