import { games } from '../data/games';
import { ExtractedPreferences, Game } from '../types/Game';

const endpoint = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are an AI game concierge. The user has described what kind of game they
want to play. You will be given a list of games and the user's query.

You must return a single JSON object with exactly two keys:

{
  "preferences": {
    // Extracted structured preferences from the query.
    // Only include fields you are confident about.
    // Use these types exactly:
    // genres?: string[]
    // mood?: string[]
    // rewardPotential?: "low" | "medium" | "high"
    // rewardFrequency?: "low" | "medium" | "high"
    // sessionLength?: "short" | "medium" | "long"
    // storyline?: boolean
    // progression?: "low" | "medium" | "high"
    // complexity?: "low" | "medium" | "high"
    // description: 'string'
  },
  "reasons": {
    // For each game title in the catalog, write ONE sentence (max 120 chars)
    // explaining why this game might match the user's query.
    // The sentence must reference the user's actual query, not generic traits.
    // Example for query "I want something like Prince of Persia":
    //   "Genshin Impact": "Like Prince of Persia, it blends fluid combat with
    //                      rich exploration across a vast, story-driven world."
    // Example for query "something relaxing before bed":
    //   "Alto's Odyssey": "Its meditative snowboarding and gentle pacing make
    //                      it the perfect wind-down before sleep."
    // Only write reasons for games that are a plausible match.
    // You do NOT need to write a reason for every game — only good matches.
  }
}

Return ONLY the JSON object. No explanation. No markdown. No code fences.`;

const buildUserMessage = (query: string, catalog: Game[]): string => `User query: "${query}"

Game catalog:
${catalog.map((game) => `- ${game.title} | genres: ${game.genres.join(', ')} | mood: ${game.mood.join(', ')} | storyline: ${game.storyline} | sessionLength: ${game.sessionLength} | rewardPotential: ${game.rewardPotential} | complexity: ${game.complexity}`).join('\n')}`;

const emptyResult = (): { preferences: ExtractedPreferences; reasons: Record<string, string> } => ({
  preferences: {},
  reasons: {},
});

export const extractPreferencesAndReasons = async (
  query: string,
  catalog: Game[] = games,
): Promise<{ preferences: ExtractedPreferences; reasons: Record<string, string> }> => {
  const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
  if (!apiKey) return emptyResult();

  try {
    console.log(catalog);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-chat',
        stream: true,
        temperature: 0.1,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserMessage(query, catalog) },
        ],
      }),
    });

    if (!response.ok || !response.body) return emptyResult();

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      decoder.decode(value).split('\n').forEach((line) => {
        if (!line.startsWith('data: ') || line.includes('[DONE]')) return;
        try {
          content += JSON.parse(line.slice(6)).choices?.[0]?.delta?.content ?? '';
        } catch {}
      });
    }

    const json = content.match(/\{[\s\S]*\}/)?.[0];
    if (!json) return emptyResult();

    const parsed = JSON.parse(json) as { preferences?: ExtractedPreferences; reasons?: Record<string, string> };
    return {
      preferences: parsed.preferences ?? {},
      reasons: parsed.reasons ?? {},
    };
  } catch {
    return emptyResult();
  }
};
