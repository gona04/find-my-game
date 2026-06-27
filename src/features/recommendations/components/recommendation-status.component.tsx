import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { StreamingIndicator } from './recommendations-streaming.component';
import { colors } from '../../../theme/colors';
import { spacingSize, fontSizes } from '../../../theme/spacing';

type RoutingPath = 'keyword' | 'llm' | null;

type Props = {
  loading: boolean;
  routingPath: RoutingPath;
  error: string | null;
};

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
