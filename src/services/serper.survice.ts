import { ExtractedPreferences } from '../types/Game';

const SERPER_ENDPOINT = 'https://google.serper.dev/search';

// Builds the most meaningful search query from user input
const buildSerperQuery = (userQuery: string): string => {
  const lower = userQuery.toLowerCase();

  // Reference-based: "like X", "similar to X", "X but Y"
  const likeMatch = lower.match(/(?:like|similar to|reminds me of|same as)\s+([a-z0-9\s:]+?)(?:\s+but|\s+with|\s+except|$)/i);
  if (likeMatch) {
    const refGame = likeMatch[1].trim();
    return `${refGame} mobile game gameplay mechanics genres mood`;
  }

  // Mood/vibe based: "something relaxing", "exciting game"
  const moodMatch = lower.match(/(?:something|a game that is|want something)\s+([a-z\s]+?)(?:\s+to play|$)/i);
  if (moodMatch) {
    return `${moodMatch[1].trim()} mobile games best 2024`;
  }

  // Fallback: append context to whatever they said
  return `${userQuery} mobile game genres gameplay style`;
};

export interface SerperGameContext {
  inferredGenres: string[];
  inferredMood: string[];
  inferredComplexity?: 'easy' | 'medium' | 'hard';
  inferredSessionLength?: 'short' | 'medium' | 'long';
  inferredStoryline?: boolean;
  referenceTitle?: string;    // the game they mentioned e.g. "Prince of Persia"
  contextSummary: string;     // raw snippet text to pass to LLM for richer matching
}

const GENRE_KEYWORDS: Record<string, string[]> = {
  puzzle:       ['puzzle', 'brain teaser', 'logic', 'match-3', 'word'],
  action:       ['action', 'combat', 'fighting', 'shooter', 'battle'],
  adventure:    ['adventure', 'exploration', 'open world', 'quest'],
  platformer:   ['platformer', 'platform', 'jump', 'run and jump'],
  rpg:          ['rpg', 'role-playing', 'level up', 'character build', 'loot'],
  strategy:     ['strategy', 'tower defense', 'tactical', 'resource management'],
  casual:       ['casual', 'hyper casual', 'idle', 'clicker', 'tap'],
  racing:       ['racing', 'driving', 'speed', 'drift'],
  sports:       ['sports', 'football', 'basketball', 'cricket', 'soccer'],
  arcade:       ['arcade', 'endless runner', 'high score', 'reflex'],
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  relaxing:     ['relaxing', 'calm', 'chill', 'meditative', 'peaceful', 'cozy'],
  exciting:     ['exciting', 'intense', 'adrenaline', 'fast-paced', 'thrilling'],
  competitive:  ['competitive', 'pvp', 'multiplayer', 'leaderboard', 'ranked'],
  mindless:     ['mindless', 'idle', 'passive', 'auto', 'no-brainer'],
  creative:     ['creative', 'build', 'design', 'craft', 'sandbox'],
  challenging:  ['challenging', 'difficult', 'hard', 'souls-like', 'punishing'],
};

const extractFromSnippets = (snippets: string): SerperGameContext => {
  const lower = snippets.toLowerCase();

  const inferredGenres = Object.entries(GENRE_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([genre]) => genre);

  const inferredMood = Object.entries(MOOD_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([mood]) => mood);

  const inferredComplexity: SerperGameContext['inferredComplexity'] =
    lower.match(/\b(hard|difficult|challenging|punishing|souls)/i) ? 'hard'
    : lower.match(/\b(easy|casual|simple|relaxing|idle|mindless)/i) ? 'easy'
    : undefined;

  const inferredSessionLength: SerperGameContext['inferredSessionLength'] =
    lower.match(/\b(quick|short|5 min|commute|break)/i) ? 'short'
    : lower.match(/\b(long|deep|hours|immersive|session)/i) ? 'long'
    : undefined;

  const inferredStoryline =
    lower.match(/\b(story|narrative|plot|lore|cutscene|dialogue)/i) ? true
    : lower.match(/\b(no story|arcade|endless|idle)/i) ? false
    : undefined;

  return {
    inferredGenres,
    inferredMood,
    inferredComplexity,
    inferredSessionLength,
    inferredStoryline: inferredStoryline ?? undefined,
    contextSummary: snippets.slice(0, 800), // cap to avoid bloating LLM context
  };
};

export const fetchSerperContext = async (userQuery: string): Promise<SerperGameContext | null> => {
  const apiKey = process.env.EXPO_PUBLIC_SERPER_API_KEY;
  if (!apiKey) return null;

  const searchQuery = buildSerperQuery(userQuery);

  try {
    const response = await fetch(SERPER_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: searchQuery, num: 5 }),
    });

    if (!response.ok) return null;

    const data = await response.json() as {
      organic?: { title: string; snippet: string }[];
      knowledgeGraph?: { description?: string; attributes?: Record<string, string> };
    };

    // Combine knowledge graph + organic snippets into one rich context string
    const knowledgeGraphText = data.knowledgeGraph
      ? [data.knowledgeGraph.description, ...Object.values(data.knowledgeGraph.attributes ?? {})].filter(Boolean).join(' ')
      : '';

    const organicText = (data.organic ?? [])
      .map((r) => `${r.title}: ${r.snippet}`)
      .join(' ');

    const combined = `${knowledgeGraphText} ${organicText}`.trim();
    if (!combined) return null;

    // Extract reference game title if query was "like X"
    const likeMatch = userQuery.match(/(?:like|similar to|reminds me of)\s+([A-Za-z0-9\s:]+?)(?:\s+but|\s+with|$)/i);

    return {
      ...extractFromSnippets(combined),
      referenceTitle: likeMatch?.[1]?.trim(),
      contextSummary: combined.slice(0, 800),
    };
  } catch {
    return null;
  }
};