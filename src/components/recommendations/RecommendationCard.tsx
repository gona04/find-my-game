import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { Recommendation } from '../../services/recommendationService';
import { Card } from '../common/Card';

type Props = { recommendation: Recommendation; index: number };
export const RecommendationCard = memo(({ recommendation, index }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;
  useEffect(() => { Animated.timing(opacity, { toValue: 1, duration: 260, delay: index * 90, useNativeDriver: true }).start(); Animated.spring(translateY, { toValue: 0, delay: index * 90, useNativeDriver: true }).start(); }, [index, opacity, translateY]);
  return <Animated.View style={{ opacity, transform: [{ translateY }] }}><Card style={styles.card}><View style={styles.row}><Text style={styles.title}>{recommendation.title}</Text><Text style={styles.score}>{recommendation.score}</Text></View><Text style={styles.desc}>{recommendation.description}</Text><View style={styles.meta}><Text style={styles.pill}>{recommendation.genres.join(' • ')}</Text><Text style={styles.pill}>{recommendation.sessionLength} sessions</Text><Text style={styles.pill}>{recommendation.rewardPotential} rewards</Text></View><Text style={styles.label}>Why we recommended this</Text>{recommendation.matchReason.map((reason) => <Text key={reason} style={styles.reason}>✓ {reason}</Text>)}</Card></Animated.View>;
});
const styles = StyleSheet.create({ card: { gap: spacing.sm, marginBottom: spacing.md }, row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }, title: { color: colors.textPrimary, fontSize: 20, fontWeight: '900', flex: 1 }, score: { color: colors.primary, fontWeight: '900', fontSize: 18 }, desc: { color: colors.textSecondary, lineHeight: 20 }, meta: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, pill: { backgroundColor: colors.primaryLight, color: colors.primary, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: spacing.borderRadius.md, fontWeight: '700', overflow: 'hidden' }, label: { color: colors.textPrimary, fontWeight: '900', marginTop: spacing.xs }, reason: { color: colors.success, fontWeight: '700' } });
