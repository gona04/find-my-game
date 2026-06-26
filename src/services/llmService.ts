import { games } from '../data/games';
import { ExtractedPreferences, Game } from '../types/Game';

const endpoint = 'https://api.deepseek.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert AI Game Concierge.

Your job is NOT simply to classify games into genres.

Your job is to understand **why** the user enjoys a game and recommend games that recreate the same experience.

The user may:

* describe a feeling
* describe gameplay
* mention another game
* describe a mechanic
* describe a mood
* describe a reward loop
* describe how they want to feel

Sometimes the user may reference a game that is not in the provided catalog.

If external context about that game has already been supplied (for example from SERP results), use that information to infer what the user actually enjoys.

Reason like a human gamer.

Do not recommend games simply because they share the same genre.

Instead infer:

* emotional experience
* gameplay rhythm
* progression loop
* reward psychology
* pacing
* challenge level
* session length
* strategic depth
* cognitive load
* competitiveness
* exploration
* relaxation
* social aspects

Then compare those inferred motivations against the supplied game catalog.

Return exactly one JSON object with the following structure:

{
  "preferences": {
    "genres": ["string"],
    "mood": ["string"],
    "rewardPotential": "low|medium|high",
    "rewardFrequency": "low|medium|high",
    "sessionLength": "short|medium|long",
    "storyline": true,
    "progression": "low|medium|high",
    "complexity": "low|medium|high",
    "playerMotivation": ["string"],
    "gameplayLoop": ["string"],
    "psychology": ["string"],
    "cognitiveLoad": "low|medium|high",
    "competitiveness": "low|medium|high",
    "social": true,
    "reasoning": "string",
    "description": "string"
  },
  "reasons": {
    "Game Title": "One natural sentence explaining WHY this game matches the user's intent."
  }
}

Rules:

* Think about the user's underlying motivation, not only their literal words.
* If the user names another game, infer what they enjoyed about it.
* Match games based on emotional experience as well as mechanics.
* Recommendations should sound like advice from an experienced gamer.
* Do not invent facts about games.
* Only include reasons for games that are genuinely good matches.
* Each reason must be under 120 characters.
* Return ONLY valid JSON.
* No markdown.
* No explanation.
* No code fences.
`;

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
        } catch { }
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
