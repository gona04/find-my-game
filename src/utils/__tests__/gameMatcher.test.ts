import { extractKeywords, getPreferenceScore, FIELD_WEIGHTS, CONFIDENCE_THRESHOLD } from '../gameMatcher';
import { GamePreferences } from '../gameMatcher';
import type { SessionLength, Complexity, RewardPotential, Progression } from '../../types/Game';

describe('extractKeywords', () => {
  it('extracts storyline', () => expect(extractKeywords('I want a story game').storyline).toBe(true));
  it('extracts relaxing mood', () => expect(extractKeywords('something relaxing').mood).toContain('calm'));
  it('extracts high reward potential from gems query', () => expect(extractKeywords('I want lots of gems').rewardPotential).toBe('high'));
  it('extracts short sessions', () => expect(extractKeywords('quick 10 minute game').sessionLength).toBe('short'));
  it('extracts competitive mood', () => expect(extractKeywords('I want to fight competitively').mood).toContain('competitive'));
  it('routes exact prince of persia to LLM path', () => expect(extractKeywords('prince of persia').matchedFields).toBe(0));
  it('handles empty string', () => expect(extractKeywords('').matchedFields).toBe(0));
});

describe('FIELD_WEIGHTS', () => {
  it('genres weight is 2', () => expect(FIELD_WEIGHTS.genres).toBe(2));
  it('mood weight is 2', () => expect(FIELD_WEIGHTS.mood).toBe(2));
  it('all other field weights are 1', () => {
    expect(FIELD_WEIGHTS.sessionLength).toBe(1);
    expect(FIELD_WEIGHTS.rewardPotential).toBe(1);
    expect(FIELD_WEIGHTS.rewardFrequency).toBe(1);
    expect(FIELD_WEIGHTS.progression).toBe(1);
    expect(FIELD_WEIGHTS.complexity).toBe(1);
    expect(FIELD_WEIGHTS.storyline).toBe(1);
  });
});

describe('CONFIDENCE_THRESHOLD', () => {
  it('is 4', () => expect(CONFIDENCE_THRESHOLD).toBe(4));
});

describe('getPreferenceScore', () => {
  describe('Example 1: "I want a relaxing idle builder"', () => {
    it('returns score 5 (>= CONFIDENCE_THRESHOLD): genres +2, mood +2, sessionLength +1', () => {
      const prefs: GamePreferences = {
        genres: ['Idle', 'Builder'],
        mood: ['calm'],
        sessionLength: 'long' as SessionLength,
      };
      expect(getPreferenceScore(prefs)).toBe(5);
      expect(getPreferenceScore(prefs)).toBeGreaterThanOrEqual(CONFIDENCE_THRESHOLD);
    });
  });

  describe('Example 2: "I want something like Money Island"', () => {
    it('returns score 0 (< CONFIDENCE_THRESHOLD): no recognized preferences', () => {
      const prefs = {
        genres: undefined,
        mood: undefined,
      };
      expect(getPreferenceScore(prefs)).toBe(0);
      expect(getPreferenceScore(prefs)).toBeLessThan(CONFIDENCE_THRESHOLD);
    });
  });

  describe('Example 3: "something quick and easy"', () => {
    it('returns score 2 (< CONFIDENCE_THRESHOLD): sessionLength +1, complexity +1', () => {
      const prefs: GamePreferences = {
        sessionLength: 'short' as SessionLength,
        complexity: 'easy' as Complexity,
      };
      expect(getPreferenceScore(prefs)).toBe(2);
      expect(getPreferenceScore(prefs)).toBeLessThan(CONFIDENCE_THRESHOLD);
    });
  });

  describe('Example 4: "quick puzzle game, low effort"', () => {
    it('returns score 4 (>= CONFIDENCE_THRESHOLD): genres +2, sessionLength +1, complexity +1', () => {
      const prefs: GamePreferences = {
        genres: ['Puzzle'],
        sessionLength: 'short' as SessionLength,
        complexity: 'easy' as Complexity,
      };
      expect(getPreferenceScore(prefs)).toBe(4);
      expect(getPreferenceScore(prefs)).toBeGreaterThanOrEqual(CONFIDENCE_THRESHOLD);
    });
  });

  describe('Edge cases', () => {
    it('returns 2 when genres is empty array but mood is present', () => {
      const prefs = {
        genres: [],
        mood: ['calm'],
      };
      expect(getPreferenceScore(prefs)).toBe(2);
      expect(getPreferenceScore(prefs)).toBeLessThan(CONFIDENCE_THRESHOLD);
    });

    it('returns 2 when mood is empty array but genres is present', () => {
      const prefs = {
        genres: ['RPG'],
        mood: [],
      };
      expect(getPreferenceScore(prefs)).toBe(2);
      expect(getPreferenceScore(prefs)).toBeLessThan(CONFIDENCE_THRESHOLD);
    });

    it('returns 4 when exactly at threshold', () => {
      const prefs = {
        genres: ['Adventure'],
        mood: ['competitive'],
      };
      // genres: +2, mood: +2 = 4
      expect(getPreferenceScore(prefs)).toBe(4);
      expect(getPreferenceScore(prefs)).toBeGreaterThanOrEqual(CONFIDENCE_THRESHOLD);
    });

    it('returns 3 when just below threshold', () => {
      const prefs2: GamePreferences = {
        genres: ['Adventure'],
        sessionLength: 'short' as SessionLength,
        complexity: undefined,
      };
      // genres: +2, sessionLength: +1 = 3
      expect(getPreferenceScore(prefs2)).toBe(3);
      expect(getPreferenceScore(prefs2)).toBeLessThan(CONFIDENCE_THRESHOLD);
    });

    it('accumulates weights from multiple non-array fields', () => {
      const prefs: GamePreferences = {
        sessionLength: 'short' as SessionLength,
        complexity: 'easy' as Complexity,
        progression: 'linear' as Progression,
        rewardPotential: 'high' as RewardPotential,
      };
      // total: 1 + 1 + 1 + 1 = 4
      expect(getPreferenceScore(prefs)).toBe(4);
      expect(getPreferenceScore(prefs)).toBeGreaterThanOrEqual(CONFIDENCE_THRESHOLD);
    });

    it('calculates score purely from prefs, independent of query', () => {
      const prefs: GamePreferences = {
        genres: ['Puzzle'],
        sessionLength: 'short' as SessionLength,
        complexity: 'easy' as Complexity,
      };
      expect(getPreferenceScore(prefs)).toBe(4);
    });
  });
});
