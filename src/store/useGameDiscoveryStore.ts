import { useSyncExternalStore } from 'react';
import { extractPreferences } from '../services/llmService';
import { getRecommendations, Recommendation } from '../services/recommendationService';
import { extractKeywordPreferences, hasMeaningfulPreferences, RoutingPath } from '../utils/gameMatcher';

type State = {
  query: string;
  recommendations: Recommendation[];
  loading: boolean;
  streamingStatus: string;
  error: string | null;
  routingPath: RoutingPath;
};

type Store = State & {
  setQuery: (query: string) => void;
  searchGames: (queryOverride?: string) => Promise<void>;
  clearResults: () => void;
};

let state: State = { query: '', recommendations: [], loading: false, streamingStatus: '', error: null, routingPath: null };
const listeners = new Set<() => void>();
const setState = (patch: Partial<State>) => { state = { ...state, ...patch }; listeners.forEach((listener) => listener()); };
const subscribe = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };
const getSnapshot = (): State => state;
export const getGameDiscoveryStoreSnapshot = (): State => state;

export const gameDiscoveryActions = {
  setQuery: (query: string) => setState({ query }),
  clearResults: () => setState({ recommendations: [], error: null, routingPath: null, streamingStatus: '' }),
  searchGames: async (queryOverride?: string) => {
    const currentQuery = (queryOverride ?? state.query).trim();
    if (!currentQuery) { setState({ error: 'Tell us what you want to play first.', recommendations: [] }); return; }
    setState({ loading: true, error: null, streamingStatus: 'Thinking...', recommendations: [] });
    try {
      const keywordPreferences = extractKeywordPreferences(currentQuery);
      const routingPath: RoutingPath = hasMeaningfulPreferences(keywordPreferences, currentQuery) ? 'keyword' : 'llm';
      const preferences = routingPath === 'keyword'
        ? keywordPreferences
        : await extractPreferences(currentQuery, (streamingStatus) => setState({ streamingStatus }));
      const recommendations = getRecommendations(preferences);
      setState({ recommendations, routingPath, loading: false, streamingStatus: '', error: recommendations.length ? null : 'No matches found. Try describing a mood, genre, or session length.' });
    } catch (error) {
      const fallback = getRecommendations({ mood: ['Relaxing'], rewardPotential: 'high' });
      setState({ recommendations: fallback, routingPath: 'llm', loading: false, streamingStatus: '', error: error instanceof Error ? `${error.message} Showing fallback picks.` : 'AI search failed. Showing fallback picks.' });
    }
  },
};

export const useGameDiscoveryStore = (): Store => ({ ...useSyncExternalStore(subscribe, getSnapshot, getSnapshot), ...gameDiscoveryActions });
