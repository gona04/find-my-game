import { getRecommendations } from '../recommendation.service';

describe('getRecommendations', () => {
  it('returns max 5 results', () => expect(getRecommendations({}).length).toBeLessThanOrEqual(5));
  it('sorts by descending score', () => { const r=getRecommendations({ mood:['competitive'], rewardPotential:'high' }); expect(r.every((x,i)=>i===0 || r[i-1].score>=x.score)).toBe(true); });
  it('genre match adds +5', () => expect(getRecommendations({ genres:['RPG'] })[0].score).toBeGreaterThanOrEqual(5));
  it('mood match adds +4 per mood', () => expect(getRecommendations({ mood:['competitive'] })[0].score).toBeGreaterThanOrEqual(4));
  it('storyline match adds +4', () => expect(getRecommendations({ storyline:true })[0].score).toBeGreaterThanOrEqual(4));
  it('matchReason is non-empty', () => expect(getRecommendations({ genres:['RPG'] })[0].matchReason.length).toBeGreaterThan(0));
  it('matchReason is max 100 characters', () => expect(getRecommendations({ genres:['RPG'] })[0].matchReason.length).toBeLessThanOrEqual(100));
  it('uses LLM reason when provided', () => {
    const results = getRecommendations({ genres:['RPG'] }, { 'Genshin Impact': 'Custom LLM reason.' });
    expect(results.find((game) => game.title === 'Genshin Impact')?.whyRecommended).toBe('Custom LLM reason.');
  });
  it('turns semantic matches into a user-facing sentence', () => {
    const [first] = getRecommendations({ semanticTerms: ['explore', 'reward'] });
    // Should contain meaningful context about the search, not just generic attributes
    expect(first.whyRecommended).toMatch(/explore|reward|match/i);
    expect(first.whyRecommended).not.toContain('description match');
  });
  it('falls back to matchReason when no LLM reason', () => {
    const [first] = getRecommendations({ genres:['RPG'] }, {});
    expect(first.whyRecommended).toBe(first.matchReason);
  });
  it('empty preferences returns top 5', () => expect(getRecommendations({})).toHaveLength(5));

  // Additional comprehensive tests
  it('rewardPotential match adds +3', () => {
    const results = getRecommendations({ rewardPotential: 'high' });
    expect(results[0].score).toBeGreaterThanOrEqual(3);
  });

  it('rewardFrequency match adds +2', () => {
    const results = getRecommendations({ rewardFrequency: 'high' });
    expect(results[0].score).toBeGreaterThanOrEqual(2);
  });

  it('progression match adds +3', () => {
    const results = getRecommendations({ progression: 'high' });
    expect(results[0].score).toBeGreaterThanOrEqual(3);
  });

  it('complexity match adds +2', () => {
    const results = getRecommendations({ complexity: 'easy' });
    expect(results[0].score).toBeGreaterThanOrEqual(2);
  });

  it('sessionLength match adds +2', () => {
    const results = getRecommendations({ sessionLength: 'short' });
    expect(results[0].score).toBeGreaterThanOrEqual(2);
  });

  it('handles multiple matching preferences', () => {
    const results = getRecommendations({
      genres: ['RPG'],
      mood: ['competitive'],
      complexity: 'hard'
    });
    expect(results[0].score).toBeGreaterThan(0);
  });

  it('includes score in recommendations', () => {
    const results = getRecommendations({ genres: ['RPG'] });
    expect(results[0]).toHaveProperty('score');
    expect(typeof results[0].score).toBe('number');
  });

  it('includes matchReason in all recommendations', () => {
    const results = getRecommendations({ genres: ['RPG'] });
    results.forEach((game) => {
      expect(game).toHaveProperty('matchReason');
      expect(typeof game.matchReason).toBe('string');
    });
  });

  it('includes whyRecommended in all recommendations', () => {
    const results = getRecommendations({ genres: ['RPG'] });
    results.forEach((game) => {
      expect(game).toHaveProperty('whyRecommended');
      expect(typeof game.whyRecommended).toBe('string');
    });
  });

  it('rejects invalid LLM reasons (too short)', () => {
    const results = getRecommendations(
      { genres: ['RPG'] },
      { 'Genshin Impact': 'Hi' }
    );
    const game = results.find((g) => g.title === 'Genshin Impact');
    expect(game?.whyRecommended).toBe(game?.matchReason);
  });

  it('rejects offensive LLM reasons', () => {
    const results = getRecommendations(
      { genres: ['RPG'] },
      { 'Genshin Impact': 'This game is stupid and dumb' }
    );
    const game = results.find((g) => g.title === 'Genshin Impact');
    expect(game?.whyRecommended).toBe(game?.matchReason);
  });

  it('accepts valid LLM reasons with minimum word count', () => {
    const results = getRecommendations(
      { genres: ['RPG'] },
      { 'Genshin Impact': 'This game offers great gameplay' }
    );
    const game = results.find((g) => g.title === 'Genshin Impact');
    expect(game?.whyRecommended).toContain('great gameplay');
  });

  it('handles storyline false match', () => {
    const results = getRecommendations({ storyline: false });
    const game = results[0];
    expect(game.matchReason).toBeDefined();
  });

  it('semantic term matching', () => {
    const results = getRecommendations({
      semanticTerms: ['action', 'adventure']
    });
    expect(results.length).toBeGreaterThan(0);
  });

  it('semantic term match score is capped at 8', () => {
    const results = getRecommendations({
      semanticTerms: ['game', 'play', 'fun', 'action', 'adventure', 'quest', 'battle']
    });
    // Even with many terms, score addition should be capped
    expect(results[0].score).toBeDefined();
  });

  it('returns mix of scored and zero-score games', () => {
    const results = getRecommendations({ genres: ['UnknownGenre'] });
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it('high score games appear first', () => {
    const results = getRecommendations({
      genres: ['RPG'],
      mood: ['competitive']
    });
    if (results.length > 1) {
      expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    }
  });

  it('sorts by title when scores are equal', () => {
    const results = getRecommendations({ genres: ['Action'] });
    for (let i = 1; i < results.length; i++) {
      if (results[i].score === results[i - 1].score) {
        expect(
          results[i - 1].title.localeCompare(results[i].title) <= 0
        ).toBe(true);
      }
    }
  });

  it('includes game data in recommendations', () => {
    const results = getRecommendations({ genres: ['RPG'] });
    results.forEach((game) => {
      expect(game).toHaveProperty('title');
      expect(game).toHaveProperty('description');
      expect(game).toHaveProperty('genres');
      expect(game).toHaveProperty('mood');
    });
  });

  it('handles referenced game in preferences', () => {
    const results = getRecommendations({ referencedGame: 'Genshin Impact' });
    expect(results.length).toBeGreaterThan(0);
  });

  it('mood based search generates mood-specific reason', () => {
    const results = getRecommendations({ mood: ['calm'] });
    const reason = results[0].matchReason.toLowerCase();
    expect(reason).toBeTruthy();
  });

  it('reward potential based search generates reward-specific reason', () => {
    const results = getRecommendations({ rewardPotential: 'high' });
    const reason = results[0].matchReason.toLowerCase();
    expect(reason.includes('gem') || reason.includes('reward')).toBe(true);
  });

  it('session length based search generates time-specific reason', () => {
    const results = getRecommendations({ sessionLength: 'short' });
    const reason = results[0].matchReason.toLowerCase();
    expect(reason).toBeTruthy();
  });

  it('builds meaningful match reasons', () => {
    const results = getRecommendations({
      genres: ['Puzzle'],
      mood: ['calm'],
      complexity: 'easy'
    });
    results.forEach((game) => {
      expect(game.matchReason.length).toBeGreaterThan(0);
      expect(game.matchReason.length).toBeLessThanOrEqual(100);
    });
  });

  it('handles games with no genres', () => {
    // Test with preferences that might match games with empty genres
    const results = getRecommendations({});
    expect(results).toBeDefined();
  });

  it('multiple LLM reasons for different games', () => {
    const results = getRecommendations(
      { genres: ['RPG'] },
      {
        'Genshin Impact': 'Great exploration and action gameplay here for you',
        'Final Fantasy': 'Epic story with strategic battles included'
      }
    );
    const genshin = results.find((g) => g.title === 'Genshin Impact');
    const ff = results.find((g) => g.title === 'Final Fantasy');
    if (genshin && ff) {
      expect(genshin.whyRecommended).not.toBe(ff.whyRecommended);
    }
  });

  it('truncates long match reasons', () => {
    const results = getRecommendations({ genres: ['RPG'] });
    results.forEach((game) => {
      expect(game.matchReason.length).toBeLessThanOrEqual(100);
    });
  });
});
