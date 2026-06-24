export type RewardLevel = "low" | "medium" | "high";
export type SessionLength = "short" | "medium" | "long";
export type ProgressionLevel = "low" | "medium" | "high";
export type ComplexityLevel = "low" | "medium" | "high";

export type Game = {
  title: string;
  genres: string[];
  mood: string[];
  rewardPotential: RewardLevel;
  rewardFrequency: RewardLevel;
  sessionLength: SessionLength;
  storyline: boolean;
  progression: ProgressionLevel;
  complexity: ComplexityLevel;
};

export type GameWithScore = Game & {
  score: number;
  matchReason: string;
};

export type ExtractedPreferences = {
  genres?: string[];
  mood?: string[];
  rewardPotential?: RewardLevel;
  rewardFrequency?: RewardLevel;
  sessionLength?: SessionLength;
  storyline?: boolean;
  progression?: ProgressionLevel;
  complexity?: ComplexityLevel;
};
