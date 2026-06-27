import { games } from '../data/games';
import { Game } from '../types/Game';

export type RoutingPath = 'keyword' | 'llm' | null;
export type GamePreferences = Partial<Pick<Game, 'sessionLength' | 'rewardPotential' | 'rewardFrequency' | 'progression' | 'complexity' | 'storyline'>> & {
  genres?: string[];
  mood?: string[];
  semanticTerms?: string[];
  referencedGame?: string;
  matchedFields?: number;
};

const includesAny = (text: string, terms: string[]): boolean => terms.some((term) => text.includes(term));
const add = <T,>(items: T[] | undefined, value: T): T[] => Array.from(new Set([...(items ?? []), value]));
const tokenize = (text: string): string[] => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
const countSignals = (prefs: GamePreferences): number => Object.entries(prefs).reduce((total, [key, value]) => {
  if (key === 'semanticTerms' || key === 'referencedGame' || key === 'matchedFields') return total;
  if (Array.isArray(value)) return total + value.length;
  return value === undefined ? total : total + 1;
}, 0);

export const extractKeywordPreferences = (query: string): GamePreferences => {
  const text = query.toLowerCase().trim();
  const prefs: GamePreferences = { semanticTerms: tokenize(text).filter((term) => term.length > 2) };
  if (!text) return { matchedFields: 0 };

  if (includesAny(text, ['story', 'storyline', 'narrative'])) prefs.storyline = true;
  if (includesAny(text, ['adventure', 'quest', 'explore'])) prefs.genres = add(prefs.genres, 'Adventure');
  if (includesAny(text, ['action', 'combat', 'sword', 'parkour'])) prefs.genres = add(prefs.genres, 'Action');
  if (includesAny(text, ['logic', 'puzzle', 'brain', 'riddle'])) prefs.genres = add(prefs.genres, 'Puzzle');
  if (includesAny(text, ['competitive', 'multiplayer', 'arena', 'leaderboard', 'fight'])) prefs.mood = add(prefs.mood, 'competitive');
  if (includesAny(text, ['reward', 'rewards', 'highest', 'earn', 'gems', 'payout'])) prefs.rewardPotential = 'high';
  if (includesAny(text, ['relaxing', 'relaxed', 'calm', 'chill', 'cozy', 'bed', 'low pressure'])) prefs.mood = add(prefs.mood, 'calm');
  if (includesAny(text, ['strategy', 'strategic', 'tactical'])) prefs.genres = add(prefs.genres, 'Strategy');
  if (includesAny(text, ['short', 'quick', '10 minute', '10 minutes', 'ten minutes'])) prefs.sessionLength = 'short';
  if (includesAny(text, ['long', 'deep', 'hours'])) prefs.sessionLength = 'long';
  if (includesAny(text, ['horror', 'scary'])) prefs.genres = add(prefs.genres, 'Horror');
  if (includesAny(text, ['racing', 'race', 'cars'])) prefs.genres = add(prefs.genres, 'Racing');
  if (includesAny(text, ['music', 'rhythm', 'song', 'beats'])) prefs.genres = add(prefs.genres, 'Rhythm');
  if (includesAny(text, ['card', 'deck'])) prefs.genres = add(prefs.genres, 'Card');
  if (includesAny(text, ['idle', 'build', 'slowly build', 'upgrade'])) prefs.genres = add(prefs.genres, 'Idle');
  if (includesAny(text, ['rpg', 'role playing', 'hero', 'loot'])) prefs.genres = add(prefs.genres, 'RPG');

  const referencedGame = games.find((game) => text.includes(game.title.toLowerCase()));
  if (referencedGame) prefs.referencedGame = referencedGame.title;
  return { ...prefs, matchedFields: countSignals(prefs) };
};

export const extractKeywords = extractKeywordPreferences;

export const getCatalogMatchStrength = (query: string): number => {
  const terms = tokenize(query).filter((term) => term.length > 2);
  if (!terms.length) return 0;
  return Math.max(...games.map((game) => {
    const haystack = [game.title, game.description, game.genres.join(' '), game.mood.join(' '), game.rewardPotential, game.rewardFrequency, game.sessionLength, game.progression, game.complexity, game.storyline ? 'story storyline narrative' : ''].join(' ').toLowerCase();
    return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
  }));
};

/**
 * Field weights for determining preference confidence score.
 * Genres and mood are weighted 2 because they are semantically the most meaningful.
 * Other fields are weighted 1.
 */
export const FIELD_WEIGHTS = {
  genres: 2,
  mood: 2,
  sessionLength: 1,
  rewardPotential: 1,
  rewardFrequency: 1,
  progression: 1,
  complexity: 1,
  storyline: 1,
} as const;

/**
 * Confidence threshold for routing decisions.
 * Score >= CONFIDENCE_THRESHOLD indicates enough structured signal.
 * - Tier 1 (keyword): pass immediately
 * - Tier 2 (SERP): pass after enrichment
 * - Tier 3 (LLM): used as fallback when score remains < threshold
 */
export const CONFIDENCE_THRESHOLD = 4;

/**
 * Calculates a preference confidence score based on weighted fields.
 * Uses weighted scoring:
 * - genres (non-empty): 2 points
 * - mood (non-empty): 2 points
 * - other fields (when present): 1 point each
 * 
 * Score >= CONFIDENCE_THRESHOLD (4) means enough structured signal.
 * 
 * @param prefs - Extracted game preferences
 * @returns numeric confidence score (0+)
 */
export const getPreferenceScore = (prefs: GamePreferences): number => {
  let totalWeight = 0;

  // genres: +2 if non-empty array
  if (Array.isArray(prefs.genres) && prefs.genres.length > 0) {
    totalWeight += FIELD_WEIGHTS.genres;
  }

  // mood: +2 if non-empty array
  if (Array.isArray(prefs.mood) && prefs.mood.length > 0) {
    totalWeight += FIELD_WEIGHTS.mood;
  }

  // All other fields: +1 if present (not undefined)
  if (prefs.sessionLength !== undefined) totalWeight += FIELD_WEIGHTS.sessionLength;
  if (prefs.rewardPotential !== undefined) totalWeight += FIELD_WEIGHTS.rewardPotential;
  if (prefs.rewardFrequency !== undefined) totalWeight += FIELD_WEIGHTS.rewardFrequency;
  if (prefs.progression !== undefined) totalWeight += FIELD_WEIGHTS.progression;
  if (prefs.complexity !== undefined) totalWeight += FIELD_WEIGHTS.complexity;
  if (prefs.storyline !== undefined) totalWeight += FIELD_WEIGHTS.storyline;

  return totalWeight;
};
