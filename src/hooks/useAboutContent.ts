import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { aboutContentApi, AboutContent } from "@/lib/api";

export const ABOUT_CONTENT_QUERY_KEY = ["about_content"];

export const useAboutContent = () => {
  return useQuery({
    queryKey: ABOUT_CONTENT_QUERY_KEY,
    queryFn: async () => {
      return await aboutContentApi.get();
    },
    retry: false,
  });
};

export const useSaveAboutContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: AboutContent) => aboutContentApi.save(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ABOUT_CONTENT_QUERY_KEY });
    },
  });
};
