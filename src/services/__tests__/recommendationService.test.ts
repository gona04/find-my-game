import { getRecommendations } from '../recommendationService';

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
  it('falls back to matchReason when no LLM reason', () => {
    const [first] = getRecommendations({ genres:['RPG'] }, {});
    expect(first.whyRecommended).toBe(first.matchReason);
  });
  it('empty preferences returns top 5', () => expect(getRecommendations({})).toHaveLength(5));
});
