import { View, Text, StyleSheet } from "react-native";
import { spacingSize } from "../../theme/spacing";
import { colors } from "../../theme/colors";

export const ClaimedBanner = () => {
  return (
    <View style={styles.claimedBanner}>
      <View style={styles.bannerBadge}>
        <Text style={styles.bannerBadgeText}>✓</Text>
      </View>
      <Text style={styles.bannerTitle}>All done! Come back tomorrow!</Text>
      <Text style={styles.claimedText}>Claimed</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  claimedBanner: {
    backgroundColor: colors.yellow,
    borderRadius: spacingSize.ss_10,
    padding: spacingSize.ss_15,
    marginBottom: spacingSize.ss_24,
    flexDirection: "row",
    alignItems: "center",
    gap: spacingSize.ss_10,
  },
  bannerBadge: {
    width: 48,
    height: 48,
    borderRadius: spacingSize.ss_24,
    backgroundColor: colors.blackShadeOne,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerBadgeText: {
    color: colors.green,
    fontSize: spacingSize.ss_24,
    fontWeight: "bold",
  },
  bannerTitle: { flex: 1, fontSize: 16, fontWeight: "bold" },
  claimedText: { fontWeight: "bold", color: colors.grey },
});
