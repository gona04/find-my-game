import { gameDiscoveryActions, getGameDiscoveryStoreSnapshot } from '../useGameDiscoveryStore';

jest.mock('../../services/llmService', () => ({
  extractPreferencesAndReasons: jest.fn(async () => ({
    preferences: { genres: ['RPG'] },
    reasons: { 'Genshin Impact': 'Why Genshin Impact fits you.' },
  })),
}));

describe('useGameDiscoveryStore actions', () => {
  it('initial state is correct', () => { const s=getGameDiscoveryStoreSnapshot(); expect(s.query).toBe(''); expect(s.loading).toBe(false); });
  it('setQuery updates query', () => { gameDiscoveryActions.setQuery('abc'); expect(getGameDiscoveryStoreSnapshot().query).toBe('abc'); });
  it('clearResults resets recommendations and error', () => { gameDiscoveryActions.clearResults(); expect(getGameDiscoveryStoreSnapshot().recommendations).toEqual([]); expect(getGameDiscoveryStoreSnapshot().error).toBeNull(); });
  it('searchGames sets loading to true then false', async () => { const p=gameDiscoveryActions.searchGames('story game'); expect(getGameDiscoveryStoreSnapshot().loading).toBe(true); await p; expect(getGameDiscoveryStoreSnapshot().loading).toBe(false); });
  it('searchGames with empty query sets error message', async () => { await gameDiscoveryActions.searchGames(''); expect(getGameDiscoveryStoreSnapshot().error).toContain('Tell us'); });
  it('routingPath is keyword when keywords matched', async () => { await gameDiscoveryActions.searchGames('story game'); expect(getGameDiscoveryStoreSnapshot().routingPath).toBe('keyword'); });
  it('routingPath is llm when no keywords matched', async () => { await gameDiscoveryActions.searchGames('zzzz'); expect(getGameDiscoveryStoreSnapshot().routingPath).toBe('llm'); });
});
