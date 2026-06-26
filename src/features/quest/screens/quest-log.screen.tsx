import React, { useMemo } from "react";
import { games } from "../../../data/games";
import { GameTile } from "../../../features/games/components/game-tile.component";
import { WideGameCard } from "../../../features/quest/components/wide-game-card.component";
import { RewardCard } from "../../../features/quest/components/reward-card.component";
import { rewardCards } from "../../../data/rewardCard";
import { Header, AppScreen } from "../../../shared/components/layout";
import { BannerCard, HorizontalScroll, SectionHeading, CardList } from "../../../shared/components/common";
import { colors } from "../../../theme/colors";
import { Text } from "react-native";

export function QuestLogScreen(): React.ReactElement {
  const keepPlaying = useMemo(() => games.slice(0, 3), []);
  const recommendations = useMemo(() => games.slice(3, 6), []);

  return (
    <AppScreen>

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
}
