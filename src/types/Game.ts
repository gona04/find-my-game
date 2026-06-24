export type RewardPotential = 'low' | 'medium' | 'high';
export type RewardFrequency = 'low' | 'medium' | 'high';
export type Progression = 'low' | 'medium' | 'high';
export type Complexity = 'easy' | 'medium' | 'hard';
export type SessionLength = 'short' | 'medium' | 'long';

export interface Game {
  id: string;
  title: string;
  genres: string[];
  mood: string[];
  sessionLength: SessionLength;
  rewardPotential: RewardPotential;
  rewardFrequency: RewardFrequency;
  progression: Progression;
  complexity: Complexity;
  storyline: boolean;
  description: string;
}
