import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { games } from '../data/games';

import { extractKeywordPreferences, hasMeaningfulPreferences, RoutingPath } from '../utils/gameMatcher';
import { ExtractedPreferences } from '../types/Game';
import { fetchSerperContext, SerperGameContext } from '../services/serper.survice';
import { extractPreferencesAndReasons, getRecommendations } from '../services';

const NO_MATCH_ERROR = 'No matches found. Try describing a mood, genre, or session length.';
const FALLBACK_PREFS: ExtractedPreferences = { mood: ['Relaxing'], rewardPotential: 'high' };

const hasEmotionalLanguage = (query: string): boolean => {
  const emotionalKeywords = ['feel', 'want', 'looking for', 'something that', 'makes me', 'like to', 'kind of', 'transported', 'escape'];
  return emotionalKeywords.some((keyword) => query.toLowerCase().includes(keyword));
};

const mergeSerperContext = (
  base: ExtractedPreferences,
  ctx: SerperGameContext,
): ExtractedPreferences => ({
  genres:          base.genres?.length ? base.genres : ctx.inferredGenres,
  mood:            base.mood?.length   ? base.mood   : ctx.inferredMood,
  complexity:      base.complexity     ?? ctx.inferredComplexity,
  sessionLength:   base.sessionLength  ?? ctx.inferredSessionLength,
  storyline:       base.storyline      ?? ctx.inferredStoryline,
  rewardPotential: base.rewardPotential,
  rewardFrequency: base.rewardFrequency,
  progression:     base.progression,
});

type GameDiscoveryStore = {
  // ── State ──────────────────────────────────────────────────────────────────
  query:           string;
  recommendations: ReturnType<typeof getRecommendations>;
  loading:         boolean;
  streamingStatus: string;
  error:           string | null;
  routingPath:     RoutingPath;
  // ── Actions ────────────────────────────────────────────────────────────────
  setQuery:        (query: string) => void;
  clearResults:    () => void;
  searchGames:     (queryOverride?: string) => Promise<void>;
};

export const useGameDiscoveryStore = create<GameDiscoveryStore>()(
  devtools(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      query:           '',
      recommendations: [],
      loading:         false,
      streamingStatus: '',
      error:           null,
      routingPath:     null,

      // ── Actions ────────────────────────────────────────────────────────────
      setQuery:     (query) => set({ query }),
      clearResults: () => set({ recommendations: [], error: null, routingPath: null, streamingStatus: '' }),

      searchGames: async (queryOverride) => {
        const currentQuery = (queryOverride ?? get().query).trim();

        if (!currentQuery) {
          set({ error: 'Tell us what you want to play first.', recommendations: [] });
          return;
        }

        set({ loading: true, error: null, streamingStatus: 'Thinking...', recommendations: [] });

        try {
          // ── Tier 1: Keyword ──────────────────────────────────────────────
          const keywordPrefs = extractKeywordPreferences(currentQuery);
          if (hasMeaningfulPreferences(keywordPrefs, currentQuery)) {
            const recommendations = getRecommendations(keywordPrefs, {});
            set({ recommendations, routingPath: 'keyword', loading: false, streamingStatus: '', error: recommendations.length ? null : NO_MATCH_ERROR });
            return;
          }

          // ── Tier 2: SERP ─────────────────────────────────────────────────
          // Skip SERP for emotional queries; they need LLM for nuanced understanding
          const isEmotionalQuery = hasEmotionalLanguage(currentQuery);
          if (!isEmotionalQuery) {
            set({ streamingStatus: 'Looking that up...' });
            const serperContext = await fetchSerperContext(currentQuery);

            if (serperContext) {
              const enriched = mergeSerperContext(keywordPrefs, serperContext);
              if (hasMeaningfulPreferences(enriched, currentQuery)) {
                const recommendations = getRecommendations(enriched, {});
                set({ recommendations, routingPath: 'keyword', loading: false, streamingStatus: '', error: recommendations.length ? null : NO_MATCH_ERROR });
                return;
              }
            }
          }

          // ── Tier 3: LLM ──────────────────────────────────────────────────
          set({ streamingStatus: 'Understanding your vibe...' });
          const { preferences, reasons } = await extractPreferencesAndReasons(
            currentQuery,
            games,
          );

          set({ streamingStatus: 'Finding your matches...' });
          const recommendations = getRecommendations(preferences, reasons);
          set({ recommendations, routingPath: 'llm', loading: false, streamingStatus: '', error: recommendations.length ? null : NO_MATCH_ERROR });

        } catch (error) {
          set({
            recommendations: getRecommendations(FALLBACK_PREFS, {}),
            routingPath:     'llm',
            loading:         false,
            streamingStatus: '',
            error: error instanceof Error
              ? `${error.message} Showing fallback picks.`
              : 'AI search failed. Showing fallback picks.',
          });
        }
      },
    }),
    { name: 'GameDiscoveryStore' }
  )
);

export const getGameDiscoveryStoreSnapshot = () => useGameDiscoveryStore.getState();

// Backwards-compatible action proxy for tests and older imports
export const gameDiscoveryActions = {
  setQuery: (q: string) => useGameDiscoveryStore.getState().setQuery(q),
  clearResults: () => useGameDiscoveryStore.getState().clearResults(),
  searchGames: (q?: string) => useGameDiscoveryStore.getState().searchGames(q),
};