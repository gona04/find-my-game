import { useCallback } from 'react';
import { useGameDiscoveryStore } from '../store/useGameDiscoveryStore';

export const useGameSearch = () => {
  const store = useGameDiscoveryStore();
  const submitSearch = useCallback((query?: string) => store.searchGames(query), [store]);
  const clear = useCallback(() => store.clearResults(), [store]);
  return { ...store, submitSearch, clear };
};
