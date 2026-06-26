import { memo } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { RewardCardProps } from "../../../types/RewardCard";
import { spacingSize } from "../../../theme/spacing";

export const RewardCard = memo(
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

const styles = StyleSheet.create({
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
});
