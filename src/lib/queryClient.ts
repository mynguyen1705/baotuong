import { useContext, useMemo } from 'react';
import { QueryClient, QueryClientContext } from '@tanstack/react-query';

export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: false,
    },
  },
});

export function useSafeQueryClient(): QueryClient {
  const contextClient = useContext(QueryClientContext);
  const fallbackClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 0,
            retry: false,
          },
        },
      }),
    []
  );
  return contextClient ?? fallbackClient;
}
