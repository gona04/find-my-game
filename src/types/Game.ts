import React from "react";
import { SvgProps } from "react-native-svg";

export type RewardPotential = 'low' | 'medium' | 'high';
export type RewardFrequency = 'low' | 'medium' | 'high';
export type Progression = 'low' | 'medium' | 'high';
export type Complexity = 'easy' | 'medium' | 'hard';
export type SessionLength = 'short' | 'medium' | 'long';
export type RewardType =
  | "Cash"
  | "Amazon Coupon"
  | "Movie Ticket"
  | "Mall Discount"
  | "Gift Card"
  | "PayPal"
  | "Google Play Credit"
  | "App Store Credit";

export interface Game {
  id: string;
  title: string;
  genres: string[];
  mood: string[];
  rewardPotential: RewardPotential;
  rewardFrequency: RewardFrequency;
  sessionLength: SessionLength;
  storyline: boolean;
  progression: Progression;
  complexity: Complexity;
  description: string;
  rewardTypes: RewardType[];
  imageUrl: React.FC<SvgProps>;
}
