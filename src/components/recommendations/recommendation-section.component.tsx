import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Recommendation } from '../../services/recommendationService';
import { RecommendationList } from './recomendations-list.component';
import { colors } from '../../theme/colors';
import { spacingSize, fontSizes } from '../../theme/spacing';

type Props = {
  recommendations: Recommendation[];
};

/**
 * **RecommendationSection**
 * Composite component that renders either:
 * - RecommendationList (if results exist)
 * - EmptyState (if empty)
 *
 * Extracted to: single component that owns the branching logic
 * and empty-state styling.
 *
 * Benefits:
 * - Parent no longer needs ternary for empty state
 * - Empty state styles are co-located with component
 * - Easy to swap recommendation rendering (e.g., grid → carousel)
 */
export const RecommendationSection = memo(({ recommendations }: Props) => {
  if (!recommendations.length) {
    return (
      <View style={styles.emptyContainer}>
        <Image source={require('../../../assets/icons/resized-images/empty-state.png')} style={styles.emptyImage} />
        <Text style={styles.emptyTitle}>Personalized picks will appear here</Text>
        <Text style={styles.emptyText}>Search by mood, rewards, genre, or time to get explainable matches.</Text>
      </View>
    );
  }

  return <RecommendationList recommendations={recommendations} />;
});

const styles = StyleSheet.create({
  emptyContainer: {
    padding: spacingSize.ss_15,
    borderRadius: spacingSize.ss_16,
    backgroundColor: colors.yellow,
    marginTop: spacingSize.ss_4,
  },
  emptyImage: {
    height: 130,
    borderRadius: spacingSize.ss_12,
    marginBottom: spacingSize.ss_12,
  },
  emptyTitle: {
    fontSize: fontSizes.fs_18,
    fontWeight: '700',
    color: colors.blackShadeOne,
  },
  emptyText: {
    marginTop: spacingSize.ss_4,
    color: colors.grey,
    fontSize: fontSizes.fs_14,
    lineHeight: 20,
  },
});
