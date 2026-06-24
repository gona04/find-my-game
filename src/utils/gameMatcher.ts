import { Game } from '../types/Game';

export type RoutingPath = 'keyword' | 'llm' | null;
export type GamePreferences = Partial<Pick<Game, 'sessionLength' | 'rewardPotential' | 'rewardFrequency' | 'progression' | 'complexity' | 'storyline'>> & {
  genres?: string[];
  mood?: string[];
};

const includesAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));
const add = (items: string[] | undefined, value: string) => Array.from(new Set([...(items ?? []), value]));

export const extractKeywordPreferences = (query: string): GamePreferences => {
  const text = query.toLowerCase().trim();
  const prefs: GamePreferences = {};

  if (includesAny(text, ['story', 'storyline', 'narrative', 'immersive'])) prefs.storyline = true;
  if (includesAny(text, ['adventure', 'prince of persia'])) prefs.genres = add(prefs.genres, 'Adventure');
  if (includesAny(text, ['action', 'combat'])) prefs.genres = add(prefs.genres, 'Action');
  if (includesAny(text, ['logic', 'puzzle', 'brain'])) prefs.genres = add(prefs.genres, 'Logic');
  if (includesAny(text, ['competitive', 'multiplayer', 'arena'])) prefs.mood = add(prefs.mood, 'Competitive');
  if (includesAny(text, ['reward', 'rewards', 'highest', 'earn'])) { prefs.rewardPotential = 'high'; prefs.mood = add(prefs.mood, 'Rewarding'); }
  if (includesAny(text, ['relaxing', 'calm', 'cozy', 'bed'])) prefs.mood = add(prefs.mood, 'Relaxing');
  if (includesAny(text, ['strategy', 'strategic'])) prefs.genres = add(prefs.genres, 'Strategy');
  if (includesAny(text, ['short', 'quick', '10 minutes', 'ten minutes'])) prefs.sessionLength = 'short';
  if (includesAny(text, ['long', 'deep', 'hours'])) prefs.sessionLength = 'long';
  if (includesAny(text, ['horror'])) prefs.mood = add(prefs.mood, 'Scary');
  if (includesAny(text, ['racing', 'race'])) prefs.genres = add(prefs.genres, 'Racing');
  if (includesAny(text, ['music', 'rhythm'])) prefs.genres = add(prefs.genres, 'Rhythm');
  if (includesAny(text, ['card', 'deck'])) prefs.genres = add(prefs.genres, 'Card');
  if (includesAny(text, ['idle', 'build', 'slowly build'])) prefs.genres = add(prefs.genres, 'Idle');
  if (includesAny(text, ['rpg', 'role playing'])) prefs.genres = add(prefs.genres, 'RPG');

  return prefs;
};

export const hasMeaningfulPreferences = (prefs: GamePreferences) => Object.keys(prefs).some((key) => {
  const value = prefs[key as keyof GamePreferences];
  return Array.isArray(value) ? value.length > 0 : value !== undefined;
});
