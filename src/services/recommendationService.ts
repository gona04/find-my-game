import { games } from '../data/games';
import { Game, RewardType } from '../types/Game';
import { GamePreferences } from '../utils/gameMatcher';

export type Recommendation = Game & { score: number; matchReason: string };

const normalize = (value: string): string => value.toLowerCase();
const matchingValues = (a: string[] = [], b: string[] = []): string[] => a.filter((x) => b.map(normalize).includes(normalize(x)));
const countTermMatches = (terms: string[] = [], text: string): number => terms.reduce((total, term) => total + (text.includes(normalize(term)) ? 1 : 0), 0);
const truncateReason = (reason: string): string => reason.length > 100 ? `${reason.slice(0, 97)}...` : reason;
const rewardEmoji = (rewardType: RewardType): string => ({ Cash: '💰', 'Amazon Coupon': '💰', 'Movie Ticket': '🎬', 'Mall Discount': '🛍', 'Gift Card': '🎁', PayPal: '💸', 'Google Play Credit': '▶️', 'App Store Credit': '' }[rewardType]);

const buildMatchReason = (game: Game, preferences: GamePreferences, matched: string[]): string => {
  const topAttribute = matched[0] ?? (game.storyline ? 'a rich storyline' : `${game.rewardPotential} rewards`);
  if (preferences.referencedGame) return truncateReason(`Similar ${game.genres[0].toLowerCase()} gameplay to ${preferences.referencedGame}, with ${topAttribute}`);
  const mood = preferences.mood?.[0];
  if (mood && ['calm', 'relaxed', 'relaxing', 'cozy', 'chill'].includes(normalize(mood))) return truncateReason(`Matches your ${mood} vibe — ${game.sessionLength} sessions, ${game.complexity} complexity`);
  if (preferences.rewardTypes?.length || preferences.rewardPotential === 'high') {
    const rewardType = preferences.rewardTypes?.find((type) => game.rewardTypes.includes(type)) ?? game.rewardTypes[0];
    return truncateReason(`Top pick for ${rewardType} rewards with ${game.rewardPotential} reward potential`);
  }
  if (preferences.sessionLength === 'short') return truncateReason(`Perfect for a quick session — ${game.sessionLength} play time, ${game.complexity} to pick up`);
  return truncateReason(`Matched on: ${(matched.length ? matched : [game.genres[0], `${game.rewardPotential} rewards`]).join(', ')}`);
};

export const getRecommendations = (preferences: GamePreferences): Recommendation[] => {
  const scored = games.map((game) => {
    let score = 0;
    const matched: string[] = [];
    const searchableText = [game.title, game.description, game.genres.join(' '), game.mood.join(' '), game.rewardTypes.join(' '), game.rewardPotential, game.rewardFrequency, game.sessionLength, game.progression, game.complexity, game.storyline ? 'story storyline narrative' : ''].join(' ').toLowerCase();

    const genreMatches = matchingValues(game.genres, preferences.genres);
    score += genreMatches.length * 5;
    matched.push(...genreMatches.map((genre) => `${genre} genre`));

    const moodMatches = matchingValues(game.mood, preferences.mood);
    score += moodMatches.length * 4;
    matched.push(...moodMatches.map((mood) => `${mood} mood`));

    const rewardMatches = matchingValues(game.rewardTypes, preferences.rewardTypes);
    score += rewardMatches.length * 4;
    matched.push(...rewardMatches.map((reward) => `${rewardEmoji(reward as RewardType)} ${reward}`));

    if (preferences.storyline !== undefined && game.storyline === preferences.storyline) { score += 4; matched.push(game.storyline ? 'rich storyline' : 'no storyline'); }
    if (preferences.rewardPotential && game.rewardPotential === preferences.rewardPotential) { score += 3; matched.push(`${game.rewardPotential} rewards`); }
    if (preferences.rewardFrequency && game.rewardFrequency === preferences.rewardFrequency) { score += 2; matched.push(`${game.rewardFrequency} reward frequency`); }
    if (preferences.progression && game.progression === preferences.progression) { score += 3; matched.push(`${game.progression} progression`); }
    if (preferences.complexity && game.complexity === preferences.complexity) { score += 2; matched.push(`${game.complexity} complexity`); }
    if (preferences.sessionLength && game.sessionLength === preferences.sessionLength) { score += 2; matched.push(`${game.sessionLength} sessions`); }
    const semanticMatches = countTermMatches(preferences.semanticTerms, searchableText);
    if (semanticMatches > 0) { score += Math.min(semanticMatches * 2, 8); matched.push('description match'); }

    return { ...game, score, matchReason: buildMatchReason(game, preferences, Array.from(new Set(matched))) };
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
  return scored.filter((game) => game.score > 0).slice(0, 5).concat(scored.filter((game) => game.score === 0).slice(0, Math.max(0, 5 - scored.filter((game) => game.score > 0).length))).slice(0, 5);
};
