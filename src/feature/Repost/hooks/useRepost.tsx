import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repostArticle } from "../api";



export const useRepostArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, comment }: { articleId: string; comment?: string }) =>
      repostArticle(articleId, { comment }),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["recommended-articles"] });
    },
    onError: (error) => {
      void error;
    },
  });
};
