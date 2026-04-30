import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { floatingMenuApi, FloatingMenuConfig } from "@/lib/api";

export const FLOATING_MENU_QUERY_KEY = ["floating_menu"];

export const useFloatingMenu = () => {
  return useQuery({
    queryKey: FLOATING_MENU_QUERY_KEY,
    queryFn: floatingMenuApi.get,
  });
};

export const useSaveFloatingMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (config: FloatingMenuConfig) => floatingMenuApi.save(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FLOATING_MENU_QUERY_KEY });
    },
  });
};
