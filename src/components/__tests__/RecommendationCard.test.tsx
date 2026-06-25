import React from 'react';
import { render } from '@testing-library/react-native';
import { RecommendationCard } from '../recommendations/RecommendationCard';
import { Recommendation } from '../../services/recommendationService';

const Icon = () => null;
const recommendation: Recommendation = { id:'x', title:'Test Game', genres:['Puzzle'], mood:['calm'], rewardPotential:'high', rewardFrequency:'medium', sessionLength:'short', storyline:true, progression:'medium', complexity:'easy', description:'Fun', rewardTypes:['Amazon Coupon','Movie Ticket'], imageUrl:Icon, score:12, matchReason:'Matched on: Puzzle genre' };

describe('RecommendationCard', () => {
  it('renders required fields', () => { const { getByText }=render(<RecommendationCard recommendation={recommendation} index={0} />); expect(getByText('Test Game')).toBeTruthy(); expect(getByText('Match 12')).toBeTruthy(); expect(getByText('Matched on: Puzzle genre')).toBeTruthy(); expect(getByText('Amazon Coupon')).toBeTruthy(); expect(getByText('Movie Ticket')).toBeTruthy(); expect(getByText(/Storyline: Yes/)).toBeTruthy(); expect(getByText(/short sessions/)).toBeTruthy(); expect(getByText(/high reward potential/)).toBeTruthy(); });
});
