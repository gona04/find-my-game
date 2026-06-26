import { memo } from "react";
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { fontSizes, spacingSize } from "../../../theme/spacing";
import { colors } from "../../../theme/colors";

const DISCOVER_ARTWORK_HEIGHT = 160;
export const WideGameCard = memo(
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
    return (
      <View style={styles.wideCard}>
        <Text style={styles.wideTitle}>{title}</Text>
        <View style={styles.wideImage}>
          <Image
            source={imageUrl}
            style={styles.wideImagePlaceholder}
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Play and earn</Text>
          <View>
            <Text>
              ≈{totalGems} 💎 total | ≈{perTaskGems} per task
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wideCard: {
    borderRadius: spacingSize.ss_16,
    backgroundColor: colors.surface,
    marginBottom: spacingSize.ss_20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.shadeOfWhiteTwo,
  },
  wideTitle: {
    fontSize: fontSizes.fs_18,
    fontWeight: "bold",
    padding: spacingSize.ss_10,
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
    backgroundColor: colors.shadeOfWhiteTwo,
  },
  button: {
    margin: spacingSize.ss_10,
    backgroundColor: colors.shareOfWhiteThree,
    padding: spacingSize.ss_8,
    alignItems: "center",
    borderRadius: spacingSize.ss_8,
  },
  buttonText: { fontWeight: "bold" },
});
