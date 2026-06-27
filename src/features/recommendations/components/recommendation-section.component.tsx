import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Recommendation } from '../../../services/recommendation.service';
import { RecommendationList } from './recommendations-list.component';
import { colors } from '../../../theme/colors';
import { spacingSize, fontSizes } from '../../../theme/spacing';

type Props = {
  recommendations: Recommendation[];
  hasZeroMatch?: boolean;
  query?: string;
};

export const RecommendationSection = memo(({ recommendations, hasZeroMatch, query }: Props) => {
  if (!recommendations.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Personalized picks will appear here</Text>
        <Text style={styles.emptyText}>Search by mood, rewards, genre, or time to get explainable matches.</Text>
      </View>
    );
  }

  // Zero-match case: no results matched the query, showing fallback suggestions
  if (hasZeroMatch && query) {
    return (
      <View>
        <View style={styles.zeroMatchContainer}>
          <Text style={styles.zeroMatchTitle}>
            I did not find a match of <Text style={styles.queryText}>"{query}"</Text>
          </Text>
          <Text style={styles.zeroMatchSubtitle}>However, following are my suggestions based on your taste:</Text>
        </View>
        <RecommendationList recommendations={recommendations} />
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
    width: -200,
    borderRadius: 0,
    marginBottom: 0,
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
  zeroMatchContainer: {
    padding: spacingSize.ss_15,
    borderRadius: spacingSize.ss_16,
    backgroundColor: colors.yellow,
    marginTop: spacingSize.ss_4,
    marginBottom: spacingSize.ss_12,
  },
  zeroMatchTitle: {
    fontSize: fontSizes.fs_16,
    fontWeight: '700',
    color: colors.blackShadeOne,
    lineHeight: 24,
  },
  queryText: {
    color: '#6C63FF',
    fontWeight: 'bold',
  },
  zeroMatchSubtitle: {
    marginTop: spacingSize.ss_8,
    color: colors.grey,
    fontSize: fontSizes.fs_14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
