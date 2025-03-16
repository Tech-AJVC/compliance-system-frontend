import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
        // staleTime: 60 * 1000,
        // cacheTime: 10 * 60 * 1000,
      //   refetchOnWindowFocus: false,
      //   refetchOnReconnect: false,
      //   refetchOnMount: false,
    },
  },
});
export default queryClient;
