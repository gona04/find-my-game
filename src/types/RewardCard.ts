import { SvgProps } from "react-native-svg";

export type RewardCardProps = {
  icon: React.FC<SvgProps>;
  title: string;
  description: string;
  buttonText: string;
  color: string;
  onPress?: () => void;
};