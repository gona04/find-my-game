import { RewardCardProps } from "../types/RewardCard";

import CalendarIcon from "../../assets/icons/calendar.svg";
import RocketIcon from "../../assets/icons/rocket.svg";
import PeopleIcon from "../../assets/icons/people.svg";
import { colors } from "../theme/colors";

  export const rewardCards: RewardCardProps[] = [
    {
      title: "Daily Streak",
      icon: CalendarIcon,
      description: "Get up to 4054 gems",
      buttonText: "Claim streak",
      color: colors.yellow,
    },
    {
      icon: RocketIcon,
      title: "2× Boost",
      description: "2× gems on new games!",
      buttonText: "Activate boost",
      color: colors.green,
    },
    {
      icon: PeopleIcon,
      title: "Invite Friends",
      description: "And get bonus coins",
      buttonText: "Invite now",
      color: colors.pink,
    },
  ];