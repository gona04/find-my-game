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

export const hasMeaningfulPreferences = (prefs: GamePreferences, query = ''): boolean => {
  const signals = prefs.matchedFields ?? countSignals(prefs);
  
  // If query has emotional language but weak explicit signals, let LLM handle it
  const emotionalKeywords = ['feel', 'want', 'looking for', 'something that', 'makes me', 'like to', 'kind of'];
  const hasEmotionalLanguage = emotionalKeywords.some((keyword) => query.toLowerCase().includes(keyword));
  if (hasEmotionalLanguage && signals < 2) {
    // Weak explicit match + emotional language → skip Tier 1, let LLM analyze
    return false;
  }

  return signals > 0 || getCatalogMatchStrength(query) >= 2;
};
