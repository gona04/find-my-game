import { GamePreferences } from '../utils/gameMatcher';

const endpoint = 'https://api.deepseek.com/v1/chat/completions';

export const extractPreferences = async (query: string, onStatus?: (status: string) => void): Promise<GamePreferences> => {
  const apiKey = process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DeepSeek API key is missing.');
  onStatus?.('Understanding your vibe...');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'deepseek-chat', stream: true, temperature: 0.2,
      messages: [
        { role: 'system', content: 'Return only compact JSON game preferences. Keys: genres string[], mood string[], storyline boolean, rewardPotential low|medium|high, rewardFrequency low|medium|high, progression low|medium|high, complexity easy|medium|hard, sessionLength short|medium|long.' },
        { role: 'user', content: query },
      ],
    }),
  });
  if (!response.ok || !response.body) throw new Error('DeepSeek request failed.');
  onStatus?.('Finding your matches...');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let content = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    decoder.decode(value).split('\n').forEach((line) => {
      if (!line.startsWith('data: ') || line.includes('[DONE]')) return;
      try { content += JSON.parse(line.slice(6)).choices?.[0]?.delta?.content ?? ''; } catch {}
    });
  }
  const json = content.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error('Could not parse AI preferences.');
  return JSON.parse(json) as GamePreferences;
};
