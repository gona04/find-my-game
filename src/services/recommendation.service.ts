import { games } from '../data/games';
import { Game, GameWithScore } from '../types/Game';
import { GamePreferences } from '../utils/gameMatcher';

export type Recommendation = GameWithScore;

const normalize = (value: string): string => value.toLowerCase();
const matchingValues = (a: string[] = [], b: string[] = []): string[] => a.filter((x) => b.map(normalize).includes(normalize(x)));
const countTermMatches = (terms: string[] = [], text: string): number => terms.reduce((total, term) => total + (text.includes(normalize(term)) ? 1 : 0), 0);
const truncateReason = (reason: string): string => reason.length > 100 ? `${reason.slice(0, 97)}...` : reason;
const buildIntentPhrase = (preferences: GamePreferences): string => {
  const pieces: string[] = [];
  const mood = preferences.mood?.[0];
  if (mood) pieces.push(`${mood} vibe`);
  if (preferences.sessionLength) pieces.push(`${preferences.sessionLength} sessions`);
  if (preferences.rewardPotential) pieces.push(`${preferences.rewardPotential} rewards`);
  if (preferences.complexity) pieces.push(`${preferences.complexity} complexity`);
  if (preferences.referencedGame) pieces.push(`the feel of ${preferences.referencedGame}`);
  if (preferences.genres?.[0]) pieces.push(`${preferences.genres[0].toLowerCase()} gameplay`);
  return pieces.slice(0, 3).join(' and ');
};

const buildMatchReason = (game: Game, preferences: GamePreferences, matched: string[]): string => {
  const meaningfulMatches = matched.filter((item) => item !== 'description match' && item !== 'your description');
  const topAttribute = meaningfulMatches[0] ?? (game.storyline ? 'a rich storyline' : `${game.rewardPotential} gem potential`);
  
  // For named-game references, provide narrative context
  if (preferences.referencedGame) {
    const genreMatch = game.genres[0]?.toLowerCase() || 'action';
    return truncateReason(`Offers ${genreMatch} gameplay similar to ${preferences.referencedGame} with ${game.sessionLength} sessions and ${game.complexity} complexity.`);
  }
  
  // For mood-based searches
  const mood = preferences.mood?.[0];
  if (mood && ['calm', 'relaxed', 'relaxing', 'cozy', 'chill'].includes(normalize(mood))) {
    return truncateReason(`Perfect ${mood} experience — ${game.sessionLength} sessions of ${game.genres[0]?.toLowerCase() || 'gameplay'} with ${game.complexity} complexity.`);
  }
  
  // For reward-focused searches
  if (preferences.rewardPotential === 'high') {
    return truncateReason(`Strong ${game.rewardPotential} gem potential with ${game.genres[0]?.toLowerCase() || 'engaging'} gameplay in ${game.sessionLength} sessions.`);
  }
  
  // For time-constrained searches
  if (preferences.sessionLength === 'short') {
    return truncateReason(`Fits a quick session — ${game.genres[0]?.toLowerCase() || 'engaging'} ${game.complexity} gameplay you can pick up fast.`);
  }
  
  // For semantic/intent-based searches
  if (preferences.semanticTerms?.length) {
    const intentPhrase = buildIntentPhrase(preferences);
    const terms = preferences.semanticTerms.filter((term) => term.trim().length > 2).slice(0, 3);
    if (terms.length && intentPhrase) {
      return truncateReason(`It lines up with what you described around ${terms.join(', ')} and keeps the ${intentPhrase} you asked for.`);
    }
    if (terms.length) {
      return truncateReason(`Features ${terms.slice(0, 2).join(' and ')} that match your description.`);
    }
    if (intentPhrase) {
      return truncateReason(`This ${game.genres[0]?.toLowerCase() || 'game'} captures the ${intentPhrase} you're looking for.`);
    }
  }
  
  // Improved fallback: build a meaningful reason from game attributes
  if (meaningfulMatches.length) {
    return truncateReason(`Matches on ${meaningfulMatches.slice(0, 2).join(' and ')} — a ${game.complexity} ${game.genres[0]?.toLowerCase() || 'game'}.`);
  }
  
  // Last resort: storytelling about the game's strengths
  const strengths: string[] = [];
  if (game.storyline) strengths.push('rich narrative');
  if (game.genres.length > 0) strengths.push(`${game.genres[0].toLowerCase()} gameplay`);
  if (game.mood.length > 0) strengths.push(`${game.mood[0].toLowerCase()} vibe`);
  if (game.rewardPotential === 'high') strengths.push('rewarding progression');
  
  if (strengths.length > 0) {
    return truncateReason(`Features ${strengths.slice(0, 2).join(' and ')} — worth exploring.`);
  }
  
  // Absolute fallback
  return truncateReason(`A ${game.complexity} ${game.genres[0]?.toLowerCase() || 'game'} that's worth checking out.`);
};

export const getRecommendations = (preferences: GamePreferences, reasons: Record<string, string> = {}): Recommendation[] => {
  const scored = games.map((game) => {
    let score = 0;
    const matched: string[] = [];
    const searchableText = [game.title, game.description, game.genres.join(' '), game.mood.join(' '), game.rewardPotential, game.rewardFrequency, game.sessionLength, game.progression, game.complexity, game.storyline ? 'story storyline narrative' : ''].join(' ').toLowerCase();

    const genreMatches = matchingValues(game.genres, preferences.genres);
    score += genreMatches.length * 5;
    matched.push(...genreMatches.map((genre) => `${genre} genre`));

    const moodMatches = matchingValues(game.mood, preferences.mood);
    score += moodMatches.length * 4;
    matched.push(...moodMatches.map((mood) => `${mood} mood`));

    if (preferences.storyline !== undefined && game.storyline === preferences.storyline) { score += 4; matched.push(game.storyline ? 'rich storyline' : 'no storyline'); }
    if (preferences.rewardPotential && game.rewardPotential === preferences.rewardPotential) { score += 3; matched.push(`${game.rewardPotential} gem potential`); }
    if (preferences.rewardFrequency && game.rewardFrequency === preferences.rewardFrequency) { score += 2; matched.push(`${game.rewardFrequency} reward frequency`); }
    if (preferences.progression && game.progression === preferences.progression) { score += 3; matched.push(`${game.progression} progression`); }
    if (preferences.complexity && game.complexity === preferences.complexity) { score += 2; matched.push(`${game.complexity} complexity`); }
    if (preferences.sessionLength && game.sessionLength === preferences.sessionLength) { score += 2; matched.push(`${game.sessionLength} sessions`); }
    const semanticMatches = countTermMatches(preferences.semanticTerms, searchableText);
    if (semanticMatches > 0) { score += Math.min(semanticMatches * 2, 8); matched.push('your description'); }

    const matchReason = buildMatchReason(game, preferences, Array.from(new Set(matched)));
    const rawReason = reasons?.[game.title];
    const banned = /\b(stupid|stupidly|dumb|idiot|idiotic|moron|sucks|terrible|awful|foul|offensive|insult)\b/i;
    const validRaw = typeof rawReason === 'string' && rawReason.trim().split(/\s+/).length >= 3 && !banned.test(rawReason);
    const whyText = validRaw ? rawReason.trim() : matchReason;
    return { ...game, score, matchReason, whyRecommended: whyText };
  }).sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  return scored.filter((game) => game.score > 0).slice(0, 5).concat(scored.filter((game) => game.score === 0).slice(0, Math.max(0, 5 - scored.filter((game) => game.score > 0).length))).slice(0, 5);
};
