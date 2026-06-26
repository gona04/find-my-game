import { memo } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { fontSizes, spacingSize } from "../../theme/spacing";
import { colors } from "../../theme/colors";
import { Game } from "../../types/Game";

const DISCOVER_ARTWORK_HEIGHT = 160;

export const GameTile = memo(
  ({
    title,
    imageUrl,
    totalGems,
    perTaskGems,
  }: Game) => {
    return (
      <View style={styles.gameTile}>
        <Text numberOfLines={1} style={styles.gameTitle}>
          {title}
        </Text>
        <View style={styles.gameImage}>
          <Image
            source={imageUrl}
            style={styles.gameArtwork}
            resizeMode="cover"
          />
        </View>
        <View style={styles.gemStatsRow}>
          <Text style={styles.genStat}> {perTaskGems} 💎 </Text>
          <Text style={styles.genStat}>{totalGems} 💎</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  gameTile: {
    width: 210,
    borderRadius: spacingSize.ss_14,
    backgroundColor: colors.surface,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  gameTitle: {
    fontSize: fontSizes.fs_10,
    fontWeight: "bold",
    padding: spacingSize.ss_16,
    textAlign: "center",
  },
  gameImage: {
    width: "100%",
    height: DISCOVER_ARTWORK_HEIGHT,
    overflow: "hidden",
  },

  gameArtwork: {
    width: "100%",
    height: "100%",
  },
  gemStatsRow: {
    fontSize: fontSizes.fs_14,
    fontWeight: "600",
    paddingHorizontal: spacingSize.ss_14,
    paddingVertical: spacingSize.ss_10,
    color: colors.blackShadeOne,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  genStat: {
    fontSize: fontSizes.fs_14,
    fontWeight: "700",
    color: colors.blackShadeOne,
  },
    progressTrack: {
    height: 4,
    backgroundColor: colors.shadeOfWhiteOne,
    marginHorizontal: spacingSize.ss_14,
    marginBottom: spacingSize.ss_14,
    borderRadius: 4,
  },
  progressFill: {
    height: 4,
    width: "44%",
    backgroundColor: colors.blackShadeOne,
    borderRadius: 4,
  },
});
