import { extractPreferencesAndReasons } from '../llm.service';
import { games } from '../../data/games';

const stream = (text: string) => ({ getReader: () => { let done=false; return { read: async () => done ? { done:true } : (done=true, { done:false, value:new TextEncoder().encode(text) }) }; } });

describe('extractPreferencesAndReasons', () => {
  beforeEach(() => { process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY='key'; });

  it('returns preferences and reasons', async () => {
    global.fetch=jest.fn().mockResolvedValue({
      ok: true,
      body: stream('data: {"choices":[{"delta":{"content":"{\\"preferences\\":{\\"genres\\":[\\"RPG\\"]},\\"reasons\\":{\\"Genshin Impact\\":\\"Great RPG fit for your query.\\"}}"}}]}\n'),
    }) as jest.Mock;

    await expect(extractPreferencesAndReasons('rpg adventure', games)).resolves.toEqual({
      preferences: { genres: ['RPG'] },
      reasons: { 'Genshin Impact': 'Great RPG fit for your query.' },
    });
  });

  it('handles fetch failure gracefully', async () => {
    global.fetch=jest.fn().mockRejectedValue(new Error('fail')) as jest.Mock;
    await expect(extractPreferencesAndReasons('x', games)).resolves.toEqual({ preferences: {}, reasons: {} });
  });

  it('handles malformed JSON', async () => {
    global.fetch=jest.fn().mockResolvedValue({ ok:true, body:stream('data: bad\n') }) as jest.Mock;
    await expect(extractPreferencesAndReasons('x', games)).resolves.toEqual({ preferences: {}, reasons: {} });
  });
});
