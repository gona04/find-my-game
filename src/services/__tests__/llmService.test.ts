import { extractPreferences } from '../llmService';

const stream = (text: string) => ({ getReader: () => { let done=false; return { read: async () => done ? { done:true } : (done=true, { done:false, value:new TextEncoder().encode(text) }) }; } });

describe('extractPreferences', () => {
  beforeEach(() => { process.env.EXPO_PUBLIC_DEEPSEEK_API_KEY='key'; });
  it('returns valid preferences', async () => { global.fetch=jest.fn().mockResolvedValue({ ok:true, body:stream('data: {"choices":[{"delta":{"content":"{\\"genres\\":[\\"RPG\\"]}"}}]}\n') }) as jest.Mock; await expect(extractPreferences('rpg')).resolves.toMatchObject({ genres:['RPG'] }); });
  it('handles fetch failure gracefully', async () => { global.fetch=jest.fn().mockRejectedValue(new Error('fail')) as jest.Mock; await expect(extractPreferences('x')).resolves.toMatchObject({ matchedFields:0 }); });
  it('handles malformed JSON', async () => { global.fetch=jest.fn().mockResolvedValue({ ok:true, body:stream('data: bad\n') }) as jest.Mock; await expect(extractPreferences('x')).resolves.toMatchObject({ matchedFields:0 }); });
  it('updates streamingStatus', async () => { global.fetch=jest.fn().mockResolvedValue({ ok:true, body:stream('data: [DONE]\n') }) as jest.Mock; const statuses:string[]=[]; await extractPreferences('x', s=>statuses.push(s)); expect(statuses).toContain('Understanding your vibe...'); });
});
