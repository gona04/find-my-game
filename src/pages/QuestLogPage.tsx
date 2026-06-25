import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useMemo } from "react";
import { SvgProps } from "react-native-svg";
import CalendarIcon from "../../assets/icons/calendar.svg";
import RocketIcon from "../../assets/icons/rocket.svg";
import PeopleIcon from "../../assets/icons/people.svg";
import { games } from "../data/games";

const DISCOVER_ARTWORK_HEIGHT = 160;

type RewardCardProps = {
  icon: React.FC<SvgProps>;
  title: string;
  description: string;
  buttonText: string;
  color: string;
  onPress?: () => void;
};

const RewardCard = memo(
  ({
    icon: Icon,
    title,
    description,
    buttonText,
    color,
    onPress,
  }: RewardCardProps) => (
    <View style={[styles.rewardCard, { backgroundColor: color }]}>
      <View style={styles.rewardContent}>
        <View style={styles.rewardIconWrap}>
          <Icon width={40} height={40} />
        </View>
        <Text style={styles.rewardTitle}>{title}</Text>
        <Text style={styles.rewardSubtitle}>{description}</Text>
      </View>
      <TouchableOpacity style={styles.darkButton} onPress={onPress}>
        <Text style={styles.darkButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  ),
);

const GameTile = memo(
  ({
    title,
    imageUrl,
    totalGems,
    perTaskGems,
  }: {
    title: string;
    imageUrl: ImageSourcePropType;
    totalGems: number;
    perTaskGems: number;
  }) => {
    // const GameIcon = imageUrl;
    return (
      <View style={styles.gameTile}>
        <Text numberOfLines={1} style={styles.gameTitle}>
          {title}
        </Text>
        <View style={styles.gameImage}>
          {/* {GameIcon ? (
          <GameIcon width="100%" height={DISCOVER_ARTWORK_HEIGHT} preserveAspectRatio="xMidYMid slice" />
        ) : (
          <View style={styles.gameImagePlaceholder} />
        )} */}
          <Image
            source={imageUrl}
            style={styles.gameArtwork}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.gemStats}>
          ≈{totalGems} 💎 total | ≈{perTaskGems} per task
        </Text>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    );
  },
);

const WideGameCard = memo(
  ({ title, imageUrl }: { title: string; imageUrl: ImageSourcePropType }) => {
    const GameIcon = imageUrl;
    return (
      <View style={styles.wideCard}>
        <Text style={styles.wideTitle}>{title}</Text>
        <View style={styles.wideImage}>
          {/* {GameIcon ? (
          <GameIcon width="100%" height={DISCOVER_ARTWORK_HEIGHT} preserveAspectRatio="xMidYMid slice" />
        ) : (
          <View style={styles.wideImagePlaceholder} />
        )} */}
          <Image
            source={imageUrl}
            style={styles.wideImagePlaceholder}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Play and earn</Text>
        </TouchableOpacity>
      </View>
    );
  },
);

export const QuestLogPage = (): React.ReactElement => {
  const keepPlaying = useMemo(() => games.slice(0, 3), []);
  const recommendations = useMemo(() => games.slice(3, 6), []);
  const keepPlayingGems = [
    { total: 844, perTask: 203 },
    { total: 322, perTask: 81 },
    { total: 50762, perTask: 1204 },
  ];

  return (
    <View style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Quest Log</Text>
          <Text style={styles.gemCount}>1770 💎</Text>
        </View>

        <View style={styles.claimedBanner}>
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>✓</Text>
          </View>
          <Text style={styles.bannerTitle}>All done! Come back tomorrow!</Text>
          <Text style={styles.claimedText}>Claimed</Text>
        </View>

        <Text style={styles.sectionHeader}>Extra Rewards</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCards}
        >
          <RewardCard
            icon={CalendarIcon}
            title="Daily Streak"
            description="Get up to 4054 gems"
            buttonText="Claim streak"
            color="#FFD153"
          />
          <RewardCard
            icon={RocketIcon}
            title="2× Boost"
            description="2× gems on new games!"
            buttonText="Activate boost"
            color="#A8F66A"
          />
          <RewardCard
            icon={PeopleIcon}
            title="Invite Friends"
            description="And get bonus coins"
            buttonText="Invite now"
            color="#FF9DA8"
          />
        </ScrollView>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionHeader}>Keep Playing</Text>
          <Text style={styles.seeAll}>See All →</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCards}
        >
          {keepPlaying.map((game, index) => (
            <GameTile
              key={game.id}
              title={game.title}
              imageUrl={game.imageUrl}
              totalGems={keepPlayingGems[index].total}
              perTaskGems={keepPlayingGems[index].perTask}
            />
          ))}
        </ScrollView>

        <Text style={styles.sectionHeader}>Recommended For You</Text>
        {recommendations.map((game) => (
          <WideGameCard
            key={game.id}
            title={game.title}
            imageUrl={game.imageUrl}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  gameImage: {
    width: "100%",
    height: DISCOVER_ARTWORK_HEIGHT,
    overflow: "hidden",
  },

  gameArtwork: {
    width: "100%",
    height: "100%",
  },
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#050505" },
  gemCount: { fontSize: 22, fontWeight: "bold", color: "#050505" },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#050505",
  },
  claimedBanner: {
    backgroundColor: "#FFD153",
    borderRadius: 10,
    padding: 15,
    marginBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bannerBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#050505",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerBadgeText: { color: "#9EFF62", fontSize: 24, fontWeight: "bold" },
  bannerTitle: { flex: 1, fontSize: 16, fontWeight: "bold" },
  claimedText: { fontWeight: "bold", color: "#4B5563" },
  horizontalCards: { gap: 14, paddingBottom: 22 },
  rewardCard: {
    width: 190,
    height: 220,
    padding: 15,
    borderRadius: 16,
    justifyContent: "space-between",
  },
  rewardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rewardIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#050505",
    marginBottom: 6,
  },
  rewardSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#050505",
    lineHeight: 20,
  },
  darkButton: {
    backgroundColor: "#050505",
    padding: 12,
    alignItems: "center",
    borderRadius: 24,
  },
  darkButtonText: { color: "#fff", fontWeight: "bold" },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: { fontWeight: "bold", fontSize: 15 },
  gameTile: {
    width: 210,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8EF",
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  // gameImage: {
  //   height: DISCOVER_ARTWORK_HEIGHT,
  //   width: "100%",
  //   overflow: "hidden",
  // },
  gameImagePlaceholder: {
    height: DISCOVER_ARTWORK_HEIGHT,
    width: "100%",
    backgroundColor: "#E8E8E8",
  },
  gemStats: {
    fontSize: 14,
    fontWeight: "600",
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlign: "center",
    color: "#050505",
  },
  progressTrack: {
    height: 4,
    backgroundColor: "#D8D8E0",
    marginHorizontal: 14,
    marginBottom: 14,
    borderRadius: 4,
  },
  progressFill: {
    height: 4,
    width: "44%",
    backgroundColor: "#050505",
    borderRadius: 4,
  },
  wideCard: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E8E8EF",
  },
  wideTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
    textAlign: "center",
  },
  wideImage: {
    height: DISCOVER_ARTWORK_HEIGHT,
    width: "100%",
    overflow: "hidden",
  },
  wideImagePlaceholder: {
    height: DISCOVER_ARTWORK_HEIGHT,
    width: "100%",
    backgroundColor: "#E8E8E8",
  },
  button: {
    margin: 10,
    backgroundColor: "#F7F7FB",
    padding: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: { fontWeight: "bold" },
});
