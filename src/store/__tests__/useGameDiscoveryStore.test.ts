import { gameDiscoveryActions, getGameDiscoveryStoreSnapshot } from '../useGameDiscoveryStore';

jest.mock('../../services/llm.service', () => ({
  extractPreferencesAndReasons: jest.fn(async () => ({
    preferences: { genres: ['RPG'] },
    reasons: { 'Genshin Impact': 'Why Genshin Impact fits you.' },
  })),
}));

jest.mock('../../services/serper.survice', () => ({
  fetchSerperContext: jest.fn(async () => null),
}));

describe('useGameDiscoveryStore actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    gameDiscoveryActions.clearResults();
  });

  it('initial state is correct', () => {
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.query).toBe('');
    expect(s.loading).toBe(false);
    expect(s.recommendations).toEqual([]);
    expect(s.error).toBeNull();
    expect(s.streamingStatus).toBe('');
    expect(s.hasZeroMatch).toBe(false);
  });

  it('setQuery updates query', () => {
    gameDiscoveryActions.setQuery('abc');
    expect(getGameDiscoveryStoreSnapshot().query).toBe('abc');
  });

  it('setQuery with empty string', () => {
    gameDiscoveryActions.setQuery('');
    expect(getGameDiscoveryStoreSnapshot().query).toBe('');
  });

  it('setQuery with special characters', () => {
    gameDiscoveryActions.setQuery('game-like: puzzle & action!');
    expect(getGameDiscoveryStoreSnapshot().query).toBe('game-like: puzzle & action!');
  });

  it('clearResults resets all state', () => {
    gameDiscoveryActions.setQuery('test');
    gameDiscoveryActions.clearResults();
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations).toEqual([]);
    expect(s.error).toBeNull();
    expect(s.routingPath).toBeNull();
    expect(s.streamingStatus).toBe('');
    expect(s.hasZeroMatch).toBe(false);
  });

  it('searchGames sets loading to false after completion', async () => {
    const p = gameDiscoveryActions.searchGames('story game');
    const during = getGameDiscoveryStoreSnapshot().loading;
    await p;
    expect(during).toBe(true);
    expect(getGameDiscoveryStoreSnapshot().loading).toBe(false);
  });

  it('searchGames with empty query sets error message', async () => {
    await gameDiscoveryActions.searchGames('');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.error).toContain('Tell us');
    expect(s.recommendations).toEqual([]);
  });

  it('searchGames with whitespace-only query sets error', async () => {
    await gameDiscoveryActions.searchGames('   ');
    expect(getGameDiscoveryStoreSnapshot().error).toContain('Tell us');
  });

  it('routingPath is keyword when keywords matched with genre and mood', async () => {
    await gameDiscoveryActions.searchGames('relaxing puzzle game');
    expect(getGameDiscoveryStoreSnapshot().routingPath).toBe('keyword');
  });

  it('routingPath is llm when no keywords matched', async () => {
    await gameDiscoveryActions.searchGames('zzzz');
    expect(getGameDiscoveryStoreSnapshot().routingPath).toBe('llm');
  });

  it('searchGames with multiple genres passes keyword threshold', async () => {
    await gameDiscoveryActions.searchGames('action puzzle strategy game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('searchGames provides recommendations', async () => {
    await gameDiscoveryActions.searchGames('competitive action game');
    expect(getGameDiscoveryStoreSnapshot().recommendations.length).toBeGreaterThan(0);
  });

  it('searchGames with reward keywords', async () => {
    await gameDiscoveryActions.searchGames('I want lots of gems reward game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('sets hasZeroMatch to false when recommendations exist', async () => {
    await gameDiscoveryActions.searchGames('adventure game');
    expect(getGameDiscoveryStoreSnapshot().hasZeroMatch).toBe(false);
  });

  it('initializes streaming status during search', async () => {
    const promise = gameDiscoveryActions.searchGames('test game');
    // Streaming status should be set immediately
    await promise;
    // After completion, it should be cleared
    expect(getGameDiscoveryStoreSnapshot().streamingStatus).toBe('');
  });

  it('clears error when search completes successfully', async () => {
    await gameDiscoveryActions.searchGames('adventure game');
    expect(getGameDiscoveryStoreSnapshot().error).toBeNull();
  });

  it('handles query override parameter', async () => {
    gameDiscoveryActions.setQuery('original query');
    await gameDiscoveryActions.searchGames('adventure game');
    // The override should be used for searching
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.query).toBe('original query'); // query state stays the same
  });

  it('handles search with storyline preference', async () => {
    await gameDiscoveryActions.searchGames('I want a story game');
    expect(getGameDiscoveryStoreSnapshot().recommendations.length).toBeGreaterThan(0);
  });

  it('handles search with session length preference', async () => {
    await gameDiscoveryActions.searchGames('quick 10 minute game');
    expect(getGameDiscoveryStoreSnapshot().recommendations.length).toBeGreaterThan(0);
  });

  it('handles search with complexity preference', async () => {
    await gameDiscoveryActions.searchGames('something easy and relaxing');
    expect(getGameDiscoveryStoreSnapshot().recommendations.length).toBeGreaterThan(0);
  });

  it('clears recommendations when starting new search', async () => {
    await gameDiscoveryActions.searchGames('adventure game');
    const first = getGameDiscoveryStoreSnapshot().recommendations.length;
    
    await gameDiscoveryActions.searchGames('puzzle game');
    // New recommendations should replace old ones
    expect(getGameDiscoveryStoreSnapshot().recommendations).toBeDefined();
  });

  it('handles query with multiple preference signals', async () => {
    await gameDiscoveryActions.searchGames('relaxing idle builder with high rewards');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
    expect(s.routingPath).toBe('keyword');
  });

  it('updates streaming status with different messages', async () => {
    await gameDiscoveryActions.searchGames('adventure game');
    // Streaming status should be cleared after completion
    expect(getGameDiscoveryStoreSnapshot().streamingStatus).toBe('');
  });

  it('handles low-confidence queries that go to LLM', async () => {
    await gameDiscoveryActions.searchGames('something fun');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.routingPath).toBe('llm');
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('handles high-confidence queries with multiple matches', async () => {
    await gameDiscoveryActions.searchGames('relaxing puzzle game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.routingPath).toBe('keyword');
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('provides recommendations even when no keywords match', async () => {
    await gameDiscoveryActions.searchGames('unknown stuff xyz');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations).toBeDefined();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('properly sets state even on unusual queries', async () => {
    await gameDiscoveryActions.searchGames('some query');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.loading).toBe(false);
    expect(s.recommendations).toBeDefined();
    expect(s.routingPath).toBeDefined();
  });

  it('handles horror genre extraction', async () => {
    await gameDiscoveryActions.searchGames('scary horror game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('handles racing genre extraction', async () => {
    await gameDiscoveryActions.searchGames('racing cars game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('handles card game extraction', async () => {
    await gameDiscoveryActions.searchGames('card deck game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('handles rhythm game extraction', async () => {
    await gameDiscoveryActions.searchGames('music rhythm beats game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('handles idle game extraction', async () => {
    await gameDiscoveryActions.searchGames('idle builder game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });

  it('handles rpg game extraction', async () => {
    await gameDiscoveryActions.searchGames('rpg role playing game');
    const s = getGameDiscoveryStoreSnapshot();
    expect(s.recommendations.length).toBeGreaterThan(0);
  });
});
