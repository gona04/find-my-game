import { games } from '../data/games';
import { Game } from '../types/Game';
import { GamePreferences } from '../utils/gameMatcher';

export type Recommendation = Game & { score: number; matchReason: string[] };

const intersects = (a: string[] = [], b: string[] = []) => a.some((x) => b.map((v) => v.toLowerCase()).includes(x.toLowerCase()));
const matchingValues = (a: string[] = [], b: string[] = []) => a.filter((x) => b.map((v) => v.toLowerCase()).includes(x.toLowerCase()));

export const getRecommendations = (preferences: GamePreferences): Recommendation[] => games
  .map((game) => {
    let score = 0;
    const matchReason: string[] = [];
    if (preferences.genres?.length && intersects(game.genres, preferences.genres)) { score += 5; matchReason.push(...matchingValues(game.genres, preferences.genres).map((g) => `${g} genre`)); }
    if (preferences.mood?.length && intersects(game.mood, preferences.mood)) { score += 4; matchReason.push(...matchingValues(game.mood, preferences.mood).map((m) => `${m} mood`)); }
    if (preferences.storyline !== undefined && game.storyline === preferences.storyline) { score += 4; matchReason.push('Storyline'); }
    if (preferences.rewardPotential && game.rewardPotential === preferences.rewardPotential) { score += 3; matchReason.push(`${game.rewardPotential} rewards`); }
    if (preferences.rewardFrequency && game.rewardFrequency === preferences.rewardFrequency) { score += 2; matchReason.push(`${game.rewardFrequency} reward frequency`); }
    if (preferences.progression && game.progression === preferences.progression) { score += 3; matchReason.push(`${game.progression} progression`); }
    if (preferences.complexity && game.complexity === preferences.complexity) { score += 2; matchReason.push(`${game.complexity} complexity`); }
    if (preferences.sessionLength && game.sessionLength === preferences.sessionLength) { score += 2; matchReason.push(`${game.sessionLength} sessions`); }
    return { ...game, score, matchReason: matchReason.length ? matchReason : ['Balanced recommendation'] };
  })
  .filter((game) => game.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
