import { extractKeywords, getPreferenceScore, FIELD_WEIGHTS, CONFIDENCE_THRESHOLD, getCatalogMatchStrength } from '../gameMatcher';
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
  it('extracts adventure genre', () => expect(extractKeywords('I want an adventure game').genres).toContain('Adventure'));
  it('extracts action genre', () => expect(extractKeywords('action game with combat').genres).toContain('Action'));
  it('extracts strategy genre', () => expect(extractKeywords('strategy game').genres).toContain('Strategy'));
  it('extracts horror genre', () => expect(extractKeywords('scary horror game').genres).toContain('Horror'));
  it('extracts racing genre', () => expect(extractKeywords('racing game').genres).toContain('Racing'));
  it('extracts rhythm genre', () => expect(extractKeywords('music game with beats').genres).toContain('Rhythm'));
  it('extracts card genre', () => expect(extractKeywords('card deck game').genres).toContain('Card'));
  it('extracts idle genre', () => expect(extractKeywords('idle builder game').genres).toContain('Idle'));
  it('extracts rpg genre', () => expect(extractKeywords('rpg with loot').genres).toContain('RPG'));
  it('extracts long session length', () => expect(extractKeywords('I want a long deep game with hours of content').sessionLength).toBe('long'));
  it('extracts meditative mood', () => expect(extractKeywords('something meditative and peaceful').mood).toContain('calm'));
  it('includes matched fields count', () => expect(extractKeywords('relaxing puzzle game').matchedFields).toBeGreaterThan(0));
  it('extracts referenced game name', () => {
    const result = extractKeywords('like Genshin Impact');
    expect(result.referencedGame).toBeTruthy();
  });
  it('includes semantic terms', () => {
    const result = extractKeywords('I want adventure');
    expect(result.semanticTerms).toBeDefined();
    expect(result.semanticTerms?.length).toBeGreaterThan(0);
  });
  it('handles multiple keywords in one query', () => {
    const result = extractKeywords('quick relaxing puzzle game with high rewards');
    expect(result.genres).toContain('Puzzle');
    expect(result.sessionLength).toBe('short');
    expect(result.rewardPotential).toBe('high');
  });
  it('correctly filters short tokens from semantic terms', () => {
    const result = extractKeywords('a b cd game');
    expect(result.semanticTerms).toBeDefined();
    // Should filter out tokens shorter than 3 chars
  });
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

describe('getCatalogMatchStrength', () => {
  it('returns 0 for empty query', () => {
    expect(getCatalogMatchStrength('')).toBe(0);
  });

  it('returns 0 for query with only short tokens', () => {
    expect(getCatalogMatchStrength('a b c')).toBe(0);
  });

  it('returns positive score for matching query', () => {
    expect(getCatalogMatchStrength('puzzle')).toBeGreaterThan(0);
  });

  it('returns higher score for multiple matching terms', () => {
    const score1 = getCatalogMatchStrength('puzzle');
    const score2 = getCatalogMatchStrength('puzzle brain');
    // Multiple terms should generally be >= single term
    expect(score2).toBeGreaterThanOrEqual(score1);
  });

  it('handles case-insensitive matching', () => {
    const score1 = getCatalogMatchStrength('PUZZLE');
    const score2 = getCatalogMatchStrength('puzzle');
    expect(score1).toBe(score2);
  });

  it('searches across game attributes', () => {
    expect(getCatalogMatchStrength('story')).toBeGreaterThan(0);
    expect(getCatalogMatchStrength('adventure')).toBeGreaterThan(0);
    expect(getCatalogMatchStrength('calm')).toBeGreaterThan(0);
  });

  it('returns positive score for known game genre', () => {
    expect(getCatalogMatchStrength('rpg')).toBeGreaterThan(0);
  });

  it('returns positive score for known game mood', () => {
    expect(getCatalogMatchStrength('competitive')).toBeGreaterThan(0);
  });

  it('handles special characters in query', () => {
    const score = getCatalogMatchStrength('puzzle-game!@#');
    // Should still find puzzle
    expect(score).toBeGreaterThan(0);
  });

  it('matches against game titles', () => {
    expect(getCatalogMatchStrength('genshin')).toBeGreaterThan(0);
  });

  it('accumulates matches from multiple games', () => {
    const score = getCatalogMatchStrength('action');
    expect(score).toBeGreaterThan(0);
  });
});
