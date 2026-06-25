import { extractKeywords } from '../gameMatcher';

describe('extractKeywords', () => {
  it('extracts storyline', () => expect(extractKeywords('I want a story game').storyline).toBe(true));
  it('extracts relaxing mood', () => expect(extractKeywords('something relaxing').mood).toContain('calm'));
  it('extracts amazon rewards', () => expect(extractKeywords('I want amazon rewards').rewardTypes).toContain('Amazon Coupon'));
  it('extracts short sessions', () => expect(extractKeywords('quick 10 minute game').sessionLength).toBe('short'));
  it('extracts competitive mood', () => expect(extractKeywords('I want to fight competitively').mood).toContain('competitive'));
  it('routes exact prince of persia to LLM path', () => expect(extractKeywords('prince of persia').matchedFields).toBe(0));
  it('handles empty string', () => expect(extractKeywords('').matchedFields).toBe(0));
});
