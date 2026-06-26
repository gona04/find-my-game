import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StreamingIndicator } from './recomendations-streaming.component';
import { colors } from '../../theme/colors';
import { spacingSize, fontSizes } from '../../theme/spacing';

type RoutingPath = 'keyword' | 'llm' | null;

type Props = {
  loading: boolean;
  routingPath: RoutingPath;
  error: string | null;
};

/**
 * **RecommendationStatus**
 * Composite component for search state feedback.
 * Extracted to: consolidate conditional rendering logic
 * (streaming status, routing explanation, error message).
 *
 * Benefits:
 * - Single responsibility: status messaging
 * - Eliminates 3 conditional blocks from parent
 * - Reusable wherever we need streaming/error feedback
 * - Easy to add animations or styling later
 */
export const RecommendationStatus = memo(({ loading, routingPath, error }: Props) => {
  if (loading) {
    return <StreamingIndicator status="Thinking..." />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (routingPath) {
    const message = routingPath === 'keyword' ? 'catalog search' : 'AI preference extraction';
    return <Text style={styles.routeText}>Matched with {message}</Text>;
  }

  return null;
});

const styles = StyleSheet.create({
  routeText: {
    textAlign: 'center',
    color: colors.grey,
    fontWeight: '700',
    fontSize: fontSizes.fs_14,
    marginBottom: spacingSize.ss_10,
  },
  errorText: {
    textAlign: 'center',
    color: colors.pink,
    fontWeight: '700',
    fontSize: fontSizes.fs_14,
    marginBottom: spacingSize.ss_10,
  },
});
