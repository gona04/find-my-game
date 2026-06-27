import { render } from '@testing-library/react-native';
import { RecommendationCard } from '../../features/recommendations/components/recommendations-card.component';
import { Recommendation } from '../../services/recommendation.service';

const recommendation: Recommendation = {
  id: 'x',
  title: 'Test Game',
  genres: ['Puzzle'],
  mood: ['calm'],
  rewardPotential: 'high',
  rewardFrequency: 'medium',
  sessionLength: 'short',
  storyline: true,
  progression: 'medium',
  complexity: 'easy',
  description: 'Fun',
  imageUrl: require("../../../assets/icons/resized-images/pubg.jpg"),
  totalGems: 100,
  perTaskGems: 10,
  score: 12,
  matchReason: 'Matched on: Puzzle genre',
  whyRecommended: 'Similar adventure gameplay to your query with calm puzzle sessions.',
};

describe('RecommendationCard', () => {
  it('renders required fields', () => {
    const { getByText } = render(<RecommendationCard recommendation={recommendation} index={0} />);
    expect(getByText('Test Game')).toBeTruthy();
    expect(getByText('Match 12')).toBeTruthy();
    expect(getByText('Why this?')).toBeTruthy();
    expect(getByText(/Similar adventure gameplay to your query/)).toBeTruthy();
    expect(getByText(/high gem potential · medium frequency/)).toBeTruthy();
    expect(getByText(/Storyline: Yes/)).toBeTruthy();
    expect(getByText(/short sessions/)).toBeTruthy();
  });
});
