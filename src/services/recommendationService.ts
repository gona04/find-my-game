import { games } from '../data/games';
import { Game } from '../types/Game';
import { GamePreferences } from '../utils/gameMatcher';

export type Recommendation = Game & { score: number; matchReason: string[] };

const normalize = (value: string) => value.toLowerCase();
const intersects = (a: string[] = [], b: string[] = []) => a.some((x) => b.map(normalize).includes(normalize(x)));
const matchingValues = (a: string[] = [], b: string[] = []) => a.filter((x) => b.map(normalize).includes(normalize(x)));
const countTermMatches = (terms: string[] = [], text: string) => terms.reduce((total, term) => total + (text.includes(normalize(term)) ? 1 : 0), 0);

export const getRecommendations = (preferences: GamePreferences): Recommendation[] => games
  .map((game) => {
    let score = 0;
    const matchReason: string[] = [];
    const searchableText = [
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

    if (preferences.genres?.length && intersects(game.genres, preferences.genres)) {
      score += 5;
      matchReason.push(...matchingValues(game.genres, preferences.genres).map((genre) => `${genre} genre`));
    }
    if (preferences.mood?.length && intersects(game.mood, preferences.mood)) {
      score += 4;
      matchReason.push(...matchingValues(game.mood, preferences.mood).map((mood) => `${mood} mood`));
    }
    if (preferences.storyline !== undefined && game.storyline === preferences.storyline) {
      score += 4;
      matchReason.push('Storyline');
    }
    if (preferences.rewardPotential && game.rewardPotential === preferences.rewardPotential) {
      score += 3;
      matchReason.push(`${game.rewardPotential} rewards`);
    }
    if (preferences.rewardFrequency && game.rewardFrequency === preferences.rewardFrequency) {
      score += 2;
      matchReason.push(`${game.rewardFrequency} reward frequency`);
    }
    if (preferences.progression && game.progression === preferences.progression) {
      score += 3;
      matchReason.push(`${game.progression} progression`);
    }
    if (preferences.complexity && game.complexity === preferences.complexity) {
      score += 2;
      matchReason.push(`${game.complexity} complexity`);
    }
    if (preferences.sessionLength && game.sessionLength === preferences.sessionLength) {
      score += 2;
      matchReason.push(`${game.sessionLength} sessions`);
    }

    const semanticMatches = countTermMatches(preferences.semanticTerms, searchableText);
    if (semanticMatches > 0) {
      score += Math.min(semanticMatches * 2, 8);
      matchReason.push('Description match');
    }

    return { ...game, score, matchReason: Array.from(new Set(matchReason)) };
  })
  .filter((game) => game.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);
