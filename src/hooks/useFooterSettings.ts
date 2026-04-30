import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { footerSettingsApi, FooterSettings } from "@/lib/api";

export const FOOTER_SETTINGS_QUERY_KEY = ["footer_settings"];

export const useFooterSettings = () => {
  return useQuery({
    queryKey: FOOTER_SETTINGS_QUERY_KEY,
    queryFn: footerSettingsApi.get,
  });
};

export const useSaveFooterSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: FooterSettings) => footerSettingsApi.save(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOOTER_SETTINGS_QUERY_KEY });
    },
  });
};
