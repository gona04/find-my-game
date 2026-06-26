import { useCallback, useEffect, useMemo, useState } from 'react';
import { placeholders } from '../data/seach-placeholder';
import { recentSearches } from '../data/recent-search';
import { useGameSearch } from './useGameSearch';

const PLACEHOLDER_INTERVAL_MS = 3000;

export function useExploreMore() {
  const { query, setQuery, recommendations, loading, routingPath, error, submitSearch } = useGameSearch();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setPlaceholderIndex((current) => (current + 1) % placeholders.length),
      PLACEHOLDER_INTERVAL_MS,
    );

    return () => clearInterval(interval);
  }, []);

  const searchPlaceholder = useMemo(() => placeholders[placeholderIndex], [placeholderIndex]);

  const onSearch = useCallback(() => {
    void submitSearch();
  }, [submitSearch]);

  const onQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, [setQuery]);

  const onRecentSearch = useCallback(
    (value: string) => {
      setQuery(value);
      void submitSearch(value);
    },
    [setQuery, submitSearch],
  );

  return {
    query,
    searchPlaceholder,
    recommendations,
    loading,
    routingPath,
    error,
    recentSearches,
    onSearch,
    onRecentSearch,
    onQueryChange,
  };
}
