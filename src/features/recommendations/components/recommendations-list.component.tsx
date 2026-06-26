import React, { memo, useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text } from 'react-native';
import { Recommendation } from '../../../services/recommendationService';
import { RecommendationCard } from './recommendations-card.component';

type Props = { recommendations: Recommendation[] };

export const RecommendationList = memo(({ recommendations }: Props) => {
  const renderItem: ListRenderItem<Recommendation> = useCallback(({ item, index }) => (
    <RecommendationCard recommendation={item} index={index} />
  ), []);
  const keyExtractor = useCallback((item: Recommendation) => item.id, []);

  if (!recommendations.length) return <Text style={styles.empty}>Search to unlock reward-friendly game matches.</Text>;

  return (
    <FlatList data={recommendations} renderItem={renderItem} keyExtractor={keyExtractor} scrollEnabled={false} removeClippedSubviews initialNumToRender={5} />
  );
});

const styles = StyleSheet.create({
  empty: { color: '#6B7280', textAlign: 'center', marginTop: 4, marginBottom: 16, fontWeight: '700' },
});
