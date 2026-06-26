import React, { memo, useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Text, View } from "react-native";
import { Recommendation } from "../../services/recommendationService";
import { Image } from "react-native";

type Props = { recommendation: Recommendation; index: number };

const ARTWORK_HEIGHT = 180;

export const RecommendationCard = memo(({ recommendation, index }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        delay: index * 90,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        delay: index * 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View style={styles.card}>
        <View style={styles.artworkContainer}>
          <Image
            source={recommendation.imageUrl}
            style={styles.artwork}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{recommendation.title}</Text>
            <Text style={styles.scoreBadge}>Match {recommendation.score}</Text>
          </View>

          <Text style={styles.gemLine}>
            💎 {recommendation.rewardPotential} gem potential ·{" "}
            {recommendation.rewardFrequency} frequency
          </Text>

          <Text style={styles.statsLine}>
            📖 Storyline: {recommendation.storyline ? "Yes" : "No"} ⏱{" "}
            {recommendation.sessionLength} sessions
          </Text>

          <View style={styles.divider} />

          <Text style={styles.whyLabel}>Why this?</Text>
          <Text style={styles.whyText}>{recommendation.whyRecommended}</Text>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
      default: {},
    }),
  },
  artworkContainer: {
    width: "100%",
    height: ARTWORK_HEIGHT,
    overflow: "hidden",
  },
  artwork: {
    width: "100%",
    height: ARTWORK_HEIGHT,
},
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    flex: 1,
    fontWeight: "700",
    fontSize: 16,
    color: "#1A1A2E",
    marginRight: 8,
  },
  scoreBadge: {
    color: "#6C63FF",
    fontWeight: "600",
    fontSize: 13,
  },
  gemLine: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
  },
  statsLine: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
  },
  whyLabel: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#6B7280",
    marginBottom: 2,
  },
  whyText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#6B7280",
    lineHeight: 18,
  },
});
