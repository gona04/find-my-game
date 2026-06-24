import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text } from 'react-native';
import { colors } from '../../constants/colors';
import { Recommendation } from '../../services/recommendationService';
import { RecommendationCard } from './RecommendationCard';

type Props = { recommendations: Recommendation[] };
export const RecommendationList = memo(({ recommendations }: Props) => {
  const renderItem: ListRenderItem<Recommendation> = useCallback(({ item, index }) => <RecommendationCard recommendation={item} index={index} />, []);
  const keyExtractor = useCallback((item: Recommendation) => item.id, []);
  if (!recommendations.length) return <Text style={styles.empty}>Results will appear here with clear explanations.</Text>;
  return <FlatList data={recommendations} renderItem={renderItem} keyExtractor={keyExtractor} scrollEnabled={false} removeClippedSubviews initialNumToRender={5} />;
});
const styles = StyleSheet.create({ empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 20 } });
