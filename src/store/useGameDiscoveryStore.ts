import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { games } from '../data/games';

import { extractKeywordPreferences, getPreferenceScore, CONFIDENCE_THRESHOLD, RoutingPath } from '../utils/gameMatcher';
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
  hasZeroMatch:    boolean;
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
      hasZeroMatch:    false,

      // ── Actions ────────────────────────────────────────────────────────────
      setQuery:     (query) => set({ query }),
      clearResults: () => set({ recommendations: [], error: null, routingPath: null, streamingStatus: '', hasZeroMatch: false }),

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
          const keywordScore = getPreferenceScore(keywordPrefs);
          console.log(`
🔍 TIER 1 — Keyword Matching
Query: "${currentQuery}"
Extracted Preferences:`, keywordPrefs);
          console.log(`📊 Keyword Score: ${keywordScore} (threshold: ${CONFIDENCE_THRESHOLD})`);
          
          if (keywordScore >= CONFIDENCE_THRESHOLD) {
            console.log(`✅ TIER 1 PASSED (${keywordScore} >= ${CONFIDENCE_THRESHOLD}) — Using keyword preferences`);
            const recommendations = getRecommendations(keywordPrefs, {});
            const allZeroScore = recommendations.every((r) => r.score === 0);
            set({ recommendations, routingPath: 'keyword', loading: false, streamingStatus: '', hasZeroMatch: allZeroScore, error: recommendations.length ? null : NO_MATCH_ERROR });
            return;
          }
          console.log(`❌ TIER 1 FAILED (${keywordScore} < ${CONFIDENCE_THRESHOLD}) — Moving to SERP...`);

          // ── Tier 2: SERP ─────────────────────────────────────────────────
          // Skip SERP for emotional queries; they need LLM for nuanced understanding
          const isEmotionalQuery = hasEmotionalLanguage(currentQuery);
          console.log(`\n🔍 TIER 2 — SERP Enrichment`);
          console.log(`😊 Emotional query detected: ${isEmotionalQuery}`);
          
          let serperContext: SerperGameContext | null = null;
          if (!isEmotionalQuery) {
            set({ streamingStatus: 'Looking that up...' });
            serperContext = await fetchSerperContext(currentQuery);
            console.log(`📡 SERP Context:`, serperContext);
          } else {
            console.log(`⏭️  Skipping SERP (emotional query) — will go straight to LLM`);
          }

          const enrichedPrefs = serperContext ? mergeSerperContext(keywordPrefs, serperContext) : keywordPrefs;
          const enrichedScore = getPreferenceScore(enrichedPrefs);
          console.log(`📊 Enriched Score: ${enrichedScore} (threshold: ${CONFIDENCE_THRESHOLD})`);
          console.log(`Enriched Preferences:`, enrichedPrefs);
          
          if (enrichedScore >= CONFIDENCE_THRESHOLD) {
            console.log(`✅ TIER 2 PASSED (${enrichedScore} >= ${CONFIDENCE_THRESHOLD}) — Using SERP-enriched preferences`);
            const recommendations = getRecommendations(enrichedPrefs, {});
            const allZeroScore = recommendations.every((r) => r.score === 0);
            set({ recommendations, routingPath: 'keyword', loading: false, streamingStatus: '', hasZeroMatch: allZeroScore, error: recommendations.length ? null : NO_MATCH_ERROR });
            return;
          }
          console.log(`❌ TIER 2 FAILED (${enrichedScore} < ${CONFIDENCE_THRESHOLD}) — Moving to LLM...`);

          // ── Tier 3: LLM ──────────────────────────────────────────────────
          console.log(`\n🔍 TIER 3 — LLM Analysis`);
          console.log(`🧠 Calling LLM with query: "${currentQuery}"`);
          if (serperContext) {
            console.log(`📡 Injecting SERP context into LLM prompt:`, serperContext);
          }
          
          set({ streamingStatus: 'Understanding your vibe...' });
          const { preferences, reasons } = await extractPreferencesAndReasons(
            currentQuery,
            games,
          );
          console.log(`✅ TIER 3 EXECUTED — LLM Preferences:`, preferences);
          console.log(`💭 LLM Match Reasons:`, reasons);

          set({ streamingStatus: 'Finding your matches...' });
          const recommendations = getRecommendations(preferences, reasons);
          const allZeroScore = recommendations.every((r) => r.score === 0);
          console.log(`🎮 Final Recommendations:`, recommendations);
          console.log(`\n✨ === ROUTING COMPLETE === ✨\n`);
          set({ recommendations, routingPath: 'llm', loading: false, streamingStatus: '', hasZeroMatch: allZeroScore, error: recommendations.length ? null : NO_MATCH_ERROR });

        } catch (error) {
          console.error(`❌ ROUTING ERROR:`, error);
          const recommendations = getRecommendations(FALLBACK_PREFS, {});
          const allZeroScore = recommendations.every((r) => r.score === 0);
          set({
            recommendations,
            routingPath:     'llm',
            loading:         false,
            streamingStatus: '',
            hasZeroMatch:    allZeroScore,
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