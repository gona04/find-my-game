import { ImageSourcePropType } from 'react-native';

export type RewardPotential  = 'low' | 'medium' | 'high';
export type RewardFrequency  = 'low' | 'medium' | 'high';
export type Progression      = 'low' | 'medium' | 'high';
export type Complexity       = 'easy' | 'medium' | 'hard';
export type SessionLength    = 'short' | 'medium' | 'long';

export interface Game {
  id:              string;
  title:           string;
  genres:          string[];
  mood:            string[];
  rewardPotential: RewardPotential;
  rewardFrequency: RewardFrequency;
  sessionLength:   SessionLength;
  storyline:       boolean;
  progression:     Progression;
  complexity:      Complexity;
  description:     string;
  imageUrl:        ImageSourcePropType;
  totalGems:       number;
  perTaskGems:     number;
}

export type ExtractedPreferences = Partial<Pick<Game,
  | 'sessionLength'
  | 'rewardPotential'
  | 'rewardFrequency'
  | 'progression'
  | 'complexity'
  | 'storyline'
>> & {
  genres?: string[];
  mood?:   string[];
};

export type GameWithScore = Game & {
  score:           number;
  matchReason:     string;
  whyRecommended:  string;
};