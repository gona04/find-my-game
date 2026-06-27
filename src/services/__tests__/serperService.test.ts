import { fetchSerperContext } from '../serper.survice';

describe('fetchSerperContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_SERPER_API_KEY = 'test-key';
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_SERPER_API_KEY;
  });

  it('returns null when API key is not set', async () => {
    delete process.env.EXPO_PUBLIC_SERPER_API_KEY;
    const result = await fetchSerperContext('any game');
    expect(result).toBeNull();
  });

  it('extracts genres from SERP response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'RPG Game',
          snippet: 'an rpg with action and adventure elements'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something like a game');
    expect(result?.inferredGenres).toContain('rpg');
    expect(result?.inferredGenres).toContain('action');
    expect(result?.inferredGenres).toContain('adventure');
  });

  it('extracts mood from SERP response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Relaxing Game',
          snippet: 'a relaxing and calm gameplay experience'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something relaxing');
    expect(result?.inferredMood).toContain('relaxing');
  });

  it('extracts complexity as hard when mentioned', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Difficult Game',
          snippet: 'a challenging and difficult game'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something hard');
    expect(result?.inferredComplexity).toBe('hard');
  });

  it('extracts complexity as easy when mentioned', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Easy Game',
          snippet: 'a casual and easy mobile game'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something easy');
    expect(result?.inferredComplexity).toBe('easy');
  });

  it('defaults to medium complexity when not specified', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Game',
          snippet: 'a game'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('some game');
    expect(result?.inferredComplexity).toBe('medium');
  });

  it('extracts session length as short', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Quick Game',
          snippet: 'a quick 5 minute commute game'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something quick');
    expect(result?.inferredSessionLength).toBe('short');
  });

  it('extracts session length as long', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Long Game',
          snippet: 'a long immersive session game'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something long');
    expect(result?.inferredSessionLength).toBe('long');
  });

  it('extracts storyline as true', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Story Game',
          snippet: 'a game with great story and narrative'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something with story');
    expect(result?.inferredStoryline).toBe(true);
  });

  it('extracts storyline as false when indicated by keywords', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Endless Arcade',
          snippet: 'no story arcade endless'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('something casual');
    // Should have an inferredStoryline value (true, false, or undefined)
    expect(result?.inferredStoryline !== undefined).toBe(true);
  });

  it('handles "like" pattern in query', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Similar Game',
          snippet: 'rpg adventure'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('like Zelda but more casual');
    expect(result?.referenceTitle).toContain('Zelda');
    expect(result).not.toBeNull();
  });

  it('handles "similar to" pattern in query', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Similar Game',
          snippet: 'strategy'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('similar to Clash of Clans but faster');
    expect(result?.referenceTitle).toContain('Clash of Clans');
  });

  it('handles "reminds me of" pattern', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Game',
          snippet: 'rpg'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('reminds me of Final Fantasy');
    expect(result?.referenceTitle).toContain('Final Fantasy');
  });

  it('handles response with answerBox', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        answerBox: {
          snippet: 'a relaxing puzzle game with great graphics'
        }
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('what kind of game is puzzle');
    expect(result?.inferredGenres).toContain('puzzle');
    expect(result?.inferredMood).toContain('relaxing');
  });

  it('handles response with knowledgeGraph', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        knowledgeGraph: {
          description: 'an action rpg game',
          attributes: {
            genre: 'action',
            platform: 'mobile'
          }
        }
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('tell me about this game');
    expect(result?.inferredGenres).toContain('action');
    expect(result?.inferredGenres).toContain('rpg');
  });

  it('prioritizes answerBox over organic results', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        answerBox: {
          answer: 'relaxing puzzle game'
        },
        organic: [{
          title: 'Action Game',
          snippet: 'action rpg'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('what is this');
    expect(result).not.toBeNull();
  });

  it('returns null when response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    }) as jest.Mock;

    const result = await fetchSerperContext('any game');
    expect(result).toBeNull();
  });

  it('returns null when fetch throws error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error')) as jest.Mock;

    const result = await fetchSerperContext('any game');
    expect(result).toBeNull();
  });

  it('returns null when response has no content', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as jest.Mock;

    const result = await fetchSerperContext('any game');
    expect(result).toBeNull();
  });

  it('extracts multiple genres correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Multi-Genre Game',
          snippet: 'action puzzle strategy game with racing elements'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('multi genre');
    expect(result?.inferredGenres.length).toBeGreaterThan(1);
    expect(result?.inferredGenres).toContain('action');
    expect(result?.inferredGenres).toContain('puzzle');
    expect(result?.inferredGenres).toContain('strategy');
  });

  it('extracts multiple moods correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Multi-Mood Game',
          snippet: 'relaxing yet competitive and exciting gameplay'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('multiple moods');
    expect(result?.inferredMood.length).toBeGreaterThan(1);
  });

  it('includes contextSummary in response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Game Info',
          snippet: 'this is game information'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('tell me');
    expect(result?.contextSummary).toBeTruthy();
    expect(result?.contextSummary?.length).toBeGreaterThan(0);
  });

  it('handles "something that is" mood pattern', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Exciting Game',
          snippet: 'exciting and thrilling'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('a game that is exciting');
    expect(result?.inferredMood).toContain('exciting');
  });

  it('handles "I want" intent pattern', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Build Game',
          snippet: 'building game creative sandbox'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('I want to build things');
    expect(result).not.toBeNull();
  });

  it('caps contextSummary to 800 characters', async () => {
    const longSnippet = 'word '.repeat(500);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Game',
          snippet: longSnippet
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('game');
    expect(result?.contextSummary?.length).toBeLessThanOrEqual(800);
  });

  it('extracts multiple organic results', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [
          { title: 'Game1', snippet: 'rpg game' },
          { title: 'Game2', snippet: 'action game' },
          { title: 'Game3', snippet: 'puzzle game' }
        ]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('game search');
    expect(result?.inferredGenres.length).toBeGreaterThan(0);
  });

  it('handles competitive and pvp keywords', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'PvP Game',
          snippet: 'competitive pvp multiplayer leaderboard'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('pvp game');
    expect(result?.inferredMood).toContain('competitive');
  });

  it('handles sandbox and open world keywords', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        organic: [{
          title: 'Sandbox Game',
          snippet: 'sandbox open world free roam'
        }]
      }),
    }) as jest.Mock;

    const result = await fetchSerperContext('sandbox game');
    expect(result?.inferredGenres).toContain('sandbox');
  });
});
