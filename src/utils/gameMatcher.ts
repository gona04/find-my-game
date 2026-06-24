import { games } from '../data/games';
import { Game } from '../types/Game';

export type RoutingPath = 'keyword' | 'llm' | null;
export type GamePreferences = Partial<Pick<Game, 'sessionLength' | 'rewardPotential' | 'rewardFrequency' | 'progression' | 'complexity' | 'storyline'>> & {
  genres?: string[];
  mood?: string[];
  semanticTerms?: string[];
};

const includesAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));
const add = (items: string[] | undefined, value: string) => Array.from(new Set([...(items ?? []), value]));
const tokenize = (text: string) => text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

export const extractKeywordPreferences = (query: string): GamePreferences => {
  const text = query.toLowerCase().trim();
  const prefs: GamePreferences = { semanticTerms: tokenize(text).filter((term) => term.length > 2) };

  if (includesAny(text, ['story', 'storyline', 'narrative', 'immersive'])) prefs.storyline = true;
  if (includesAny(text, ['adventure', 'prince of persia', 'quest', 'explore'])) prefs.genres = add(prefs.genres, 'Adventure');
  if (includesAny(text, ['action', 'combat', 'sword', 'parkour'])) prefs.genres = add(prefs.genres, 'Action');
  if (includesAny(text, ['logic', 'puzzle', 'brain', 'riddle'])) prefs.genres = add(prefs.genres, 'Logic');
  if (includesAny(text, ['competitive', 'multiplayer', 'arena', 'leaderboard'])) prefs.mood = add(prefs.mood, 'Competitive');
  if (includesAny(text, ['reward', 'rewards', 'highest', 'earn', 'gems', 'payout'])) {
    prefs.rewardPotential = 'high';
    prefs.mood = add(prefs.mood, 'Rewarding');
  }
  if (includesAny(text, ['relaxing', 'calm', 'cozy', 'bed', 'low pressure'])) prefs.mood = add(prefs.mood, 'Relaxing');
  if (includesAny(text, ['strategy', 'strategic', 'tactical'])) prefs.genres = add(prefs.genres, 'Strategy');
  if (includesAny(text, ['short', 'quick', '10 minutes', 'ten minutes'])) prefs.sessionLength = 'short';
  if (includesAny(text, ['long', 'deep', 'hours'])) prefs.sessionLength = 'long';
  if (includesAny(text, ['horror', 'scary'])) prefs.mood = add(prefs.mood, 'Scary');
  if (includesAny(text, ['racing', 'race', 'cars'])) prefs.genres = add(prefs.genres, 'Racing');
  if (includesAny(text, ['music', 'rhythm', 'song', 'beats'])) prefs.genres = add(prefs.genres, 'Rhythm');
  if (includesAny(text, ['card', 'deck'])) prefs.genres = add(prefs.genres, 'Card');
  if (includesAny(text, ['idle', 'build', 'slowly build', 'upgrade'])) prefs.genres = add(prefs.genres, 'Idle');
  if (includesAny(text, ['rpg', 'role playing', 'hero', 'loot'])) prefs.genres = add(prefs.genres, 'RPG');

  return prefs;
};

export const getCatalogMatchStrength = (query: string) => {
  const terms = tokenize(query).filter((term) => term.length > 2);
  if (!terms.length) return 0;

  return Math.max(...games.map((game) => {
    const haystack = [
      game.title,
      game.description,
      game.genres.join(' '),
      game.mood.join(' '),
      game.rewardPotential,
      game.rewardFrequency,
      game.sessionLength,
      game.progression,
      game.complexity,
      game.storyline ? 'story storyline narrative' : '',
    ].join(' ').toLowerCase();

    return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0);
  }));
};

export const hasMeaningfulPreferences = (prefs: GamePreferences, query = '') => {
  const structuredSignals = Object.entries(prefs).some(([key, value]) => {
    if (key === 'semanticTerms') return false;
    return Array.isArray(value) ? value.length > 0 : value !== undefined;
  });

  return structuredSignals || getCatalogMatchStrength(query) >= 2;
};
