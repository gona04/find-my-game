const SERPER_ENDPOINT = 'https://google.serper.dev/search';

export interface SerperGameContext {
  inferredGenres:         string[];
  inferredMood:           string[];
  inferredComplexity?:    'easy' | 'medium' | 'hard';
  inferredSessionLength?: 'short' | 'medium' | 'long';
  inferredStoryline?:     boolean;
  referenceTitle?:        string;
  contextSummary:         string;
}

// ── Query builder — searches for INTENT not the game itself ───────────────────
const buildSerperQuery = (userQuery: string): string => {
  const lower = userQuery.toLowerCase();

  // "like X", "similar to X", "same as X"
  const likeMatch = lower.match(
    /(?:like|similar to|reminds me of|same as)\s+([a-z0-9\s:'+\-]+?)(?:\s+but|\s+with|\s+except|$)/i
  );
  if (likeMatch) {
    const refGame = likeMatch[1].trim();
    // Search for what people love about it + what's similar to it
    // This finds "what makes X popular" + "games like X" in one query
    return `what kind of game is ${refGame} genre mood gameplay style`;
  }

  // "I want something relaxing", "give me something exciting"
  const moodMatch = lower.match(
    /(?:something|a game that is|want something|give me)\s+([a-z\s]+?)(?:\s+to play|game|$)/i
  );
  if (moodMatch) {
    return `mobile games that are ${moodMatch[1].trim()} genre gameplay`;
  }

  // "I want to grind", "I want to build things", "I want fast paced"
  const intentMatch = lower.match(/i want (?:to\s+)?([a-z\s]+?)(?:\s+game|$)/i);
  if (intentMatch) {
    return `mobile games where you ${intentMatch[1].trim()} genre style`;
  }

  // Fallback
  return `mobile game similar to ${userQuery} genre gameplay mood`;
};

// ── Keyword maps ──────────────────────────────────────────────────────────────
const GENRE_KEYWORDS: Record<string, string[]> = {
  puzzle:       ['puzzle', 'brain teaser', 'logic', 'match-3', 'word'],
  action:       ['action', 'combat', 'fighting', 'shooter', 'battle', 'stealth', 'assassination'],
  adventure:    ['adventure', 'exploration', 'open world', 'quest', 'parkour', 'free-roam'],
  platformer:   ['platformer', 'platform', 'jump', 'run and jump'],
  rpg:          ['rpg', 'role-playing', 'level up', 'character build', 'loot', 'skill tree'],
  strategy:     ['strategy', 'tower defense', 'tactical', 'resource management'],
  casual:       ['casual', 'hyper casual', 'idle', 'clicker', 'tap'],
  racing:       ['racing', 'driving', 'speed', 'drift'],
  sports:       ['sports', 'football', 'basketball', 'cricket', 'soccer'],
  arcade:       ['arcade', 'endless runner', 'high score', 'reflex'],
  stealth:      ['stealth', 'assassin', 'sneak', 'hide', 'covert'],
  sandbox:      ['sandbox', 'open world', 'free roam', 'non-linear'],
};

const MOOD_KEYWORDS: Record<string, string[]> = {
  relaxing:     ['relaxing', 'calm', 'chill', 'meditative', 'peaceful', 'cozy'],
  exciting:     ['exciting', 'intense', 'adrenaline', 'fast-paced', 'thrilling'],
  competitive:  ['competitive', 'pvp', 'multiplayer', 'leaderboard', 'ranked'],
  mindless:     ['mindless', 'idle', 'passive', 'auto', 'no-brainer'],
  creative:     ['creative', 'build', 'design', 'craft', 'sandbox'],
  challenging:  ['challenging', 'difficult', 'hard', 'souls-like', 'punishing'],
  immersive:    ['immersive', 'story-rich', 'cinematic', 'atmospheric', 'deep lore'],
  epic:         ['epic', 'grand', 'massive', 'huge world', 'sprawling'],
};

// ── Extract structured preferences from SERP snippets ─────────────────────────
const extractFromSnippets = (snippets: string): Omit<SerperGameContext, 'referenceTitle' | 'contextSummary'> => {
  const lower = snippets.toLowerCase();

  const inferredGenres = Object.entries(GENRE_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([genre]) => genre);

  const inferredMood = Object.entries(MOOD_KEYWORDS)
    .filter(([, keywords]) => keywords.some((kw) => lower.includes(kw)))
    .map(([mood]) => mood);

  const inferredComplexity: SerperGameContext['inferredComplexity'] =
      lower.match(/\b(hard|difficult|challenging|punishing|souls|complex)/i) ? 'hard'
    : lower.match(/\b(easy|casual|simple|relaxing|idle|mindless|accessible)/i) ? 'easy'
    : 'medium'; // default to medium instead of undefined — avoids zero-signal on complexity

  const inferredSessionLength: SerperGameContext['inferredSessionLength'] =
      lower.match(/\b(quick|short|5 min|commute|break|bite.sized)/i) ? 'short'
    : lower.match(/\b(long|deep|hours|immersive|session|marathon)/i) ? 'long'
    : undefined;

  const inferredStoryline =
      lower.match(/\b(story|narrative|plot|lore|cutscene|dialogue|cinematic)/i) ? true
    : lower.match(/\b(no story|arcade|endless|idle|casual)/i) ? false
    : undefined;

  return { inferredGenres, inferredMood, inferredComplexity, inferredSessionLength, inferredStoryline };
};

// ── Main export ───────────────────────────────────────────────────────────────
export const fetchSerperContext = async (userQuery: string): Promise<SerperGameContext | null> => {
  const apiKey = process.env.EXPO_PUBLIC_SERPER_API_KEY;
  if (!apiKey) return null;

  const searchQuery = buildSerperQuery(userQuery);
  console.log('[SERP] Query sent:', searchQuery); // helpful for debugging

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
      organic?:       { title: string; snippet: string }[];
      knowledgeGraph?: { description?: string; attributes?: Record<string, string> };
      answerBox?:     { answer?: string; snippet?: string }; // ← Serper often returns this for "what kind of game is X"
    };

    const answerBoxText   = data.answerBox?.snippet ?? data.answerBox?.answer ?? '';
    const knowledgeGraphText = data.knowledgeGraph
      ? [data.knowledgeGraph.description, ...Object.values(data.knowledgeGraph.attributes ?? {})].filter(Boolean).join(' ')
      : '';
    const organicText = (data.organic ?? [])
      .map((r) => `${r.title}: ${r.snippet}`)
      .join(' ');

    // answerBox first — it's the most direct answer to "what kind of game is X"
    const combined = `${answerBoxText} ${knowledgeGraphText} ${organicText}`.trim();
    if (!combined) return null;

    console.log('[SERP] Raw context:', combined.slice(0, 300)); // debug

    const likeMatch = userQuery.match(
      /(?:like|similar to|reminds me of)\s+([A-Za-z0-9\s:'+\-]+?)(?:\s+but|\s+with|$)/i
    );

    return {
      ...extractFromSnippets(combined),
      referenceTitle: likeMatch?.[1]?.trim(),
      contextSummary: combined.slice(0, 800),
    };
  } catch {
    return null;
  }
};