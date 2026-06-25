import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Recommendation } from '../../services/recommendationService';

type Props = { recommendation: Recommendation; index: number };

export const RecommendationCard = memo(({ recommendation, index }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  const { width } = useWindowDimensions();
  const GameIcon = recommendation.imageUrl;
  const iconSize = Math.min(140, Math.max(96, width * 0.32));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 260, delay: index * 90, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, delay: index * 90, useNativeDriver: true }),
    ]).start();
  }, [index, opacity, translateY]);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View style={styles.card}>
        <Text style={styles.title}>{recommendation.title}</Text>
        <View style={styles.image}>{GameIcon && <GameIcon width={iconSize} height={iconSize} />}</View>
        <View style={styles.scoreRow}>
          <Text style={styles.rewardText}>{recommendation.rewardPotential} rewards</Text>
          <Text style={styles.scoreText}>Match {recommendation.score}</Text>
        </View>
        <Text style={styles.description}>{recommendation.description}</Text>
        <Text style={styles.meta}>Storyline: {recommendation.storyline ? 'Yes' : 'No'} • {recommendation.sessionLength} sessions • {recommendation.rewardPotential} reward potential</Text>
        <View style={styles.rewardBadges}>{recommendation.rewardTypes.map((reward) => <Text key={reward} style={styles.rewardBadge}>{reward}</Text>)}</View>
        <Text style={styles.reasonLine}>{recommendation.matchReason}</Text>
        <View style={styles.tags}>
          <Text style={styles.tag}>{recommendation.genres.join(' • ')}</Text>
          <Text style={styles.tag}>{recommendation.sessionLength} sessions</Text>
          <Text style={styles.tag}>{recommendation.progression} progression</Text>
        </View>
        <Text style={styles.whyTitle}>Why we recommended this</Text>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  card: { padding: 15, borderRadius: 16, backgroundColor: '#F7F7FB', marginBottom: 18, overflow: 'hidden' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#050505', marginBottom: 10, textAlign: 'center' },
  image: { minHeight: 150, borderRadius: 12, marginBottom: 12, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  rewardText: { fontSize: 18, fontWeight: 'bold', color: '#050505' },
  scoreText: { fontSize: 15, fontWeight: 'bold', color: '#10B981' },
  description: { color: '#4B5563', lineHeight: 20, marginBottom: 10 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  tag: { backgroundColor: '#fff', color: '#050505', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, fontWeight: '700', overflow: 'hidden' },
  meta: { color: '#4B5563', fontWeight: '700', marginBottom: 8 },
  rewardBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  rewardBadge: { backgroundColor: '#E9FFD7', color: '#050505', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16, fontWeight: '800', overflow: 'hidden' },
  reasonLine: { color: '#4B5563', fontStyle: 'italic', marginBottom: 10 },
  whyTitle: { color: '#050505', fontWeight: 'bold', marginBottom: 6 },
});
