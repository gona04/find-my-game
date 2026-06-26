import React, { useMemo } from "react";
import { games } from "../data/games";
import { GameTile } from "../components/games/game-title.component";
import { WideGameCard } from "../components/wildCard/wild-card.component";
import { RewardCard } from "../components/rewards/reward-card.component";
import { rewardCards } from "../data/rewardCard";
import { Header } from "../components/layout/header.component";
import {
  BannerCard,
} from "../components/common/banner-card.component";
import { HorizontalScroll } from "../components/common/horizontal-scope.component";
import { AppScreen } from "../components/layout/app-screen.component";
import { SectionHeading } from "../components/common/section-heading.component";
import { CardList } from "../components/common/card-list.component";
import { colors } from "../theme/colors";
import { Text } from "react-native";

export const QuestLogPage = (): React.ReactElement => {
  const keepPlaying = useMemo(() => games.slice(0, 3), []);
  const recommendations = useMemo(() => games.slice(3, 6), []);

  return (
    <AppScreen>
      <Header title="Quest Log" />

      <BannerCard
        backgroundColor={colors.yellow}
        icon={<Text style={{ color: colors.green, fontSize: 28 }}>✓</Text>}
        title="All done! Come back tomorrow!"
        subtitle="Claimed"
      />

      <SectionHeading title="Extra Rewards" />
      <HorizontalScroll data={rewardCards} Component={RewardCard} />

      <SectionHeading title="Keep Playing" actionText="See All →" />
      <HorizontalScroll data={keepPlaying} Component={GameTile} />

      <SectionHeading title="Recommended For You" />
      <CardList data={recommendations} Component={WideGameCard} />
    </AppScreen>
  );
};
